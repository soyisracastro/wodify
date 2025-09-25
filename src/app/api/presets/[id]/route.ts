import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const preset = await prisma.presetWod.findUnique({
      where: {
        id: (await params).id,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!preset) {
      return NextResponse.json(
        { error: "Preset workout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(preset)
  } catch (error) {
    console.error("Error fetching preset:", error)
    return NextResponse.json(
      { error: "Failed to fetch preset workout" },
      { status: 500 }
    )
  }
}