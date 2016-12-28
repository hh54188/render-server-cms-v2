var remote = {
    _data: {
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

function deepCloneData(oldData) {
    return JSON.parse(JSON.stringify(oldData));
}

var appConfig = new Vue({
    el: '.panel-config',
    data: {
        // old 表示旧数据、修改之前的数据
        // 数据修改之后，需要通过对比旧数据找出修改的地方
        // 当用户保存之后，旧数据再次与当前修改之后的数据同步
        businessStateOld: remote.fetch(),
        businessState: remote.fetch(),
        // 只有修改之后才允许提交
        // 通过 diff 判断
        diff: null,
        // 页面上除了要展示的业务数据外，还友一类数据称之为界面状态
        // 比如提示输入是否合法，提示信息是什么，输入框可不可用
        // 如果页面组件化之后，这些逻辑应该交由交互逻辑和组件自己处理，
        // 但是在这个1.0版本中还是由同一个instance处理吧
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
            },
            isLoading: false,
            validatePass: true
        },
        // 当用户修改数据时需要对修改后的数据进行验证是否合法
        // 所以视图上除了展现业务逻辑数据以外还需要展现“提示信息”
        // validation对象结构的与业务数据config中一致
        // 这样一来每当找到一条验证规则便能找到一条对应的数据        
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
        businessState: {
            deep: true,
            handler: function () {
                // 数据被改变之后
                // 检测数据是否合法
                // 如果不合法的话“保存按钮”也是不可用的
                if (this.validate()) {
                    // 如果用户修改之后的数据是合法的
                    // 找出修改的地方
                    this.diff = diffService.diff(
                        this.businessStateOld, 
                        this.businessState
                    );
                }
            }
        }
    },
    methods: {
        validate: function (newData) {
            var UIState = this.UIState;
            var newData = this.businessState;
            var validateRules = this.validateRules;
            var validatePassLocal = true;

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
                        validatePassLocal = false;
                    }
                        
                    if (rule && !rule.test(value)) {
                        UIStateField.message = ERROR_INFO;
                        validatePassLocal = false;
                    }
                }
            }

            this.UIState.validatePass = validatePassLocal;
            return validatePassLocal;
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
            // 保存设置（同步数据）分两个步骤
            // 1. 首先更新本地的数据
            // 这里有另一个选择，可以使用flux模式，数据从服务端同步
            this.businessStateOld = JSON.parse(JSON.stringify(this.businessState));
            // 2. 然后更新线上数据
            CommandManagerService.command({
                name: 'update_config',
                payload: [this.diff]
            });
            this.diff = null;
        }
    }
});

// 用于更新 rs.isRunning ?
PubSub.subscrite('state.update.config', function (eventName, data) {

})