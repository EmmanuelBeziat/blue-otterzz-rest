const errors = require('restify-errors')
const bcrypt = require('bcrypt')

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

		console.log(req)

		const data = req.body || {}

		bcrypt.compare(data.password, hash, function(err, res) {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			console.log(res)
		})

	})
}
