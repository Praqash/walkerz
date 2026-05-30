# Walkerz authentication setup

The website uses Firebase Authentication for Gmail/Google login.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com/
2. Create a project.
3. Keep Google Analytics disabled unless you need it.

## 2. Enable Gmail login

In Firebase Console:

1. Go to **Authentication**.
2. Click **Get started** if Authentication is not enabled yet.
3. Open **Sign-in method**.
4. Enable **Google**.
5. Choose a project support email and save.

## 3. Add a web app

1. Go to **Project settings**.
2. Under **Your apps**, click the web icon.
3. Register the app as `walkerz-web`.
4. Copy these values from the Firebase config:
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

In Firebase Console:

1. Go to **Authentication > Settings > Authorized domains**.
2. Add your Vercel domain, for example:
   - `website-six-puce-69.vercel.app`
3. Add any custom domain later if you connect one.

Firebase Google login does not need mobile OTP or paid SMS services.
