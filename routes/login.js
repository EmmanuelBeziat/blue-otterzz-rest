const errors = require('restify-errors')
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = (server) => {
	/**
	 * Login
	 */
	server.get('/login', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		User.findOne({ slug: req.params.username }, (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}
			bcrypt.compare(req.params.password, user.password, (err, result) =>{
				if (err) {
					return next(
						new errors.InvalidContentError('Bcrypt error: ' + err.message)
					)
				}

				if (result) {
					res.send(200)
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
