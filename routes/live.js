const errors = require('restify-errors')
const Live = require('../models/live')

module.exports = (server) => {
	/**
	 * POST
	 */
	server.post('/lives', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		let data = req.body || {}
		let live = new Live(data)

		live.save((err, item) => {
			if (err) {
				return next(new errors.InternalError(err.message))
				next()
			}

			// item.score.total = item.getScore()

			res.send(201, item, { notify: `Live «${live.name}» successfully created` })
			next()
		})
	})

	/**
	 * LIST ALL
	 */
	server.get('/lives', (req, res, next) => {
		Live.find(req.params, (err, docs) => {
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
	server.get('/lives/:slug', (req, res, next) => {
		Live.findOne({ slug: req.params.slug }, (err, doc) => {
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
	server.put('/lives/:slug', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			)
		}

		let data = req.body || {}

		Live.findOneAndUpdate({ slug: req.params.slug }, { $set: data }, { new: true }, (err, doc) => {
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

			res.send(200, doc, { notify: `Live «${data.name}» successfully updated` })
			next()
		})
	})

	/**
	 * DELETE
	 */
	server.del('/lives/:slug', (req, res, next) => {
		Live.deleteOne({ slug: req.params.slug }, err => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			res.send(204, { notify: `Live successfully removed` })
			next()
		})
	})
}
