import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUserSubscription } from "@/lib/subscription"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has premium subscription
    const subscription = await getUserSubscription(session.user.id)
    if (!subscription || subscription.tier !== 'PREMIUM') {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      )
    }

    // Get user's completed workouts with progress
    const history = await prisma.generatedWod.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        progress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Get WOD history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}