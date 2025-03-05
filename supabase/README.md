# Supabase Setup for Reality Portal

This directory contains the database schema and setup instructions for the Reality Portal project using Supabase.

## Database Schema

The `schema.sql` file contains the complete database schema for the Reality Portal project, including:

- Tables for properties, users, messages, favorites, etc.
- Row-level security policies
- Initial data for property types and locations
- Triggers and functions for automatic timestamp updates and user profile creation

## How to Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Create a new query and paste the contents of `schema.sql`
4. Run the query to set up the database schema

## Environment Variables

After setting up your Supabase project, you'll need to add the following environment variables to your project:

1. In your local development environment, update the `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. In your Vercel project, add the same environment variables in the project settings.

You can find these values in your Supabase project settings under "API".

## Authentication Setup

The schema includes a trigger to automatically create a user profile when a new user signs up. To enable authentication:

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the authentication providers you want to use (Email, Google, etc.)
3. Customize email templates in Slovak language

## Database Relationships

The schema defines the following relationships:

- Users have many Properties
- Properties belong to a PropertyType
- Properties belong to a Location
- Properties have many PropertyImages
- Users can have many Favorites (saved properties)
- Users can send and receive Messages about Properties
