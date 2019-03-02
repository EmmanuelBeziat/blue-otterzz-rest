const config = require('../config')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const errors = require('restify-errors')
const jsonWebToken = require('jsonwebtoken')

module.exports = (server) => {
	/**
	 * Login
	 */
	server.post('/login', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		let data = req.body || {}

		User.findOne({ slug: data.username }, '+password' , (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			bcrypt.compare(data.password, user.password, (err, result) => {
				if (err) {
					return next(
						new errors.InvalidContentError('Bcrypt error: ' + err.message)
					)
				}

				if (result) {
					const token = jsonWebToken.sign({ id: user._id }, config.tokenSecret, { expiresIn: '24h' })
					res.send(200, { auth: true, user: user.slug, token: token })
					next()
				}

				else {
					return next(
						new errors.InvalidCredentialsError('Invalid Credentials')
					)
				}

			})
		})
	})
}
