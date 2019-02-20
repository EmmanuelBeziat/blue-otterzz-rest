const errors = require('restify-errors')
const Song = require('../models/song')

module.exports = (server) => {
	/**
	 * POST
	 */
	server.post('/songs', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError(`Expects 'application/json'`)
			)
		}

		let data = req.body || {}
		let song = new Song(data)

		song.save((err, item) => {
			if (err) {
				return next(new errors.InternalError(err.message))
				next()
			}

			res.send(201, item, { notify: `Song «${song.name}» successfully created` })
			next()
		})
	})

	/**
	 * LIST ALL
	 */
	server.get('/songs', (req, res, next) => {
		Song.find(req.params, (err, docs) => {
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
	server.get('/songs/:slug', (req, res, next) => {
		Song.findOne({ slug: req.params.slug }, (err, doc) => {
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
	server.put('/songs/:song_id', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			)
		}

		let data = req.body || {}
		if (!data._id) {
			data = Object.assign({}, data, { _id: req.params.spot_id })
		}

		Song.findOneAndUpdate({ _id: req.params.song_id }, data, {}, (err, doc) => {
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

			res.send(200, doc, { notify: `Song «${data.name}» successfully updated` })
			next()
		})
	})

	/**
	 * DELETE
	 */
	server.del('/songs/:song_id', (req, res, next) => {
		Song.deleteOne({ _id: req.params.song_id }, err => {
			if (err) {
				return next(
					new errors.InvalidContentError(err.message)
				)
			}

			res.send(204, { notify: `Song successfully removed` })
			next()
		})
	})
}
