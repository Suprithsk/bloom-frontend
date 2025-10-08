# REPLACI - AI-Powered Furniture Visualization Platform

REPLACI helps customers see how furniture looks in their homes in 60 seconds using AI. This is the early access landing page for waitlist signups.

## Tech Stack

- React 18 + TypeScript
- Vite
- Bun (package manager)
- Tailwind CSS
- shadcn/ui components
- React Router DOM

## Quick Start

```bash
# Install dependencies
bun install

# Start development
bun run dev

# Build for production
bun run build

# Preview build
bun run preview
```

## Environment Setup

Copy `.env.example` to `.env` and add your keys:

```env
VITE_API_BASE_URL=your_api_url
VITE_AWS_ACCESS_KEY=your_aws_key
VITE_AWS_SECRET_KEY=your_aws_secret
VITE_S3_BUCKET_REGION=your_region
VITE_BUCKET_NAME=your_bucket
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## What's Inside

- **Landing Page**: Hero section with waitlist email capture
- **Interactive Demo**: Live furniture visualization with color variants
- **Legal Pages**: Terms & Privacy Policy with proper formatting
- **3D Configurator**: Advanced furniture customization page
- **Responsive Design**: Mobile-first approach

## Key Components

- `HeroSection` - Main landing with email signup form
- `ReplaciAction` - Interactive furniture demo (Orelia Daybed, Rejoice Sofa, Nuvia Sofa)
- `FeaturesSection` - Platform benefits showcase
- `CTASection` - Secondary email capture
- `Terms/Privacy` - Legal compliance pages

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── hero-section.tsx
│   ├── replaci-action.tsx
│   ├── features-section.tsx
│   └── navbar.tsx
├── pages/
│   ├── Index.tsx     # Main landing page
│   ├── Terms.tsx     # Terms & Conditions
│   ├── Privacy.tsx   # Privacy Policy
│   └── 3D2.tsx       # 3D configurator
├── hooks/
└── lib/
```

## Features

- Email waitlist with toast notifications
- Interactive furniture placement demo
- Color variant selection for furniture
- Real-time room visualization
- Legal compliance (Terms & Privacy)
- 3D model configuration interface
- AWS S3 integration for assets
- Razorpay payment integration ready

## Related Project

The full REPLACI platform is in `/Frontend` (Next.js) - this is the marketing/early access site.

## Contact

**Email**: hello@replaci.com
**Company**: SSR Replaci Solutions Private Limited

---

**AI furniture visualization for retailers - Built with React + TypeScript**