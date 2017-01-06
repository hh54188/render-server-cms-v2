var $notification = $('#notification');
var timeout;

PubSub.subscribe('SHOW_NOTIFICATION_COPY_SUCCESS', function (eventName, content) {
	window.clearTimeout(timeout);
	$notification.show();
	setTimeout(function () {
		$notification.hide();
	}, 500);
});