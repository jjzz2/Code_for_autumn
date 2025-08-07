function Scheduler(limit){
    let queue=[]
    function add(task){
        queue.push(task)
        return new Promise((resolve,reject)=>{
        let cnt=0
        let runningTasks=0
        let res=[]
        function run() {
            if (cnt === queue.length && runningTasks === 0) {
                resolve(res)
                return
            }
            while (cnt < queue.length&&runningTasks<limit) {
                runningTasks++
                let index=cnt++
                queue[index].then((value)=>{
                    res[index]=value
                    runningTasks--
                    run()
                }).catch(err=>reject(err))
            }
        }
        run()
    })
    }
    return add()
}
function serialFetch() {
    let res = 0;
    let index = 0;

    return new Promise((resolve, reject) => {
        async function fetchData(i) {
            return new Promise((res) => {
                setTimeout(() => res(i), Math.random() * 100);
            });
        }
        //注意其的执行顺序
        function run() {
            if (index === 10) {
                resolve(res); // 任务完成，resolve 外部 Promise
                return;
            }

            fetchData(index++)
                .then(value => {
                    res += value;
                    run(); // 串行地调下一个任务
                })
                .catch(reject); // 如果某一个失败，直接 reject
        }

        run(); // 启动任务链
    });
}
function myRetry(fn,times,timeout){
    return new Promise((resolve,reject)=>{
        let time=Date.now()
        fn().then(value =>resolve(value)).catch(onerror=>{
            if (times<0){
                reject(onerror)
            }
            myRetry(fn,times-1,timeout).then(resolve).catch(reject)
        })
        let nowTime=Date.now()
        if (nowTime-time>timeout){
            myRetry(fn,times-1,timeout).then(resolve).catch(reject)
        }
    })
}
//大数相加
function BigInt(num1,num2){
    let x1=num1.toString().split('')
    let x2=num2.toString().split('')
    let carry=0
    let res=""
    let i=x1.length-1
    let j=x2.length-1
    while(i>=0||j>=0||carry>0){
        let v1=x1[i]?parseInt(x1[i]):0
        let v2=x2[j]?parseInt(x2[j]):0
        let sum=v1+v2+carry
        carry=Math.floor(sum/10)
        res=Math.floor(sum%10)+res
        i--
        j--
    }
    return res
}
function LastPromise(iterable) {
    let res = null;
    let cntError = 0;
    let cntSum = 0;

    return new Promise((resolve) => {
        if (iterable.length === 0) {
            resolve("all promise is reject");
            return;
        }

        for (let i = 0; i < iterable.length; i++) {
            Promise.resolve(iterable[i])
                .then(value => {
                    res = value;
                    cntSum++;
                    if (cntSum === iterable.length) {
                        if (cntError < iterable.length) {
                            resolve(res);
                        } else {
                            resolve("all promise is reject");
                        }
                    }
                })
                .catch(() => {
                    cntError++;
                    cntSum++;
                    if (cntSum === iterable.length) {
                        if (cntError === iterable.length) {
                            resolve("all promise is reject");
                        } else {
                            resolve(res);
                        }
                    }
                });
        }
    });
}
