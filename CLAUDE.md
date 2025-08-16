# MARQAIT Product

## Tech Stack
- **Frontend Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **State Management**: Zustand 5.0.6
- **Routing**: React Router DOM 7.7.0
- **Canvas/Graphics**: Fabric.js 6.7.1
- **PDF Generation**: jsPDF 3.0.1
- **AI Integration**: Fal AI Client
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Development Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production (TypeScript compile + Vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Project Structure
This is a React TypeScript application using modern tooling and state management patterns.

## Key Dependencies
- **@fal-ai/client** & **@fal-ai/serverless-client**: AI integration
- **fabric**: HTML5 canvas library for graphics manipulation
- **zustand**: Lightweight state management
- **react-router-dom**: Client-side routing

## Development Tools
- **ESLint**: Code linting with React-specific rules
- **TypeScript**: Static type checking
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

# Credit System Implementation

## Overview
Implemented a simplified credit management system where the frontend focuses only on displaying credits and refreshing after API calls. All credit deduction logic is handled by the backend.

## Key Components

### 1. Credit Store (`src/stores/creditStore.ts`)
- **Centralized state management** for credits using Zustand
- **Real-time updates** with 30-second cache duration
- **Simple credit fetching and refreshing**
- **Error handling** and cache management

### 2. Backend-Driven Approach
- Frontend does NOT know credit costs
- Frontend does NOT validate credits before API calls
- Backend handles ALL credit logic (validation, deduction, errors)
- Frontend only refreshes credits after API responses

### 3. Integration Pattern
```typescript
// Usage in components
const { fetchCreditsBalance } = useCreditStore();

const handleGenerate = async () => {
  setIsGenerating(true);
  setError(null);

  try {
    // Call backend API - backend handles credit deduction
    const result = await agentService.generateLogo(formData);
    setGeneratedLogo(result);
    
    // Refresh credits after successful generation
    await fetchCreditsBalance();
  } catch (error) {
    setError(error.message); // Backend returns credit errors
  } finally {
    setIsGenerating(false);
  }
};
```

## Implemented Features

### ✅ Logo Generator
- **Simple API call** to backend for generation
- **Credit refresh** after successful/failed generation
- **Backend error handling** for insufficient credits
- **No frontend credit validation**

### ✅ Sidebar Integration  
- **Real-time credit display** using centralized store
- **Automatic updates** when credits are refreshed
- **Loading states** and error handling

## Integration Guide for New Agents

### Step 1: Import the store
```typescript
import { useCreditStore } from "../stores/creditStore";
```

### Step 2: Use in component
```typescript
const { fetchCreditsBalance } = useCreditStore();
```

### Step 3: Call API and refresh credits
```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  setError(null);

  try {
    // Backend handles everything
    const result = await agentService.generateContent(formData);
    setGeneratedContent(result);
    
    // Refresh credits after backend operation
    await fetchCreditsBalance();
  } catch (error) {
    setError(error.message); // Backend sends credit error messages
  } finally {
    setIsGenerating(false);
  }
};
```

## Benefits
- **Backend-driven**: All credit logic centralized in backend
- **Simple frontend**: Frontend is dumb, just displays and refreshes
- **Real-time updates**: Credits update after each operation
- **Error handling**: Backend provides detailed error messages
- **Maintainable**: No credit business logic in frontend

## Backend Responsibilities
- Validate user has enough credits
- Deduct credits before processing
- Return appropriate error messages for insufficient credits
- Handle all credit-related business logic

## Frontend Responsibilities  
- Display current credit balance
- Refresh credits after API calls
- Show backend error messages to user
- Keep UI updated with latest credit state