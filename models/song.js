const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')

const songSchema = new mongoose.Schema({
	isActive: { type: Boolean, default: true },
	infos: {
		title: { type: String, required: true },
		artist: { type: String, required: true }
	},
	meta: {
		tuning: String,
		style: String,
		url: { type: String, required: true }
	},
	submited: {
		user: { type: String, required: true },
		date: { type: Date, default: Date.now }
	},
	score: [{
		user: String,
		value: Number
	}],
	files: {
		sheets: [{
			file: String,
			date: { type: Date, default: Date.now },
			user: String
		}],
		backtracks: [{
			file: String,
			date: { type: Date, default: Date.now },
			user: String
		}],
		lyrics: [{
			file: String,
			date: { type: Date, default: Date.now },
			user: String
		}]
	},
	comments: [{
		user: String,
		date: { type: Date, default: Date.now },
		content: String
	}]
}, { minimize: false })

songSchema.plugin(mongooseUrlSlugs('infos.artist infos.title', { update: true }))
songSchema.plugin(mongooseStringQuery)

songSchema.virtual('getScore').get(() => this.scores.reduce((a, b) => a.value + b.value, 0) / this.scores.length)

const Song = mongoose.model('Song', songSchema)

module.exports = Song
