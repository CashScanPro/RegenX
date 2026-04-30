-- RegenX Initial Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC(5,1),
    weight_kg NUMERIC(5,1),
    fitness_level TEXT DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    fitness_goals TEXT[] DEFAULT '{}',
    health_conditions TEXT[] DEFAULT '{}',
    preferred_language TEXT DEFAULT 'fr',
    country TEXT DEFAULT 'FR',
    timezone TEXT DEFAULT 'Europe/Paris',
    gdpr_consent BOOLEAN DEFAULT false,
    gdpr_consent_date TIMESTAMPTZ,
    marketing_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- WORKOUTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'strength' CHECK (type IN ('strength', 'cardio', 'hiit', 'yoga', 'recovery', 'mobility')),
    difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    exercises JSONB DEFAULT '[]',
    ai_generated BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- NUTRITION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'balanced' CHECK (type IN ('balanced', 'keto', 'vegan', 'vegetarian', 'paleo', 'mediterranean')),
    calories_target INTEGER,
    protein_g INTEGER,
    carbs_g INTEGER,
    fat_g INTEGER,
    meals JSONB DEFAULT '[]',
    supplements JSONB DEFAULT '[]',
    cbd_recommendations JSONB DEFAULT '[]',
    active BOOLEAN DEFAULT true,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- AI SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT DEFAULT 'chat' CHECK (session_type IN ('chat', 'workout', 'nutrition', 'recovery')),
    messages JSONB DEFAULT '[]',
    tokens_used INTEGER DEFAULT 0,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- PROGRESS TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.progress_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,1),
    body_fat_percent NUMERIC(4,1),
    muscle_mass_kg NUMERIC(5,1),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    sleep_hours NUMERIC(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    workout_completed BOOLEAN DEFAULT false,
    notes TEXT,
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Workouts policies
CREATE POLICY "Users can CRUD own workouts" ON public.workouts USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Nutrition plans policies
CREATE POLICY "Users can CRUD own nutrition plans" ON public.nutrition_plans USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI sessions policies
CREATE POLICY "Users can CRUD own AI sessions" ON public.ai_sessions USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Progress tracking policies
CREATE POLICY "Users can CRUD own progress" ON public.progress_tracking USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
  INSERT INTO public.subscriptions (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER workouts_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER nutrition_plans_updated_at BEFORE UPDATE ON public.nutrition_plans FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_scheduled ON public.workouts(scheduled_for);
CREATE INDEX idx_nutrition_plans_user_id ON public.nutrition_plans(user_id);
CREATE INDEX idx_ai_sessions_user_id ON public.ai_sessions(user_id);
CREATE INDEX idx_progress_user_date ON public.progress_tracking(user_id, date);
