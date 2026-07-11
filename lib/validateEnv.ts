export function validateEnv() {
  const required = [
    'GROQ_API_KEY',
    'GROQ_MODEL', 
    'MONGODB_URI',
    'NEXTAUTH_SECRET'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Get your free Groq API key at: https://console.groq.com`
    )
  }
}
