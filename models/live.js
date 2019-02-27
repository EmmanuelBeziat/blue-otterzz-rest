const mongoose = require('mongoose')
const mongooseStringQuery = require('mongoose-string-query')
const mongooseUrlSlugs = require('mongoose-url-slugs')
const dateFns = require('date-fns')

const liveSchema = new mongoose.Schema({
	isActive: { type: Boolean, default: true },
	name: { type: String, required: true },
	date: Date,
	registered: {
		user: { type: String, required: true },
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

const date = dateFns.format(new Date(liveSchema.date), 'yyyy-MM-dd')
console.log(date)
liveSchema.plugin(mongooseUrlSlugs(date), { update: true })
liveSchema.plugin(mongooseStringQuery)

const Live = mongoose.model('Live', liveSchema)

module.exports = Live
