const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')

const userSchema = new mongoose.Schema({
	isActive: { type: Boolean, default: true },
	name: { type: String, required: true, index: { unique: true } },
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	about: String,
	registered: { type: Date, default: Date.new },
	picture: String,
	instruments: [String]
}, { minimize: false })

userSchema.plugin(mongooseUrlSlugs('name'))
userSchema.plugin(mongooseStringQuery)

userSchema.pre('save', next => {
	let data = this
	console.log(data, this)
	bcrypt.hash(data.password, saltRounds, (err, hash) => {
		if (err) return next(err)

		console.log(hash)
		data.password = hash
		next()
	})
})

const User = mongoose.model('User', userSchema)

module.exports = User
