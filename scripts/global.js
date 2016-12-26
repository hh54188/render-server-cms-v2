var PORT_REGEX = /^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/;
var LETTER_BEGIN_REGEX = /^[a-zA-Z_]/;
var IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

var REQUIRED_INFO = '不能为空';
var ERROR_INFO = '格式不正确';
var EMPTY_INFO = '';

var UI_STATE_BASE = {
    message: '',
    disabled: false,
    loading: false    
}