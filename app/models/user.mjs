import mongoose from 'mongoose'
import UserSchema from '../schemas/user.mjs'

const User = mongoose.model('User', UserSchema)

export default User
