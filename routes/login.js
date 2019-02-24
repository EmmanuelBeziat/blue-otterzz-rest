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

		User.find({ slug: req.params.slug }, (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			bcrypt.compare(req.params.password, user.password, (err, res) =>{
				if (err) {
					return next(
						new errors.InvalidContentError(err.message)
					)
				}

				console.log(res)

				res.send(200)
				next()
			})
		})

	})
}
