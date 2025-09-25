import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUserSubscription } from "@/lib/subscription"

export async function POST(request: NextRequest) {
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

    const { wodId } = await request.json()

    if (!wodId) {
      return NextResponse.json(
        { error: "WOD ID is required" },
        { status: 400 }
      )
    }

    // Update the generated WOD to mark it as saved
    const savedWod = await prisma.generatedWod.update({
      where: {
        id: wodId,
        userId: session.user.id, // Ensure user owns the WOD
      },
      data: {
        isCustom: true, // Mark as saved/custom
      },
      include: {
        sections: true,
      },
    })

    return NextResponse.json({
      success: true,
      wod: savedWod,
    })
  } catch (error) {
    console.error("Save WOD error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}