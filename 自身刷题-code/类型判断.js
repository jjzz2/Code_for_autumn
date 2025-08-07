function getType(value) {
    // 判断数据是 null 的情况
    if (value === null) {
        return 'null';  // 明确返回 'null'
    }

    // 判断数据是引用类型的情况
    if (typeof value === "object") {
        // 判断数组类型
        if (Array.isArray(value)) {
            return 'array';
        }

        // 判断日期类型
        if (Object.prototype.toString.call(value) === '[object Date]') {
            return 'date';
        }

        // 判断正则类型
        if (Object.prototype.toString.call(value) === '[object RegExp]') {
            return 'regexp';
        }

        // 判断对象类型
        return 'object';
    } else {
        // 判断数据是基本数据类型的情况和函数的情况
        if (typeof value === 'function') {
            return 'function';
        }

        return typeof value;
    }
}
