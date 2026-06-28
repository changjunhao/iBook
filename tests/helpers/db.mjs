import mongoose from 'mongoose'

const TEST_DB_URL = process.env.MONGO_URL
  ? process.env.MONGO_URL.replace(/\/[^/]+$/, '/iBook_test')
  : 'mongodb://127.0.0.1:27017/iBook_test'

let connected = false

export async function connectDB() {
  if (!connected) {
    await mongoose.connect(TEST_DB_URL, { autoCreate: true })
    connected = true
    console.log(`测试数据库已连接: ${TEST_DB_URL}`)
  }
}

export async function disconnectDB() {
  await mongoose.disconnect()
  connected = false
}

export async function clearDB() {
  const db = mongoose.connection.db
  if (!db) return
  const collections = await db.listCollections().toArray()
  for (const c of collections) {
    await db.collection(c.name).deleteMany({})
  }
}
