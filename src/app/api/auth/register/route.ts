import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")
    const { name, email, password } = await request.json()
    console.log("Parsed request body:", { name: name ? "present" : "missing", email: email ? "present" : "missing", password: password ? "present" : "missing" })

    if (!name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    console.log("Checking for existing user with email:", email)
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log("Existing user check result:", existingUser ? "user exists" : "user does not exist")

    if (existingUser) {
      console.log("User already exists, returning 400")
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    console.log("Hashing password")
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log("Password hashed successfully")

    console.log("Creating user in database")
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    console.log("User created successfully:", { id: user.id, email: user.email })

    // Return success (don't include password)
    const { password: _, ...userWithoutPassword } = user
    console.log("Registration completed successfully")
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}