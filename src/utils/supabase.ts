import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in your Vercel project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log a warning if environment variables are not set (only in development)
if (process.env.NODE_ENV === 'development') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      'Supabase environment variables are not set. Authentication and database features will not work properly. ' +
      'Please copy .env.example to .env.local and set your Supabase credentials.'
    );
  }
}

// Types for our database tables
export type Property = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  rooms: number;
  property_type: string;
  user_id: string;
  images: string[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
};

export type Message = {
  id: string;
  created_at: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
};

export type Favorite = {
  id: string;
  created_at: string;
  user_id: string;
  property_id: string;
};
