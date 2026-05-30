# Walkerz authentication setup

The website uses Supabase Auth for free-tier Google sign-in and email OTP login.

Mobile SMS OTP is not included because SMS delivery normally requires a paid provider. Email OTP/magic-link login stays free-tier friendly and works well on Vercel.

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard/projects
2. Create a new project.
3. Choose the free plan.
4. Save the project URL and anon public key from **Project Settings > API**.

## 2. Enable authentication methods

In Supabase Dashboard:

1. Go to **Authentication > Providers**.
2. Enable **Email**.
3. Enable **Google**.

For Google login, Supabase requires Google OAuth credentials. Create them in Google Cloud Console, then add the Client ID and Client Secret in Supabase's Google provider settings.

## 3. Configure redirect URLs

In Supabase Dashboard:

1. Go to **Authentication > URL Configuration**.
2. Set **Site URL** to your production Vercel URL.
3. Add your local and Vercel URLs to **Redirect URLs**:
   - `http://localhost:3000`
   - Your Vercel production URL
   - Any custom domain you add later

## 4. Configure local environment

Create `.env.local` from `.env.example` and fill in the Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 5. Configure Vercel environment

Add the same variables in Vercel:

1. Open the `walkerz` project in Vercel.
2. Go to **Settings > Environment Variables**.
3. Add both `NEXT_PUBLIC_SUPABASE_*` values.
4. Redeploy the production deployment.

## 6. CLI option

After creating the Supabase project, you can set Vercel variables from the terminal:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

Repeat for preview/development if needed.
