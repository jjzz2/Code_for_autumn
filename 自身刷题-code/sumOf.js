function sum(...args1) {
    // 创建一个函数，接受后续的参数
    return function addMore(...args2) {
        // 如果没有传入新参数，返回最终的和
        if (args2.length === 0) {
            return args1.reduce((acc, cur) => acc + cur, 0);
        }
        // 否则继续累加新传入的参数
        args1.push(...args2);
        return addMore;
    }
}
//一个接受函数，一个接受数字。
//注意其的原则就是支持链式调用即可。