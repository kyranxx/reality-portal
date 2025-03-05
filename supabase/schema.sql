-- Create tables for Reality Portal

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property types
CREATE TABLE IF NOT EXISTS public.property_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Locations (regions/cities)
CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INTEGER REFERENCES public.locations(id),
  type TEXT NOT NULL -- 'region', 'city', 'district'
);

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  address TEXT,
  area NUMERIC NOT NULL, -- in square meters
  rooms INTEGER,
  property_type_id INTEGER REFERENCES public.property_types(id),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'sold', 'rented', 'inactive'
  is_featured BOOLEAN DEFAULT false
);

-- Property images
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_primary BOOLEAN DEFAULT false
);

-- Favorites (saved properties)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Create RLS policies

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties policies
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- Property images policies
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view property images"
  ON public.property_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their properties"
  ON public.property_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

CREATE POLICY "Users can update images for their properties"
  ON public.property_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

CREATE POLICY "Users can delete images for their properties"
  ON public.property_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

-- Favorites policies
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert messages they send"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update messages (mark as read)"
  ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Insert initial data

-- Property types
INSERT INTO public.property_types (name, description) VALUES
('Byt', 'Bytová jednotka v bytovom dome'),
('Dom', 'Rodinný dom'),
('Pozemok', 'Stavebný alebo iný pozemok'),
('Komerčná nehnuteľnosť', 'Kancelárske, obchodné alebo výrobné priestory'),
('Chata', 'Rekreačná chata alebo chalupa'),
('Garáž', 'Samostatná garáž alebo garážové státie');

-- Locations (regions)
INSERT INTO public.locations (name, type) VALUES
('Bratislavský kraj', 'region'),
('Trnavský kraj', 'region'),
('Trenčiansky kraj', 'region'),
('Nitriansky kraj', 'region'),
('Žilinský kraj', 'region'),
('Banskobystrický kraj', 'region'),
('Prešovský kraj', 'region'),
('Košický kraj', 'region');

-- Cities in Bratislavský kraj
INSERT INTO public.locations (name, parent_id, type) VALUES
('Bratislava', 1, 'city'),
('Pezinok', 1, 'city'),
('Senec', 1, 'city'),
('Malacky', 1, 'city');

-- Districts in Bratislava
INSERT INTO public.locations (name, parent_id, type) VALUES
('Staré Mesto', 9, 'district'),
('Ružinov', 9, 'district'),
('Nové Mesto', 9, 'district'),
('Petržalka', 9, 'district'),
('Dúbravka', 9, 'district');

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for properties table
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to create a profile after a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger after a user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
