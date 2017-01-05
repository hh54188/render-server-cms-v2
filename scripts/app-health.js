var appHealth = new Vue({
    el: '.panel-health',
    data: {
        text: 'Hello World',
        errors: {
            "developmentErrors": [
                {
                    "errorCode": 5,
                    "details": {
                        "diffNames": [
                            [
                                "TEXT_BASE"
                            ],
                            []
                        ]
                    },
                    "filePaths": [
                        "D:\\Work\\render-server\\interface\\rs.proto",
                        "D:\\Work\\render-server\\src\\rs\\common\\model\\styleType.js"
                    ]
                },
                {
                    "errorCode": 1,
                    "details": {
                        "diffNames": [
                            [
                                "TEXT_BASE"
                            ],
                            []
                        ]
                    },
                    "filePaths": [
                        "D:\\Work\\render-server\\src\\rs\\common\\model\\styleType.js"
                    ]
                },                
                {
                    "errorCode": 5,
                    "details": {
                        "diffNames": [
                            [
                                "TEXT_BASE"
                            ],
                            []
                        ]
                    },
                    "filePaths": [
                        "D:\\Work\\render-server\\src\\rs\\api\\protocol\\rs.proto",
                        "D:\\Work\\render-server\\src\\rs\\common\\model\\styleType.js"
                    ]
                }
            ],
            "productionErrors": [
                {
                    "errorCode": 5,
                    "details": {
                        "diffNames": [
                            [
                                "TEXT_BASE"
                            ],
                            []
                        ]
                    },
                    "filePaths": [
                        "D:\\Work\\render-server\\production\\interface\\rs.proto",
                        "D:\\Work\\render-server\\production\\src\\rs\\common\\model\\styleType.js"
                    ]
                },
                {
                    "errorCode": 5,
                    "details": {
                        "diffNames": [
                            [
                                "TEXT_BASE"
                            ],
                            []
                        ]
                    },
                    "filePaths": [
                        "D:\\Work\\render-server\\production\\src\\rs\\api\\protocol\\rs.proto",
                        "D:\\Work\\render-server\\production\\src\\rs\\common\\model\\styleType.js"
                    ]
                }
            ]
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
