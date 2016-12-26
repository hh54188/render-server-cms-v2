Vue.directive('disable', function (el, binding, vnode) {
    if (!binding.value) {
        el.removeAttribute('disabled');
    } else {
        el.setAttribute('disabled', true);
    }
});