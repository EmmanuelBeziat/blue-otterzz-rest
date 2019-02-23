const errors = require('restify-errors')
const User = require('../models/user')

module.exports = (server) => {
	/**
	 * POST
	 */
	server.post('/users', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		let data = req.body || {}
		let user = new User(data)

		user.save((err, item) => {
			if (err) {
				return next(new errors.InternalError(err.message))
				next()
			}

			res.send(201, item, { notify: `User «${user.name}» successfully created` })
			next()
		})
	})

	/**
	 * LIST ALL
	 */
	server.get('/users', (req, res, next) => {
		User.find(req.params, (err, docs) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}
			res.send(docs)
			next()
		})
	})

	/**
	 * FIND
	 */
	server.get('/users/:slug', (req, res, next) => {
		User.findOne({ slug: req.params.slug }, (err, doc) => {
			if (!req.is('application/json')) {
				return next(
					new errors.InvalidContentError("Expects 'application/json'")
				)
			}

			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			res.send(doc)
			next()
		})
	})

	/**
	 * PUT
	 */
	server.put('/users/:user_id', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			)
		}

		let data = req.body || {}

		console.log(data)

		User.findOneAndUpdate({ _id: req.params.user_id }, { $set: data }, { new: true }, (err, doc) => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}
			else if (!doc) {
				return next(
					new errors.ResourceNotFoundError('The resource you requested could not be found')
				)
			}

			res.send(200, doc, { notify: `User «${data.name}» successfully updated` })
			next()
		})
	})

	/**
	 * DELETE
	 */
	server.del('/users/:user_id', (req, res, next) => {
		User.deleteOne({ _id: req.params.user_id }, err => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			res.send(204, { notify: `User successfully removed` })
			next()
		})
	})
}
