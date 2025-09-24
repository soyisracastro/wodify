-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'COACH');

-- CreateEnum
CREATE TYPE "public"."UserLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "public"."Location" AS ENUM ('GYM', 'HOME');

-- CreateEnum
CREATE TYPE "public"."Equipment" AS ENUM ('FULL', 'BODYWEIGHT', 'LIMITED');

-- CreateEnum
CREATE TYPE "public"."WodDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE');

-- CreateEnum
CREATE TYPE "public"."WodSectionType" AS ENUM ('WARMUP', 'STRENGTH', 'SKILL', 'METCON', 'COOLDOWN');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "level" "public"."UserLevel" NOT NULL DEFAULT 'BEGINNER',
    "location" "public"."Location" NOT NULL DEFAULT 'GYM',
    "equipment" "public"."Equipment" NOT NULL DEFAULT 'FULL',
    "injuries" TEXT,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."PresetWod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "public"."WodDifficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "duration" TEXT,
    "equipment" "public"."Equipment" NOT NULL,
    "location" "public"."Location" NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresetWod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GeneratedWod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "parameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedWod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WodSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."WodSectionType" NOT NULL,
    "duration" TEXT,
    "description" TEXT,
    "movements" TEXT[],
    "sets" TEXT,
    "reps" TEXT,
    "weight" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presetWodId" TEXT,
    "generatedWodId" TEXT,

    CONSTRAINT "WodSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatedWodId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "notes" TEXT,
    "rating" INTEGER,
    "perceivedEffort" INTEGER,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WodFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "presetWodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WodFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "WodSection_presetWodId_idx" ON "public"."WodSection"("presetWodId");

-- CreateIndex
CREATE INDEX "WodSection_generatedWodId_idx" ON "public"."WodSection"("generatedWodId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "public"."UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_generatedWodId_idx" ON "public"."UserProgress"("generatedWodId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_generatedWodId_key" ON "public"."UserProgress"("userId", "generatedWodId");

-- CreateIndex
CREATE INDEX "WodFavorite_userId_idx" ON "public"."WodFavorite"("userId");

-- CreateIndex
CREATE INDEX "WodFavorite_presetWodId_idx" ON "public"."WodFavorite"("presetWodId");

-- CreateIndex
CREATE UNIQUE INDEX "WodFavorite_userId_presetWodId_key" ON "public"."WodFavorite"("userId", "presetWodId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GeneratedWod" ADD CONSTRAINT "GeneratedWod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WodSection" ADD CONSTRAINT "WodSection_presetWodId_fkey" FOREIGN KEY ("presetWodId") REFERENCES "public"."PresetWod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WodSection" ADD CONSTRAINT "WodSection_generatedWodId_fkey" FOREIGN KEY ("generatedWodId") REFERENCES "public"."GeneratedWod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_generatedWodId_fkey" FOREIGN KEY ("generatedWodId") REFERENCES "public"."GeneratedWod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WodFavorite" ADD CONSTRAINT "WodFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WodFavorite" ADD CONSTRAINT "WodFavorite_presetWodId_fkey" FOREIGN KEY ("presetWodId") REFERENCES "public"."PresetWod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
