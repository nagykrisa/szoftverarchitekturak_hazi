var config = {
	local: {
		mode: 'local',
		port: 3000,
		mongo: {
			host: 'nagykrisa',
			port: ''
		}
	},
	staging: {
		mode: 'staging',
		port: 4000,
		mongo: {
			host: 'nagykrisa',
			port: ''
		}
	},
	production: {
		mode: 'production',
		port: 5000,
		mongo: {
			host: 'nagykrisa',
			port: ''
		}
	}
}
module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}