const errors = require('restify-errors')
const bcrypt = required('bcrypt')

module.exports = (server) => {
	server.use(restify.plugins.queryParser({
		mapParams: true,
		parameterLimit: 2
	}))
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
	})
}

bcrypt.compare(data.password, hash, function(err, res) {
	if (err) {
		return next(
			new errors.InvalidContentError(err.message)
		)
	}

	console.log(res)
})
