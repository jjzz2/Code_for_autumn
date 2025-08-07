function sum(...initialArgs) {
    // 所有累加的数字会存在这里
    let allArgs = [...initialArgs];

    // 返回的函数用于继续接收参数
    function adder(...newArgs) {
        allArgs.push(...newArgs);  // 累加到数组中
        return adder;              // 继续返回自身，用于链式调用
    }

    // 添加一个 sumOf 方法，求和结果
    adder.sumOf = function () {
        return allArgs.reduce((total, num) => total + num, 0);
    };

    return adder;
}
