import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserSubscription, getRemainingWods, FREE_DAILY_WOD_LIMIT } from "@/lib/subscription"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const subscription = await getUserSubscription(session.user.id)
    const remainingWods = await getRemainingWods(session.user.id)

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      tier: subscription.tier,
      isActive: subscription.isActive,
      remainingWods: remainingWods === -1 ? "unlimited" : remainingWods,
      dailyLimit: subscription.tier === "PREMIUM" ? "unlimited" : FREE_DAILY_WOD_LIMIT,
    })
  } catch (error) {
    console.error("Subscription status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}