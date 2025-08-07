Promise.retry = function (fn, retries) {
    return new Promise((resolve, reject) => {
        Promise.resolve(fn())
            .then(resolve)
            .catch(error => {
                if (retries > 0) {
                    console.log(`Retrying... ${retries} attempts left`);
                    //进行一个递归调用
                    Promise.retry(fn, retries - 1)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(error);
                }
            });
    })
}
//与all的区别；all有for循环，所以其是并行执行，而queue是串行执行；
Promise.queue = function (promiseArr) {
    return new Promise((resolve, reject) => {
        const resultArr = [];
        function runPromise(index) {
            if (index >= promiseArr.length) {
                resolve(resultArr)
                return
            }
            promiseArr[index]().then(res => {
                resultArr[index] = res
                runPromise(index + 1)
            }).catch(reject)
        }
        runPromise(0)
    })
}