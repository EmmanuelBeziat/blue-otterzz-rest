const yamlConfig = require('node-yaml-config')
const config = yamlConfig.load('./config.yaml')

module.exports = {
	name: config.app.name,
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || config.app.port,
	baseURL: process.env.BASE_URL || config.app.url,
	db: {
		host: process.env.MONGODB_HOST || config.db.host,
		port: process.env.MONGODB_URI || config.db.port,
		base: process.env.MONGODB_BASE || config.db.base,
		user: process.env.MONGODB_USER || config.db.user,
		pass: process.env.MONGODB_PASS || config.db.pass
	},
	tokenSecret: process.env.TOKEN_SECRET || config.auth.token
}
