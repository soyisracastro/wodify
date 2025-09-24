import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const presetWods = [
  {
    title: "Fran",
    description: "A classic CrossFit benchmark WOD",
    difficulty: "INTERMEDIATE" as const,
    duration: "5-10 minutes",
    equipment: "FULL" as const,
    location: "GYM" as const,
    category: "Benchmark",
    tags: ["thruster", "pullup", "benchmark", "classic"],
    sections: [
      {
        title: "Warm-up",
        type: "WARMUP" as const,
        duration: "10 minutes",
        movements: [
          "2 rounds:",
          "10 Air Squats",
          "10 Push-ups",
          "10 Pull-ups or Ring Rows",
          "10 Thrusters with empty bar"
        ]
      },
      {
        title: "Strength: Thruster Technique",
        type: "STRENGTH" as const,
        movements: [
          "5x3 Thrusters",
          "Build to workout weight"
        ]
      },
      {
        title: "Metcon: Fran",
        type: "METCON" as const,
        description: "21-15-9 reps for time of:",
        movements: [
          "Thrusters (95/65 lb)",
          "Pull-ups"
        ],
        notes: "Scale weight as needed. Modify pull-ups with bands or ring rows."
      },
      {
        title: "Cool-down",
        type: "COOLDOWN" as const,
        duration: "5 minutes",
        movements: [
          "Easy 400m walk or jog",
          "Shoulder mobility: 1 minute each arm",
          "Hip flexor stretch: 30 seconds each side"
        ]
      }
    ]
  },
  {
    title: "Cindy",
    description: "Bodyweight benchmark WOD",
    difficulty: "BEGINNER" as const,
    duration: "20 minutes",
    equipment: "BODYWEIGHT" as const,
    location: "GYM" as const,
    category: "Benchmark",
    tags: ["bodyweight", "pullup", "pushup", "squat", "benchmark"],
    sections: [
      {
        title: "Warm-up",
        type: "WARMUP" as const,
        duration: "10 minutes",
        movements: [
          "3 rounds:",
          "10 Jumping Jacks",
          "10 Air Squats",
          "10 Push-ups",
          "10 Ring Rows or Inverted Rows"
        ]
      },
      {
        title: "Skill: Movement Review",
        type: "SKILL" as const,
        movements: [
          "Review proper squat form",
          "Review push-up standards",
          "Review pull-up or scaling options"
        ]
      },
      {
        title: "Metcon: Cindy",
        type: "METCON" as const,
        description: "AMRAP in 20 minutes:",
        movements: [
          "5 Pull-ups",
          "10 Push-ups",
          "15 Air Squats"
        ],
        notes: "Scale movements as needed. Complete as many rounds as possible."
      },
      {
        title: "Cool-down",
        type: "COOLDOWN" as const,
        duration: "5 minutes",
        movements: [
          "Light stretching",
          "Focus on shoulders, chest, and hips"
        ]
      }
    ]
  },
  {
    title: "Murph",
    description: "Hero WOD - Memorial Day classic",
    difficulty: "ADVANCED" as const,
    duration: "45-60 minutes",
    equipment: "FULL" as const,
    location: "GYM" as const,
    category: "Hero",
    tags: ["hero", "running", "pullup", "pushup", "squat", "vest"],
    sections: [
      {
        title: "Warm-up",
        type: "WARMUP" as const,
        duration: "15 minutes",
        movements: [
          "400m Run",
          "3 rounds:",
          "10 Pull-ups",
          "15 Push-ups",
          "20 Air Squats"
        ]
      },
      {
        title: "Strength: Partitioning Strategy",
        type: "STRENGTH" as const,
        movements: [
          "Plan your partitioning strategy",
          "Practice transitions between movements"
        ]
      },
      {
        title: "Metcon: Murph",
        type: "METCON" as const,
        description: "For time:",
        movements: [
          "1 mile Run",
          "100 Pull-ups",
          "200 Push-ups",
          "300 Air Squats",
          "1 mile Run"
        ],
        notes: "Partition the pull-ups, push-ups, and squats as needed. Wear a 20lb vest if possible."
      },
      {
        title: "Cool-down",
        type: "COOLDOWN" as const,
        duration: "10 minutes",
        movements: [
          "Walk 400m",
          "Full body stretching",
          "Focus on recovery"
        ]
      }
    ]
  },
  {
    title: "Home Bodyweight Blast",
    description: "Full body workout for home training",
    difficulty: "INTERMEDIATE" as const,
    duration: "30 minutes",
    equipment: "BODYWEIGHT" as const,
    location: "HOME" as const,
    category: "Home",
    tags: ["home", "bodyweight", "fullbody", "noequipment"],
    sections: [
      {
        title: "Warm-up",
        type: "WARMUP" as const,
        duration: "10 minutes",
        movements: [
          "3 rounds:",
          "20 Jumping Jacks",
          "10 Arm Circles forward and backward",
          "10 Leg Swings each leg",
          "10 Bodyweight Squats"
        ]
      },
      {
        title: "Strength: Core Circuit",
        type: "STRENGTH" as const,
        movements: [
          "4 rounds:",
          "20 Plank Shoulder Taps",
          "20 Russian Twists",
          "20 Bicycle Crunches"
        ]
      },
      {
        title: "Metcon: Home Bodyweight Blast",
        type: "METCON" as const,
        description: "AMRAP in 15 minutes:",
        movements: [
          "10 Burpees",
          "15 Push-ups",
          "20 Air Squats",
          "25 Mountain Climbers"
        ],
        notes: "Modify burpees to step-back if needed. Scale push-ups to knees."
      },
      {
        title: "Cool-down",
        type: "COOLDOWN" as const,
        duration: "5 minutes",
        movements: [
          "Child's pose: 1 minute",
          "Downward dog: 1 minute",
          "Seated forward fold: 1 minute"
        ]
      }
    ]
  },
  {
    title: "Garage Gym Power",
    description: "Strength-focused workout for limited equipment",
    difficulty: "ADVANCED" as const,
    duration: "45 minutes",
    equipment: "LIMITED" as const,
    location: "HOME" as const,
    category: "Strength",
    tags: ["strength", "dumbbell", "kettlebell", "homegym"],
    sections: [
      {
        title: "Warm-up",
        type: "WARMUP" as const,
        duration: "10 minutes",
        movements: [
          "3 rounds:",
          "10 Dumbbell Deadlifts (light)",
          "10 Dumbbell Shoulder Press (light)",
          "10 Goblet Squats (light)"
        ]
      },
      {
        title: "Strength: Power Complex",
        type: "STRENGTH" as const,
        movements: [
          "5 rounds:",
          "5 Dumbbell Deadlifts",
          "5 Dumbbell Hang Power Cleans",
          "5 Dumbbell Front Squats",
          "5 Dumbbell Push Press"
        ]
      },
      {
        title: "Metcon: Garage Power",
        type: "METCON" as const,
        description: "3 rounds for time:",
        movements: [
          "20 Dumbbell Thrusters",
          "15 Dumbbell Box Step-ups",
          "10 Dumbbell Man Makers"
        ],
        notes: "Use moderate dumbbells. Scale movements as needed."
      },
      {
        title: "Cool-down",
        type: "COOLDOWN" as const,
        duration: "5 minutes",
        movements: [
          "Dumbbell farmer carry: 2 minutes",
          "Shoulder and hip mobility"
        ]
      }
    ]
  }
]

async function main() {
  console.log('Start seeding...')

  for (const wodData of presetWods) {
    const wod = await prisma.presetWod.create({
      data: {
        title: wodData.title,
        description: wodData.description,
        difficulty: wodData.difficulty,
        duration: wodData.duration,
        equipment: wodData.equipment,
        location: wodData.location,
        category: wodData.category,
        tags: wodData.tags,
        isActive: true,
        sections: {
          create: wodData.sections.map((section, index) => ({
            title: section.title,
            type: section.type,
            duration: section.duration,
            description: section.description,
            movements: section.movements,
            notes: section.notes,
            order: index,
          }))
        }
      }
    })
    console.log(`Created WOD: ${wod.title}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })