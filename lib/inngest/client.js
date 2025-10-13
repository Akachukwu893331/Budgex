import { Inngest } from "inngest";

// ✅ Create a single Inngest client instance
export const inngest = new Inngest({
  id: "budgex-app", // app identifier (any name, but consistent)
  name: "Budgex",
  signingKey: process.env.INNGEST_SIGNING_KEY, // must match env var in Vercel
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
