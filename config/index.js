var config = {
	local: {
		mode: 'local',
		port: 3000,
		mongo: {
			host: 'akozos',
			key: 'sozoka'
		}
	},
	staging: {
		mode: 'staging',
		port: 4000,
		mongo: {
			host: 'akozos',
			key: 'sozoka'
		}
	},
	production: {
		mode: 'production',
		port: 5000,
		mongo: {
			host:'akozos',
			key: 'sozoka'
		}
	}
}
module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}