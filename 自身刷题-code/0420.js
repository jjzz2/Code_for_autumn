//instanceof
function MyInstanceof(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){

    }
}
//curried
function myCurry(fn){
    return function curried(...args){
        if (args.length>=fn.length){
            return fn.apply(this,args)
        }else return function (...args2){
            args=args.concat(args2)
            return curried.apply(this,args)
        }
    }
}
//手写sumof
function mySumof(...args){
    return function addMore(...args2){
        if (args2.length===0) {
            return args.reduce((accu, cur) => accu + cur, 0)
        }else{
            args=args.concat(args2)
            return addMore
        }
    }
}
//限制并发,使用递归或者循环都是可以的，看自己的选择。
function limits(fetchList, callbacks,n){
    return new Promise((resolve,reject)=>{
        let curRunningTasks=0
        let cnt=0
        let res=[]
        function run(){
            if (cnt===fetchList.length&&curRunningTasks===0){
                resolve(callbacks(res))
            }
                cnt++
                curRunningTasks++
            if (curRunningTasks<=n) {
                Promise.resolve(fetchList[cnt]).then(value => {
                    res[cnt] = value
                    curRunningTasks--
                    run()
                }).catch(reject)
            }
        }
        run()
    })
}
//Promise.allSettled
function myPromiseAllSettled(promises) {
    return new Promise((resolve) => {
        let res = [];  // 用来存储结果
        let cnt = 0;  // 计数器，记录处理完成的任务数

        // 遍历所有 promises
        promises.forEach((promise, index) => {
            // 确保每个 promise 被处理，不管是成功还是失败
            Promise.resolve(promise).then(
                value => {
                    res[index] = { status: 'fulfilled', value };  // 如果成功
                },
                reason => {
                    res[index] = { status: 'rejected', reason };  // 如果失败
                }
            ).finally(() => {
                cnt++;  // 每完成一个任务，计数器加1
                if (cnt === promises.length) {
                    resolve(res);  // 当所有任务完成后，返回结果
                }
            });
        });
    });
}
//获得数组最大深度
function getMaxDepth(array){
    let ans=0
    function dfs(array,cnt){
        ans=Math.max(ans,cnt)
        for (let i=0;i<array.length;i++){
            if (Array.isArray(array[i])){
                dfs(array[i],cnt+1)
            }
        }
    }
    dfs(array,1)
    return ans
}
//异步循环打印1，2，3
//异步循环打印1，2，3
function print1(time,i){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log(i)
            resolve(i)
        },time)
    })
}

function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
//循环打印红，黄，绿,一样的，也是使用异步来完成
function print(timer,light){
    //这样的话无法获取其的状态，是不好的。
     new Promise((resolve, reject) => {
        setTimeout(() => {
            if (light === 'red') {
                red()
            }
            else if (light === 'green') {
                green()
            }
            else if (light === 'yellow') {
                yellow()
            }
            resolve()
        }, timer)
    })
}
const taskRunner =  async (count,maxCount) => {
    if (count===maxCount){
        return
    }
    //或者：异步渲染1，2，3，
    await print(3000, 'red')
    await print(2000, 'green')
    await print(2100, 'yellow')
    taskRunner(count+1)
}
taskRunner()
