function maxDepth(array) {
    let maxs = 0;
    function traverse(arr, cnt) {
        for (let i = 0; i < arr.length; i++) {
            // 如果是数组，则递归
            if (Array.isArray(arr[i])) {
                traverse(arr[i], cnt + 1); // 递归调用并增加深度
            }
        }
        //使用递归来进行调用即可。
        maxs = Math.max(cnt, maxs);
    }
    // 初始深度为 1
    traverse(array, 1);
    return maxs; // 返回最终的最大深度
}
console.log(maxDepth([1, [2, [3, [4]]]]));  // 输出 4
