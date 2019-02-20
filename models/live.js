const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')

const liveSchema = new mongoose.Schema({
	isActive: Boolean,
	name: String,
	date: Date,
	registered: {
		user: String,
		date: { type: Date, default: Date.now }
	},
	status: {
		type: String,
		required: true,
		enum: ['upcoming', 'canceled', 'done'],
		default: 'upcoming'
	},
	place: String,
	links: [{ network: String, url: String }],
	songs: [String],
	comments: [{
		user: { type: String, index: true },
		date: { type: Date, default: Date.now },
		content: String
	}]
}, { minimize: false })

liveSchema.plugin(mongooseUrlSlugs('date'))
liveSchema.plugin(mongooseStringQuery)

const Live = mongoose.model('Live', liveSchema)

module.exports = Live
