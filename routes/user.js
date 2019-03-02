const errors = require('restify-errors')
const User = require('../models/user')
// const bcrypt = require('bcrypt')

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
	server.put('/users/:slug', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			)
		}

		let data = req.body || {}

		User.findOneAndUpdate({ slug: req.params.slug }, { $set: data }, { new: true }, (err, doc) => {
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
	 * Password Recovery
	 */
	/* server.put('/recovery/:slugs', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			)
		}

		let data = req.body || {}
	}) */

	/**
	 * DELETE
	 */
	server.del('/users/:slug', (req, res, next) => {
		User.deleteOne({ slug: req.params.slug }, err => {
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
