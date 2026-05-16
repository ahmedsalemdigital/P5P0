import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Forward Vercel's VERCEL_ENV signal into the client bundle so the
// analytics bootstrap in index.html can distinguish production deploys
// from preview deploys without relying on hostname guessing.
//   'production'  — Vercel production (CookieYes path only)
//   'preview'     — Vercel preview deploy (auto-load GTM)
//   'development' — local dev or unknown (auto-load GTM)
process.env.VITE_VERCEL_ENV =
  process.env.VITE_VERCEL_ENV || process.env.VERCEL_ENV || 'development'

export default defineConfig({
  plugins: [react()],
})
