-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    height FLOAT CHECK (height > 0),
    current_weight FLOAT CHECK (current_weight > 0),
    desired_weight FLOAT CHECK (desired_weight > 0),
    current_body_fat FLOAT CHECK (current_body_fat >= 0 AND current_body_fat <= 100),
    desired_body_fat FLOAT CHECK (desired_body_fat >= 0 AND desired_body_fat <= 100),
    duration INT CHECK (duration > 0),
    workout_details JSONB NOT NULL,
    meal_preferences VARCHAR(50) NOT NULL CHECK (meal_preferences IN ('vegetarian', 'non-vegetarian')),
    medical_conditions TEXT,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create diet_plans table
CREATE TABLE diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create meal_logs table
CREATE TABLE meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_details JSONB NOT NULL,
    calories FLOAT CHECK (calories >= 0),
    protein FLOAT CHECK (protein >= 0),
    carbs FLOAT CHECK (carbs >= 0),
    fats FLOAT CHECK (fats >= 0),
    meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight FLOAT CHECK (weight > 0),
    body_fat FLOAT CHECK (body_fat >= 0 AND body_fat <= 100),
    measurement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_diet_plans_is_active ON diet_plans(is_active);
CREATE INDEX idx_meal_logs_user_id ON meal_logs(user_id);
CREATE INDEX idx_meal_logs_logged_at ON meal_logs(logged_at);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_measurement_date ON user_progress(measurement_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diet_plans_updated_at
    BEFORE UPDATE ON diet_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 