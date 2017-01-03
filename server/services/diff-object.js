function isObject(o) {
    if (Object.prototype.toString.call(o) === '[object Object]') {
        return true;
    }
    return false;   
}

function isLeafNode(node) {
    if (!isObject(node)) {
        return true;
    }
    return false;
}

function abstractLeaf(pathArr, node, collection) {
    if (!isLeafNode(node)) {
        for (var key in node) {
            var tempArr = pathArr.slice();
            tempArr.push(key);
            abstractLeaf(tempArr, node[key], collection);
        }
    } else {
        collection.push({
            path: pathArr.join('.'),
            value: node
        });
    }
}

function diff(oldObject, newObject) {
    var result = [];
    var oldIndex = []
    abstractLeaf([], oldObject, oldIndex);
    oldIndex.forEach(function (oldItem) {
        var path = oldItem.path;
        var oldValue = oldItem.value;

        var newValue = newObject;
        path.split('.').forEach(function (segment) {
            newValue = newValue[segment];
        });

        if (oldValue != newValue) {
            result.push({
                path: path,
                oldValue: oldValue,
                newValue: newValue
            });
        }
    });

    // 返回结果要么有要么无
    // 返回空数组 [] 是很尴尬的
    return result.length ? result : null;
}

module.exports = {
    diff: diff
}
