import { UserRole, UserLevel, Location, Equipment } from "@prisma/client"
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      level: UserLevel
      location: Location
      equipment: Equipment
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    level: UserLevel
    location: Location
    equipment: Equipment
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: UserRole
    level: UserLevel
    location: Location
    equipment: Equipment
  }
}