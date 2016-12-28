
//------Check Port Is In Use------

// var checkRenderIsRunning = require('./server/services/check-render-is-running.js');
// var checkPortInUse = require('./server/services/check-port-in-use.js');

// checkPortInUse.portInUse(8124, function (returnValue) {
// 	console.log(returnValue);
// })

// checkRenderIsRunning.setRenderPort(8124);
// setInterval(function () {
// 	var value = checkRenderIsRunning.getRenderState();
// 	console.log(value);
// }, 1000);


//------ConfigState------

// var ConfigState = require('./server/states/config.js');
// var state = ConfigState.getState();
// console.log(state);

// var diffs = [{
// 	oldValue: '8124',
// 	newValue: '6666'
// }];

// ConfigState.updateConfigFile(diffs);