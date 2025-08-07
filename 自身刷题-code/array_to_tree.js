//一个filter和map方法完成对其的遍历。
function arrayToTreeV3(list, root) {
    return list
        .filter(item => item.parentId === root)
        .map(item => ({...item, children: arrayToTreeV3(list, item.id)}))
    }
