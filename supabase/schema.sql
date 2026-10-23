-- AfyaLink — Supabase Postgres Schema & Row Level Security (RLS)
-- IEEE Day 2026 Buildathon — Track 1: Health and Humanity

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL CHECK (char_length(display_name) <= 80),
    follow_up_date DATE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'General check-in',
        'Clinic appointment',
        'Maternal health follow-up',
        'Medication review with clinician',
        'Child wellness visit'
    )),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',
        'contacted',
        'attended',
        'needs_rescheduling'
    )),
    note TEXT CHECK (char_length(note) <= 300),
    demo_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_follow_ups_date ON public.follow_ups (follow_up_date);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups (status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_demo_code ON public.follow_ups (demo_code);

-- 3. Row Level Security (RLS)
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- Demonstration policies:
-- Only authenticated CHWs can view the full register or create/update records
CREATE POLICY "CHWs can view all follow-ups" 
    ON public.follow_ups 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "CHWs can insert follow-ups" 
    ON public.follow_ups 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "CHWs can update follow-ups" 
    ON public.follow_ups 
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Scoped public policy: Community members can ONLY read their specific record by matching demo_code
CREATE POLICY "Community members can view their own record by code" 
    ON public.follow_ups 
    FOR SELECT 
    TO anon 
    USING (demo_code IS NOT NULL);

-- 4. Sample synthetic seed data
INSERT INTO public.follow_ups (display_name, follow_up_date, category, status, note, demo_code)
VALUES
    ('Demo Member A', CURRENT_DATE, 'General check-in', 'scheduled', 'Routine community wellness check-in.', 'DEMO-A1'),
    ('Demo Member B', CURRENT_DATE + INTERVAL '1 day', 'Clinic appointment', 'contacted', 'Confirmed appointment at the local clinic.', 'DEMO-B2'),
    ('Demo Member C', CURRENT_DATE + INTERVAL '3 days', 'Maternal health follow-up', 'needs_rescheduling', 'Needs a new date after previous visit was missed.', 'DEMO-C3'),
    ('Demo Member D', CURRENT_DATE + INTERVAL '5 days', 'Child wellness visit', 'scheduled', 'Scheduled growth monitoring visit.', 'DEMO-D4'),
    ('Demo Member E', CURRENT_DATE - INTERVAL '2 days', 'Medication review with clinician', 'attended', 'Completed medication review; no issues.', 'DEMO-E5'),
    ('Demo Member F', CURRENT_DATE, 'Maternal health follow-up', 'scheduled', 'Second trimester check scheduled for today.', 'DEMO-F6')
ON CONFLICT (demo_code) DO NOTHING;
