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
        // 深度Object克隆
        // return jQuery.extend(true, {}, this._data);
        return JSON.parse(JSON.stringify(this._data));
    }
}

function extendClass(baseClass) {
    // return $.extend({}, baseClass);
    return Object.assign({}, baseClass);
}

function inheritUIStateBase() {
    return extendClass(UI_STATE_BASE)
}

new Vue({
    el: '.panel-config',
    data: {
        BusinessState: remote.fetch(),
        // 当用户修改数据时需要对修改后的数据进行验证是否合法
        // 所以视图上除了展现业务逻辑数据以外还需要展现“提示信息”
        // validation对象结构的与业务数据config中一致
        // 这样一来每当找到一条验证规则便能找到一条对应的数据
        UIState:{
            rs: {
                port: inheritUIStateBase()
            },
            db: {
                name: inheritUIStateBase(),
                port: inheritUIStateBase(),
                host: inheritUIStateBase(),
                account: inheritUIStateBase(),
                password: inheritUIStateBase()
            }
        },
        validateRules: {
            rs: {
                port: {
                    rule: PORT_REGEX,
                    required: true
                }
            },
            db: {
                name: {
                    rule: LETTER_BEGIN_REGEX,
                    required: true
                },
                port: {
                    rule: PORT_REGEX,
                    required: true
                },
                host: {
                    rule: IP_REGEX,
                    required: true
                },
                account: {
                    rule: LETTER_BEGIN_REGEX,
                    required: true
                },
                password: {
                    required: true
                }
            }
        }
    },
    watch: {
        BusinessState: {
            deep: true,
            handler: function (newData) {
                this.validate(newData);
            }
        }
    },
    methods: {
        validate: function (newData) {
            var UIState = this.UIState;
            var newData = this.BusinessState;
            var validateRules = this.validateRules;

            // rs还是db类
            for (var categoryName in validateRules) {
                var category = validateRules[categoryName];
                // port还是host
                for (var fieldName in category) {
                    var field = category[fieldName];
                    // 规则的正则表达式
                    var rule = field.rule;
                    // 是否有指定数据类型
                    // 是否需要强制转化类型之后再做验证
                    var type = field.type;
                    // 是否可以为空
                    var required = field.required;
                    // 修改后的具体值是多少
                    var value = newData[categoryName][fieldName];
                    if (type) {
                        switch (type) {
                            case 'number': parseInt(value, 10); break;
                            case 'string': value.toString(); break;
                            default: value = value;
                        }
                    }
                    // 首先假设用户填写是正确的
                    UIStateField = UIState[categoryName][fieldName];
                    UIStateField.message = EMPTY_INFO;
                    // 如果不可为空又实际为空，报错
                    if (required && !value) {
                        UIStateField.message = REQUIRED_INFO;
                    }
                        
                    if (rule && !rule.test(value)) {
                        UIStateField.message = ERROR_INFO;
                    }
                }
            }
        },
        checkValidateIsPass: function () {
            var passed = true;
            var UIState = this.UIState;
            for (var categoryName in UIState) {
                var category = UIState[categoryName];
                for (var fieldName in category) {
                    var field = category[fieldName];
                    if (field.message !== EMPTY_INFO) {
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