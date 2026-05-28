# Walkerz authentication setup

The website uses Firebase Authentication for free-tier Google sign-in and mobile OTP login.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com/
2. Create a project.
3. Keep Google Analytics disabled unless you need it.

## 2. Enable authentication methods

In Firebase Console:

1. Go to **Authentication**.
2. Open **Sign-in method**.
3. Enable **Google**.
4. Enable **Phone**.

Firebase phone authentication has free/no-cost usage limits. Check the Firebase pricing page for current SMS limits in your country before production use.

## 3. Add a web app

1. In Firebase project settings, add a web app.
2. Copy these values from the Firebase config:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `appId`

## 4. Configure local environment

Create `.env.local` from `.env.example` and fill in the Firebase values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 5. Configure Vercel environment

Add the same variables in Vercel:

1. Open the `walkerz` project in Vercel.
2. Go to **Settings > Environment Variables**.
3. Add all four `NEXT_PUBLIC_FIREBASE_*` values.
4. Redeploy the production deployment.

## 6. Authorized domains

In Firebase Authentication settings, add the Vercel domains used by the site under **Authorized domains**.
