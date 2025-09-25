import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const presets = await prisma.presetWod.findMany({
      where: {
        isActive: true,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    })

    return NextResponse.json(presets)
  } catch (error) {
    console.error("Error fetching presets:", error)
    return NextResponse.json(
      { error: "Failed to fetch preset workouts" },
      { status: 500 }
    )
  }
}