import mongoose from 'mongoose';

// Define the type for the cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Add this to declare the global mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aidev';

// Check if we're in a Next.js build/static generation environment
const isNextJsBuild = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  // Skip actual database connection during build
  if (isNextJsBuild) {
    console.log('Skipping database connection during build phase');
    return mongoose; // Return mongoose instance without connecting
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    
    // Don't throw during build, just return mongoose
    if (!isNextJsBuild) {
      throw e;
    }
  }

  return cached.conn || mongoose;
}

// Helper function to check if Mongoose is connected
export function isConnected(): boolean {
  // Skip connection check during build
  if (isNextJsBuild) {
    return true;
  }
  return mongoose.connection.readyState === 1;
} 