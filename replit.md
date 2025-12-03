# sukusuku.ai - AI-Powered Creative Platform

## Overview

sukusuku.ai is a modern, minimalistic AI-powered creative platform designed for filmmakers, writers, creators, and educators. The application features a professional Apple-style design with a clean interface showcasing the platform's flagship products "Penora" and "ImageGene" - AI creative suites that offer script writing, AI image generation, music generation, video editing, and visual design capabilities. The project is built as a full-stack web application with a React frontend and Express backend, featuring a marketing landing page with smooth navigation and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)

- **Complete Authentication System**: Implemented Google OAuth with custom credentials for seamless login/signup
- **Credit Management**: Added user credit tracking system for Penora (100 credits) and ImageGene (50 credits)
- **Account Dashboard**: Created comprehensive user account page with profile info, credit tracking, and AI tool access
- **Enhanced Navigation**: Updated navigation to show user avatar, account menu, and authentication status
- **Database Schema**: Extended user table with credit fields and authentication tracking
- **Token-based Integration**: Implemented auth token system for seamless Penora/ImageGene access without re-login
- **User Interface**: Added avatar components, badges, and user-friendly account management interface
- **API Endpoints**: Created credit management and token generation endpoints for AI tool integration
- **Session Management**: Implemented secure session handling with PostgreSQL storage
- **ImageGene Integration**: Added full ImageGene AI image generator integration with dedicated full-screen interface
- **Navigation Updates**: Added "Try ImageGene" to main navigation (desktop and mobile)
- **New Routes**: Created `/imagegene` and `/account` routes for full user experience
- **Home Page Enhancement**: Added ImageGene showcase section with features and call-to-action
- **Features Update**: Updated features section to highlight ImageGene availability
- **Hostinger Builds**: Created cache-busted builds for deployment with ImageGene functionality
- **Penora URL Update**: Updated Penora integration to use new domain https://penora-writer-developeraim.replit.app
- **SSO Implementation**: Implemented seamless Single Sign-On for Penora using JWT tokens with 20-minute expiry
- **Navigation Enhancement**: Updated all Penora links to use SSO endpoint `/penora_link` for authenticated users
- **Security Enhancement**: Added JWT-based authentication with proper audience and issuer validation
- **Workspace Isolation Issue**: Identified critical workspace isolation problem in Penora requiring user-specific storage implementation
- **Google OAuth Branding Issue**: Identified that OAuth consent screen shows random domain string instead of "SukuSuku.ai" - requires Google Cloud Console verification process
- **Logo Enhancement**: Updated company logo with professional TM branding, larger sizing for better visibility, and matching header background color
- **Trademark Display**: Added proper ™ symbol positioning for SukuSuku™.ai branding

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive shadcn/ui component system with Radix UI primitives
- **Styling**: Tailwind CSS with custom sukusuku.ai brand colors (red #F40009, white, black)
- **Logo**: Custom SVG logo featuring AI neural network design with creative spark elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Design System**: Modular component architecture with consistent theming and responsive design

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js with middleware for JSON parsing, URL encoding, and request logging
- **Build System**: esbuild for server bundling and Vite for client bundling
- **Development**: Hot module replacement and error overlay for development experience
- **Storage Interface**: Abstracted storage layer with in-memory implementation for user management

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

### Authentication and Authorization
- **Google OAuth**: Direct Google OAuth integration with custom client credentials for secure authentication
- **User Schema**: Complete user model with email, names, profile image, credit tracking, and timestamps
- **Credit System**: Built-in credit management for Penora (100 initial) and ImageGene (50 initial) with usage tracking
- **Session Management**: PostgreSQL-based session storage with Passport.js and connect-pg-simple
- **Account Dashboard**: Comprehensive user account interface with profile management and credit tracking
- **Token Integration**: Seamless auth token system for Penora/ImageGene iframe integration without re-authentication
- **Database Storage**: User data stored in PostgreSQL with upsert operations and credit management
- **Protected Routes**: Authentication middleware for API endpoint protection
- **Frontend Integration**: React hooks for authentication state management with user avatars and account menus
- **SSO Integration**: JWT-based Single Sign-On with `/penora_link` endpoint for seamless Penora access
- **Token Management**: Short-lived JWT tokens (20 minutes) with proper security claims and validation
- **Cross-App Authentication**: Secure token-based communication between sukusuku.ai and external AI tools

### External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI for accessible, headless components
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Hookform Resolvers for form validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Tools**: Replit-specific plugins for development environment integration