const config = require('../config')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const errors = require('restify-errors')
const jsonWebToken = require('jsonwebtoken')

module.exports = (server) => {
	/**
	 * Login
	 */
	server.post('/authenticate', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		User.findOne({ slug: req.body.username }, '+password' , (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			bcrypt.compare(req.body.password, user.password, (err, result) =>{
				if (err) {
					return next(
						new errors.InvalidContentError('Bcrypt error: ' + err.message)
					)
				}

				if (result) {
					const token = jsonWebToken.sign({ token: 'test' }, config.tokenSecret, { expiresIn: '24h' })
					res.send(200, token)
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
