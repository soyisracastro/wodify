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

    const { wodId, duration, notes, rating, perceivedEffort } = await request.json()

    if (!wodId) {
      return NextResponse.json(
        { error: "WOD ID is required" },
        { status: 400 }
      )
    }

    // Check if progress already exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_generatedWodId: {
          userId: session.user.id,
          generatedWodId: wodId,
        },
      },
    })

    if (existingProgress) {
      return NextResponse.json(
        { error: "WOD already marked as completed" },
        { status: 409 }
      )
    }

    // Create progress record
    const progress = await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        generatedWodId: wodId,
        duration: duration ? parseInt(duration) : undefined,
        notes,
        rating: rating ? parseInt(rating) : undefined,
        perceivedEffort: perceivedEffort ? parseInt(perceivedEffort) : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error("Complete WOD error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}