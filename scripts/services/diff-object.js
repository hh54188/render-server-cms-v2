var diffService = (function () {

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
                    newValue: newValue
                });
            }
        });

        // 返回结果要么有要么无
        // 返回空数组 [] 是很尴尬的
        return result.length ? result : null;
    }

    return {
        diff: diff
    }
})();

/*
    function plantTree(count) {
        count--
        if (count !== 1 ){
            return  {
                left: plantTree(count),
                right: plantTree(count)
            }           
        } else {
            return Math.random();
        }
    }

    var root1 = {
        node1: {
            node11: {
                key111: 'value1',
                key112: 'value2',
                key113: 'value3'
            },
            node12: {
                key121: 'value1',
                key122: 'value2',
                key123: 'value3'
            }
        },
        node2: {
            node21: {
                key211: 'value1',
                key212: 'value2',
                key213: 'value3'
            },
            node22: {
                key221: 'value1',
                key222: 'value2',
                key223: 'value3'
            }
        }
    };

    var root2 = {
        node1: {
            node11: {
                key111: 'value1',
                key112: 'value2',
                key113: 'value3'
            },
            node12: {
                key121: 'value1',
                key122: 'value2',
                key123: 'value4'
            }
        },
        node2: {
            node21: {
                key211: 'value1',
                key212: 'value2',
                key213: 'value3'
            },
            node22: {
                key221: 'value1',
                key222: 'value2',
                key223: 'value4'
            }
        }
    };

    var result = diff(root1, root2);
    console.log(result);

 */