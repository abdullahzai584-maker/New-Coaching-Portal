async function connectMongo() {
  if (!MONGODB_URI) {
    const availableMongoKeys = Object.keys(process.env).filter((k) =>
      k.toUpperCase().includes('MONGO')
    );
    throw new Error(
      `MONGODB_URI environment variable is missing. Found keys: ${availableMongoKeys.join(', ') || 'none'}`
    );
  }
  if (cachedDb.conn) return cachedDb.conn;
  if (!cachedDb.promise) {
    cachedDb.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cachedDb.conn = await cachedDb.promise;
  return cachedDb.conn;
}
