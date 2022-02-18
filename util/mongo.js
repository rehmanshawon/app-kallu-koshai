import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URI;

if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  console.log("no catch");
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log(cached.conn);
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGO_URL, opts)
      .then((mongoose) => {
        console.log(mongoose);
        return mongoose;
      })
      .catch((err) => {
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
