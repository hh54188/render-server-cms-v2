var CommandManagerService = (function () {
	// command模板对socketio是有依赖的，
	// 但问题是socketio的加载是异步的，
	// 当前Command模块的加载不能是依赖socketio的异步加载
	// 于是采用事件的方式间接调用socketio
	function command(CommandInfo) {
		PubSub.publish('command', CommandInfo);
	}

	return {
		command: command
	}

})();