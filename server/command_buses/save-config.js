var state = {
    rs: {
        isRunning: false,
        directoryName: 'render-server',
        absoluteDirectoryPath: './',
        relativeDirectoryPath: './',
        isProduction: false,
        port: '8124'   
    },
    db: {
        name: 'nova_ts',
        port: '8877',
        host: '10.1.1.1',
        account: 'root',
        password: '123456'
    }
}

function applyDiff(state, diff) {
	diff.forEach(function (item) {
		var path = item.path;
		var newValue = item.newValue;

		var oldValue = state;
		path = path.split('.');
		for (var i = 0; i < path.length - 1; i++ ) {
			oldValue = oldValue[path[i]];
		}
		oldValue[path[path.length - 1]] = newValue;
	});
}

module.exports = {
	handle: function (diff) {
		applyDiff(state, diff);
	}
}