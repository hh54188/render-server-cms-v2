var Remote = (function () {
	return {
		fetch: function () {
			CommandManagerService.command({
				name: 'get_config'
			});

			CommandManagerService.command({
				name: 'get_health'
			});
		}
	}
})();