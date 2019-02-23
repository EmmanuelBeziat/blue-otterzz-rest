const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')
const bcrypt = require('bcrypt')
const validator = require('validator')

/**
 * Schema
 */
const userSchema = new mongoose.Schema({
	isActive: { type: Boolean, default: true },
	isAdmin: { type: Boolean, default: false },
	username: { type: String, required: true, index: { unique: true } },
	email: {
		type: String,
		required: true,
		index: { unique: true },
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
			isAsync: false
		},
		trim: true
	},
	password: { type: String, required: true, bcrypt: true },
	bio: String,
	registered: { type: Date, default: Date.new },
	picture: { type: String, trim: true },
	instruments: [String],
	preferences: {
		notifications: { type: Boolean, default: false }
	},
	recoveryCode: { type: String, trim: true, default: '' }
}, { minimize: false })

/**
 * Hooks
 */
/* userSchema.pre('save', next => {
	let data = this
	console.log(data, this)
	bcrypt.hash(data.password, 10, (err, hash) => {
		if (err) return next(err)

		console.log(hash)
		data.password = hash
		next()
	})
}) */

// Exemple renvoi password
/* UserSchema.pre('findOneAndUpdate', function(next) {
	if (!this._update.recoveryCode) next()

	email({
		type: 'password',
		email: this._conditions.email,
		passcode: this._update.recoveryCode,
	})
		.then(() => next())
		.catch(err => {
			console.log(err)
			next()
		})
})
 */
/**
 * Plugins
 */
userSchema.plugin(bcrypt)
userSchema.plugin(mongooseUrlSlugs('name'))
userSchema.plugin(mongooseStringQuery)

const User = mongoose.model('User', userSchema)

module.exports = User
