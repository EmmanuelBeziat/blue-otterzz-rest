const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')

const userSchema = new mongoose.Schema({
	isActive: Boolean,
	name: { type: String, unique: true },
	email: { type: String, unique: true },
	password: String,
	about: String,
	registered: { type: Date, default: Date.new, required: true },
	picture: String,
	instruments: [String]
}, { minimize: false })

userSchema.plugin(mongooseUrlSlugs('name'))
userSchema.plugin(mongooseStringQuery)

const User = mongoose.model('User', UserSchema)

module.exports = User
