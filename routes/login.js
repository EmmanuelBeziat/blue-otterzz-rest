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

		console.log(req.params)

		User.find({ slug: req.params.username }, (err, user) => {
			if (err) {
				return next(
					new errors.InvalidContentError('Mongo Error: ' + err.message)
				)
			}

			console.log(req.params.password, user.password)

			bcrypt.compare(req.params.password, user.password, (err, res) =>{
				if (err) {
					return next(
						new errors.InvalidContentError('Bcrypt error: ' + err.message)
					)
				}

				console.log(res)

				res.send(200)
				next()
			})
		})

	})
}
