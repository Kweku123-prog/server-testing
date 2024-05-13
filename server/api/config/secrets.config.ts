export const  DB_URL = process.env.DB_URL
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.PORT || 4000
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
export const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SID

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = parseInt(`${process.env.REDIS_PORT}`)

// Firebse service configuration
export const FIREBASE_TYPE =  process.env.FIREBASE_TYPE
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
export const FIREBASE_PRIVATE_KEY_ID =  process.env.FIREBASE_PRIVATE_KEY_ID
export const FIREBASE_PRIVATE_KEY =  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
export const FIREBASE_CLIENT_EMAIL =  process.env.FIREBASE_CLIENT_EMAIL
export const FIREBASE_CLIENT_ID =  process.env.FIREBASE_CLIENT_ID
export const FIREBASE_AUTH_URI =  process.env.FIREBASE_AUTH_URI
export const FIREBASE_TOKEN_URI =  process.env.FIREBASE_TOKEN_URI
export const FIREBASE_AUTH_PROVIDER_X509_CERT_URL =  process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL
export const FIREBASE_CLIENT_X509_CERT_URL =  process.env.FIREBASE_CLIENT_X509_CERT_URL
export const FIREBASE_UNIVERSE_DOMAIN =  process.env.FIREBASE_UNIVERSE_DOMAIN

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY

export const PAYSTACK_API_KEY = process.env.PAYSTACK_API_KEY