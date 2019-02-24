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
		console.log('auth')
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		console.log(req.body)

		User.findOne({ slug: req.body.username }, '+password' , (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			console.log('before bcrypt')

			bcrypt.compare(req.body.password, user.password, (err, result) =>{
				if (err) {
					return next(
						new errors.InvalidContentError('Bcrypt error: ' + err.message)
					)
				}

				if (result) {
					console.log('coucou')
					const token = jsonWebToken.sign({ token: 'test' }, config.tokenSecret, { expiresIn: '24h' })
					console.log(token)
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
