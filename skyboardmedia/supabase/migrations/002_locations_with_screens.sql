-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(10, 8) NOT NULL,
    lng NUMERIC(11, 8) NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create screen_types table for available screen types
CREATE TABLE IF NOT EXISTS public.screen_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default screen types
INSERT INTO public.screen_types (name, display_name) VALUES
    ('billboard', 'Billboard'),
    ('megalight', 'Megalight'),
    ('tramway_handle', 'Tramvay Tutamaç'),
    ('tramway_stop', 'Tramvay Durak'),
    ('bus_stop', 'Otobüs Durak'),
    ('clp_racket', 'CLP Raket'),
    ('digital_screen', 'Dijital Ekran')
ON CONFLICT (name) DO NOTHING;

-- Create location_screens table (junction table for locations and screen types)
CREATE TABLE IF NOT EXISTS public.location_screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    screen_type_id UUID NOT NULL REFERENCES public.screen_types(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, screen_type_id)
);

-- Create trigger for locations updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for location_screens updated_at
CREATE TRIGGER update_location_screens_updated_at
    BEFORE UPDATE ON public.location_screens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_screens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations
-- Anyone can view locations
CREATE POLICY "Anyone can view locations"
    ON public.locations
    FOR SELECT
    USING (true);

-- Only admins can insert locations
CREATE POLICY "Admins can insert locations"
    ON public.locations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update locations
CREATE POLICY "Admins can update locations"
    ON public.locations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete locations
CREATE POLICY "Admins can delete locations"
    ON public.locations
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for screen_types
-- Anyone can view screen types
CREATE POLICY "Anyone can view screen types"
    ON public.screen_types
    FOR SELECT
    USING (true);

-- RLS Policies for location_screens
-- Anyone can view location screens
CREATE POLICY "Anyone can view location screens"
    ON public.location_screens
    FOR SELECT
    USING (true);

-- Only admins can insert location screens
CREATE POLICY "Admins can insert location screens"
    ON public.location_screens
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update location screens
CREATE POLICY "Admins can update location screens"
    ON public.location_screens
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete location screens
CREATE POLICY "Admins can delete location screens"
    ON public.location_screens
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for performance
CREATE INDEX idx_locations_lat_lng ON public.locations(lat, lng);
CREATE INDEX idx_locations_created_by ON public.locations(created_by);
CREATE INDEX idx_location_screens_location_id ON public.location_screens(location_id);
CREATE INDEX idx_location_screens_screen_type_id ON public.location_screens(screen_type_id);

-- Grant permissions
GRANT ALL ON public.locations TO authenticated;
GRANT ALL ON public.screen_types TO authenticated;
GRANT ALL ON public.location_screens TO authenticated;
GRANT SELECT ON public.locations TO anon;
GRANT SELECT ON public.screen_types TO anon;
GRANT SELECT ON public.location_screens TO anon;
