var PORT_REGEX = /^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/;
var LETTER_BEGIN_REGEX = /^[a-zA-Z_]/;
var IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
var REQUIRED_INFO = '不能为空';
var ERROR_INFO = '格式不正确';
var EMPTY_INFO = '';

Vue.directive('disable', function (el, binding, vnode) {
    if (!binding.value) {
        el.removeAttribute('disabled');
    } else {
        el.setAttribute('disabled', true);
    }
});

var remote = {
    _data: {
            rs: {
                isRunning: false,
                directoryName: 'render-server',
                absoluteDirectoryPath: './',
                relativeDirectoryPath: './',
                isProduction: false,
                port: 8124   
            },
            db: {
                name: 'nova_ts',
                port: 8877,
                host: '10.1.1.1',
                account: 'root',
                password: '123456'
            }
    },
    fetch: function () {
        return this._data;
    },
    diff: function (newData) {

    }
}

new Vue({
    el: '.panel-config',
    data: {
        config: remote.fetch(),
        // 当用户修改数据时需要对修改后的数据进行验证是否合法
        // 所以视图上除了展现业务逻辑数据以外还需要展现“提示信息”
        // validation对象结构的与业务数据config中一致
        // 这样一来每当找到一条验证规则便能找到一条对应的数据
        validation: {
            rs: {
                port: {
                    rule: PORT_REGEX,
                    result: '',
                    required: true
                }
            },
            db: {
                name: {
                    rule: LETTER_BEGIN_REGEX,
                    result: '',
                    required: true
                },
                port: {
                    rule: PORT_REGEX,
                    result: '',
                    required: true
                },
                host: {
                    rule: IP_REGEX,
                    result: '',
                    required: true
                },
                account: {
                    rule: LETTER_BEGIN_REGEX,
                    result: '',
                    required: true
                },
                password: {
                    result: '',
                    required: true
                }
            }
        }
    },
    watch: {
        config: {
            deep: true,
            handler: function (newConfig) {
                var validation = this.validation;
                var config = this.config;
                // rs还是db类
                for (var categoryName in validation) {
                    var category = validation[categoryName];
                    // port还是host
                    for (var fieldName in category) {
                        var field = category[fieldName];
                        // 规则的正则表达式
                        var rule = field.rule;
                        // 是否有指定数据类型
                        // 是否需要强制转化类型之后再做验证
                        // 这块逻辑目前缺省中
                        var type = field.type;
                        // 是否可以为空
                        var required = field.required;
                        // 修改后的具体值是多少
                        var value = config[categoryName][fieldName];
                        // 首先假设用户填写是正确的
                        field.result = EMPTY_INFO;
                        // 如果不可为空又实际为空，报错
                        if (required && !value) {
                            field.result = REQUIRED_INFO;
                        }
                            
                        if (rule && !rule.test(value)) {
                            field.result = ERROR_INFO;
                        }
                    }
                }
            }
        }
    },
    methods: {
        checkValidateIsPass: function () {
            var validation = this.validation;
            var passed = true;
            for (var categoryName in validation) {
                var category = validation[categoryName];
                for (var fieldName in category) {
                    var field = category[fieldName];
                    if (field.result !== EMPTY_INFO) {
                        passed = false;
                    }
                }
            }
            return passed;
        },
        saveChanges: function () {

        }
    }
});