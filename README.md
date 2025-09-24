# WODify - CrossFit WOD Generator

A modern, AI-powered CrossFit workout generator built with Next.js, TypeScript, and PostgreSQL. Create personalized workouts based on your fitness level, equipment availability, and training goals.

## Features

- 🤖 **AI-Powered Workouts**: Generate personalized CrossFit WODs using OpenAI
- 🔐 **User Authentication**: Secure login and registration system
- 📊 **Progress Tracking**: Monitor your fitness journey and workout history
- 🏋️ **Equipment Flexible**: Workouts adapt to gym, home, or bodyweight-only training
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎯 **Preset WODs**: Access to classic CrossFit benchmark workouts
- ⚙️ **Profile Management**: Customize your experience based on fitness level and preferences

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API for workout generation
- **Deployment**: Optimized for Vercel

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

## Getting Started

### 1. Clone and Setup

```bash
git clone <repository-url>
cd wodify-app
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wodify_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key-here"

# Email (for password reset, optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 3. Database Setup

1. **Install PostgreSQL** and create a database named `wodify_db`

2. **Run Prisma migrations**:
```bash
npx prisma migrate dev --name init
```

3. **Seed the database** with preset WODs:
```bash
npx tsx prisma/seed.ts
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view database
- `npx prisma migrate dev` - Create and apply database migrations
- `npx tsx prisma/seed.ts` - Seed database with preset WODs

## Project Structure

```
wodify-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── ...
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── providers/     # Context providers
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
└── public/               # Static assets
```

## Key Features Implementation

### User Authentication
- Email/password authentication with NextAuth.js
- Secure password hashing with bcrypt
- Session management with JWT tokens

### AI-Powered WOD Generation
- Integration with OpenAI GPT-3.5-turbo
- Context-aware workout generation based on user profile
- Equipment and location-specific modifications

### Database Design
- **Users**: User profiles and authentication data
- **PresetWods**: Pre-defined CrossFit workouts (Fran, Cindy, Murph, etc.)
- **GeneratedWods**: AI-generated workouts for users
- **UserProgress**: Workout completion tracking
- **WodSections**: Structured workout components

### Preset WODs Included
- **Fran**: Classic thruster and pull-up benchmark
- **Cindy**: Bodyweight AMRAP workout
- **Murph**: Hero WOD with running and bodyweight movements
- **Home Bodyweight Blast**: Equipment-free home workout
- **Garage Gym Power**: Limited equipment strength workout

## Customization

### Adding New Preset WODs

1. Add the WOD data to `prisma/seed.ts`
2. Run `npx tsx prisma/seed.ts` to populate the database

### Modifying AI Prompts

Edit the prompt in `src/app/api/wod/generate/route.ts` to customize workout generation logic.

### Styling

The app uses Tailwind CSS with custom components. Modify styles in:
- `src/app/globals.css` for global styles
- `src/components/ui/` for component-specific styles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for the CrossFit community
