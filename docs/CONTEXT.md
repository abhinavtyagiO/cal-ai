# Fitness Calorie Tracker Application

## Overview

The Fitness Calorie Tracker is a web application designed to help users track their calorie intake and diet progress while following their own workout plan. The app does not provide workout plans but adapts to the user's chosen workout routine and helps them optimize their diet accordingly. It leverages AI to estimate macros and calories, ensuring a smooth and intelligent tracking experience.

## Application Flow

### 1. User Onboarding

The onboarding process helps gather crucial user information to personalize the diet plan. The following details will be collected:

#### Basic Information:
- Name
- Age
- Height
- Current Weight
- Desired Weight

#### Body Composition Goals:
- Current Body Fat%
- Desired Body Fat%
- Time Duration of the Diet Plan

#### Workout Details:
- Workout frequency (how often they exercise per week)
- Workout schedule (days of the week)
- Cardio details

#### Dietary Preferences:
- Vegetarian / Non-vegetarian

#### Health Information:
- Any medical conditions

#### Additional Information:
- Any other details the user wants to provide


### 2. Diet Plan Generation

The OpenAI model generates an initial diet plan based on:
- User goals (body fat %, weight, time duration)
- Nationality-based food recommendations
- User's meal preferences (veg/non-veg)
- Workout frequency and type

The diet plan includes:
- Daily calorie intake
- Suggested macronutrient breakdown (protein, carbs, fats)
- Recommended meal options

Users can manually tweak their diet plan to fit their preferences.

### 3. Meal Tracking

Users can log their meals daily:
- Users enter meals into the system
- The AI estimates macros based on the food items
- The system tracks the daily intake and compares it with the recommended plan
- Users receive real-time feedback on whether they are meeting their macros

### 4. Data Storage & Tracking

The system stores:
- User details & goals
- Diet plans
- Daily meal logs

Users can view historical data to track their progress over time.

Potential integration with wearables (future feature) to automate meal logging.

### 5. Technology Stack

#### Backend/Database:
- Supabase
- Deepseek API - For AI-based macro estimations and diet plan generation
- Async support for efficient processing

#### Frontend:
- Next.js - For the UI and smooth user experience
- Tailwind CSS - For styling

#### Additional Considerations:
- Authentication System (future implementation)
- Role-Based Access Control (RBAC) (if needed for different user types like trainers)
- AI-enhanced food recognition (future feature to estimate calories from food images)

## Database Schema

### 1. User Table
Stores user information and goals.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    height FLOAT CHECK (height > 0),
    current_weight FLOAT CHECK (current_weight > 0),
    desired_weight FLOAT CHECK (desired_weight > 0),
    current_body_fat FLOAT CHECK (current_body_fat >= 0 AND current_body_fat <= 100),
    desired_body_fat FLOAT CHECK (desired_body_fat >= 0 AND desired_body_fat <= 100),
    duration INT CHECK (duration > 0),
    workout_details JSONB,
    meal_preferences VARCHAR(50) NOT NULL,
    medical_conditions TEXT,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. Diet Plan Table
Stores diet plans for each user, allowing multiple plans over time.

```sql
CREATE TABLE diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    daily_calories FLOAT CHECK (daily_calories > 0),
    protein FLOAT CHECK (protein >= 0),
    carbs FLOAT CHECK (carbs >= 0),
    fats FLOAT CHECK (fats >= 0),
    meal_plan JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_diet_plans_is_active ON diet_plans(is_active);
```

### 3. Meal Logs Table
Stores daily meal logs and macros for tracking.

```sql
CREATE TABLE meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_details JSONB NOT NULL,
    calories FLOAT CHECK (calories >= 0),
    protein FLOAT CHECK (protein >= 0),
    carbs FLOAT CHECK (carbs >= 0),
    fats FLOAT CHECK (fats >= 0),
    meal_type VARCHAR(50) NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meal_logs_user_id ON meal_logs(user_id);
CREATE INDEX idx_meal_logs_logged_at ON meal_logs(logged_at);
```

### 4. User Progress Table
Tracks user's progress over time.

```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight FLOAT CHECK (weight > 0),
    body_fat FLOAT CHECK (body_fat >= 0 AND body_fat <= 100),
    measurement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_measurement_date ON user_progress(measurement_date);
```

## Project Structure

```
fitness-calorie-tracker/
├── .github/                    # GitHub Actions workflows
├── docs/                       # Documentation
│   ├── CONTEXT.md             # Project context and requirements
│   └── API.md                 # API documentation
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── api/              # API routes
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components
│   ├── lib/                  # Utility functions and shared logic
│   │   ├── supabase/        # Supabase client and utilities
│   │   ├── ai/              # AI-related utilities
│   │   └── utils/           # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles
├── public/                  # Static assets
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/               # End-to-end tests
├── .env.example           # Example environment variables
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Future Enhancements

1. Food Image Recognition: Use AI to detect food items and estimate calories
2. Workout Data Integration: Sync with fitness wearables to adapt macros dynamically
3. Community Features: Users can share meal plans and experiences
4. Feature to upload physique image every week to track the progress.
