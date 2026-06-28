import mongoose from 'mongoose'
import { hashPassword, comparePassword } from '../utils/password.mjs'

const UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true
  },
  password: { type: String, required: true },
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  }
})

UserSchema.pre('save', async function() {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password)
  }
})

UserSchema.methods = {
  comparePassword: async function(_password) {
    return comparePassword(_password, this.password)
  }
}

UserSchema.statics = {
  fetch: function() {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec()
  }
}

const User = mongoose.model('User', UserSchema)

export default User
