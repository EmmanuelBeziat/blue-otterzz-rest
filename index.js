/**
 * Module Dependencies
 */
const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')
const serveStatic = require('serve-static-restify')
const corsMiddleware = require('restify-cors-middleware')
const rjwt = require('restify-jwt-community')

/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.name,
	version: config.version,
})

const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: ['*'],
	allowHeaders: ['API-Token'],
	exposeHeaders: ['API-Token-Expiry']
})

/**
  * Middleware
  */
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())
server.pre(cors.preflight)
server.pre(serveStatic(__dirname + '/public'))
server.use(cors.actual)
// server.use(rjwt({ secret: config.tokenSecret }).unless({ path: ['/login'] }))

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise
	mongoose.connect(`mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.base}`, { useNewUrlParser: true })

	const db = mongoose.connection

	db.on('error', (err) => {
		console.error(err)
		process.exit(1)
	})

	db.once('open', () => {
		require('./routes/song')(server)
		require('./routes/live')(server)
		require('./routes/user')(server)
		require('./routes/login')(server)
		console.log(`Server is listening on port ${config.port}`)
	})
})
