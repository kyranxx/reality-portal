# Reality Portal

A real estate portal built with Next.js, Firebase, and Tailwind CSS.

## Features

- User authentication with Firebase Authentication
- Property listings with Firestore database
- Responsive design with Tailwind CSS
- Server-side rendering with Next.js
- Property search and filtering
- User dashboard for managing properties and favorites
- Admin panel for managing users and properties

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/reality-portal.git
cd reality-portal
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add a web app to your project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database

4. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration values

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

### Authentication

1. In the Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password and Google providers
3. Add your domain to the authorized domains list

### Firestore Database

1. In the Firebase Console, go to Firestore Database
2. Create a new database in production mode
3. Set up the following collections:
   - `properties`: For storing property listings
   - `users`: For storing user profiles
   - `favorites`: For storing user favorites
   - `messages`: For storing user messages

### Firestore Rules

Add the following rules to your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read properties
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own favorites
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow users to read and write their own messages
    match /messages/{messageId} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.senderId || request.auth.uid == resource.data.recipientId);
      allow write: if request.auth != null && request.auth.uid == request.resource.data.senderId;
    }
  }
}
```

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
- `src/utils`: Utility functions and Firebase configuration
- `src/data`: Sample data for development
- `public`: Static assets

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

This project is licensed under the MIT License.
