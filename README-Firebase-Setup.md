# Firebase Configuration Setup

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app or create one
6. Copy the configuration values to your `.env.local` file

## Firestore Database Setup

1. In Firebase Console, go to Firestore Database
2. Create a new database
3. Set up security rules (start in test mode for development)
4. Create a collection named "products"

## Firebase Admin (Server) Setup for Writes

Some API routes (e.g. `/api/categories` POST/DELETE, `/api/products/add`) use the Firebase Admin SDK to bypass client security rules on the server. You must provide admin credentials locally:

Option A — Inline env vars in `.env.local`:

1. In Firebase Console → Project Settings → Service accounts → Generate new private key (download JSON).
2. Open the JSON and copy:
   - `project_id` → FIREBASE_PROJECT_ID
   - `client_email` → FIREBASE_CLIENT_EMAIL
   - `private_key` → FIREBASE_PRIVATE_KEY (replace real newlines with \n)
3. Create `.env.local` in project root with:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

Option B — Application Default Credentials (ADC):

1. Save the downloaded JSON as `serviceAccountKey.json` in the project root.
2. Set env var to point to it:
   - Windows PowerShell:
     ```powershell
     $env:GOOGLE_APPLICATION_CREDENTIALS = "${PWD}\serviceAccountKey.json"
     ```
   - Or add to `.env.local`:
     ```
     GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
     ```

After adding env vars, restart the dev server.

### Why is this needed?
Without admin credentials, server routes cannot determine the project or may hit Firestore rules, leading to errors like:

> Unable to detect a Project Id in the current environment

or

> PERMISSION_DENIED: Missing or insufficient permissions

## Troubleshooting

- Make sure all environment variables start with `NEXT_PUBLIC_` for client-side access
- Restart your development server after adding environment variables
- Check browser console for specific Firebase error messages
- Ensure your Firestore security rules allow read access

## Fixed Issues

✅ Added proper Firebase initialization validation
✅ Improved error handling for offline scenarios
✅ Fixed accessibility warning for DialogContent
✅ Added network state management for Firebase
✅ Enhanced error messages for debugging
