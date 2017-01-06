

var appHealth = new Vue({
    el: '.panel-health',
    data: {
        text: 'Hello World',
        errors: {
            "developmentErrors": [],
            "productionErrors": []
        }
    },
    watch: {
        errors: {
            deep: true,
            handler: function () {

            }
        }
    },
    methods: {
        localize: function (errors) {
            return errors.map(function (item) {
                item.fileNames = item.filePaths.map(function (filePath) {
                    return this.shortCutPath(filePath);
                }.bind(this));
                return item;
            }.bind(this));
        },
        shortCutPath: function (path) {
            var pathSegments = path.split('\\');
            var length = pathSegments.length;
            return [pathSegments[length - 2], pathSegments[length - 1]].join('\\');
        }
    }
});

PubSub.subscribe('health', function (eventName, newState) {
    appHealth.errors = newState;
});
