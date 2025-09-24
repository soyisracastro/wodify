import { prisma } from './prisma'
import { SubscriptionTier } from '@prisma/client'

export const FREE_DAILY_WOD_LIMIT = 2

export interface UserSubscription {
  tier: SubscriptionTier
  isActive: boolean
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      tier: true,
      isActive: true,
    },
  })

  return subscription
}

export async function getTodayUsage(userId: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    select: {
      wodCount: true,
    },
  })

  return usage?.wodCount || 0
}

export async function incrementTodayUsage(userId: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.dailyUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      wodCount: {
        increment: 1,
      },
    },
    create: {
      userId,
      date: today,
      wodCount: 1,
    },
  })

  return usage.wodCount
}

export async function canGenerateWod(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId)

  if (!subscription || !subscription.isActive) {
    return { allowed: false, reason: 'No active subscription' }
  }

  if (subscription.tier === 'PREMIUM') {
    return { allowed: true }
  }

  // Check daily limit for FREE users
  const todayUsage = await getTodayUsage(userId)
  if (todayUsage >= FREE_DAILY_WOD_LIMIT) {
    return { allowed: false, reason: `Daily limit of ${FREE_DAILY_WOD_LIMIT} WODs reached` }
  }

  return { allowed: true }
}

export async function getRemainingWods(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId)

  if (!subscription || !subscription.isActive) {
    return 0
  }

  if (subscription.tier === 'PREMIUM') {
    return -1 // Unlimited
  }

  const todayUsage = await getTodayUsage(userId)
  return Math.max(0, FREE_DAILY_WOD_LIMIT - todayUsage)
}