import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { location, equipment, level, injury } = await request.json()

    if (!location || !equipment || !level) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Create the prompt for OpenAI
    const prompt = `Create a CrossFit WOD (Workout of the Day) with the following specifications:

Location: ${location} (${location === 'HOME' ? 'Home workout - limited space, basic equipment' : 'Full gym access - complete CrossFit equipment'})
Equipment: ${equipment} (${equipment === 'BODYWEIGHT' ? 'Bodyweight only' : equipment === 'LIMITED' ? 'Limited equipment' : 'Full equipment access'})
Level: ${level} (${level === 'BEGINNER' ? 'Beginner - basic movements, lower intensity' : level === 'INTERMEDIATE' ? 'Intermediate - moderate intensity' : 'Advanced - high intensity, complex movements'})
${injury ? `Injury considerations: ${injury} - modify movements to avoid aggravating this condition` : ''}

Please create a complete WOD with the following structure in JSON format:

{
  "title": "A catchy name for the WOD",
  "warmUp": {
    "title": "Warm-up",
    "duration": "10-15 minutes",
    "parts": ["List of warm-up exercises"]
  },
  "strengthSkill": {
    "title": "Strength or Skill work",
    "details": ["Sets, reps, and movements for strength/skill portion"]
  },
  "metcon": {
    "title": "Metcon",
    "type": "AMRAP/For Time/EMOM/etc",
    "description": "Brief description of the workout structure",
    "movements": ["List of movements with reps/weights"],
    "notes": "Any scaling options or important notes"
  },
  "coolDown": {
    "title": "Cool-down",
    "duration": "5-10 minutes",
    "parts": ["List of cool-down and mobility exercises"]
  }
}

Make sure the WOD is:
- Safe and appropriate for the specified level
- Scalable for different fitness levels
- Uses appropriate equipment based on availability
- Includes proper warm-up and cool-down
- Has clear, specific instructions
- Is challenging but achievable

Respond with ONLY the JSON object, no additional text.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert CrossFit coach creating personalized workouts. Always prioritize safety and proper form."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      return NextResponse.json(
        { error: "Failed to generate WOD" },
        { status: 500 }
      )
    }

    // Parse the JSON response
    let wodData
    try {
      wodData = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", responseText)
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      )
    }

    // Save the generated WOD to database
    const savedWod = await prisma.generatedWod.create({
      data: {
        title: wodData.title,
        userId: session.user.id,
        isCustom: false,
        parameters: {
          location,
          equipment,
          level,
          injury: injury || "",
        },
        sections: {
          create: [
            {
              title: wodData.warmUp.title,
              type: "WARMUP",
              duration: wodData.warmUp.duration,
              movements: wodData.warmUp.parts || [],
              order: 0,
            },
            {
              title: wodData.strengthSkill.title,
              type: "STRENGTH",
              movements: wodData.strengthSkill.details || [],
              order: 1,
            },
            {
              title: wodData.metcon.title,
              type: "METCON",
              description: wodData.metcon.description,
              movements: wodData.metcon.movements || [],
              notes: wodData.metcon.notes,
              order: 2,
            },
            {
              title: wodData.coolDown.title,
              type: "COOLDOWN",
              duration: wodData.coolDown.duration,
              movements: wodData.coolDown.parts || [],
              order: 3,
            },
          ],
        },
      },
      include: {
        sections: true,
      },
    })

    // Transform the data to match the expected format
    const transformedWod = {
      title: savedWod.title,
      warmUp: {
        title: savedWod.sections.find((s: any) => s.type === "WARMUP")?.title || "Warm-up",
        duration: savedWod.sections.find((s: any) => s.type === "WARMUP")?.duration,
        parts: savedWod.sections.find((s: any) => s.type === "WARMUP")?.movements || [],
      },
      strengthSkill: {
        title: savedWod.sections.find((s: any) => s.type === "STRENGTH")?.title || "Strength",
        details: savedWod.sections.find((s: any) => s.type === "STRENGTH")?.movements || [],
      },
      metcon: {
        title: savedWod.sections.find((s: any) => s.type === "METCON")?.title || "Metcon",
        type: "For Time", // Default type
        description: savedWod.sections.find((s: any) => s.type === "METCON")?.description,
        movements: savedWod.sections.find((s: any) => s.type === "METCON")?.movements || [],
        notes: savedWod.sections.find((s: any) => s.type === "METCON")?.notes,
      },
      coolDown: {
        title: savedWod.sections.find((s: any) => s.type === "COOLDOWN")?.title || "Cool-down",
        duration: savedWod.sections.find((s: any) => s.type === "COOLDOWN")?.duration,
        parts: savedWod.sections.find((s: any) => s.type === "COOLDOWN")?.movements || [],
      },
    }

    return NextResponse.json(transformedWod)
  } catch (error) {
    console.error("WOD generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}