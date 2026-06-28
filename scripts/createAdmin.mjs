import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../src/models/user.mjs'
import config from '../src/config.mjs'

const ADMIN_NAME = process.env.ADMIN_NAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_ROLE = parseInt(process.env.ADMIN_ROLE, 10) || 10

async function createAdmin() {
  try {
    await mongoose.connect(config.db.url)
    console.log('数据库连接成功')

    const existing = await User.findOne({ name: ADMIN_NAME })
    if (existing) {
      console.log(`用户 "${ADMIN_NAME}" 已存在，角色: ${existing.role >= 10 ? '管理员' : '普通用户'}`)
      if (existing.role < ADMIN_ROLE) {
        existing.role = ADMIN_ROLE
        await existing.save()
        console.log(`已将其角色提升为管理员 (role: ${ADMIN_ROLE})`)
      }
    } else {
      const user = new User({
        name: ADMIN_NAME,
        password: ADMIN_PASSWORD,
        role: ADMIN_ROLE
      })
      await user.save()
      console.log(`管理员账号创建成功!`)
      console.log(`  用户名: ${ADMIN_NAME}`)
      console.log(`  角色: ${ADMIN_ROLE} (管理员)`)
    }

    await mongoose.disconnect()
    console.log('数据库连接已关闭')
  } catch (err) {
    console.error('创建管理员账号失败:', err.message)
    process.exit(1)
  }
}

createAdmin()
