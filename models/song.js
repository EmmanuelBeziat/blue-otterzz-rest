const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')

const songSchema = new mongoose.Schema({
	isActive: Boolean,
	infos: {
		title: String,
		artist: String
	},
	meta: [{
		tuning: String,
		style: String,
		url: String
	}],
	submited: {
		user: String,
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

songSchema.plugin(mongooseUrlSlugs('artist title'))
songSchema.plugin(mongooseStringQuery)

songSchema.virtual('name').get(() => `${this.infos.artist} — ${this.infos.title}`)
songSchema.virtual('getScore').get(() => this.scores.reduce((a, b) => a.value + b.value, 0) / this.scores.length)

const Song = mongoose.model('Song', SongSchema)

module.exports = Song
