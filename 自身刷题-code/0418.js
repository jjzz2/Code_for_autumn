//1.手写instanceof
function myInstanceOf(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){
        if (proto===prototype)return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}
//手写jsonp
function jsonp(src){
    let script=document.createElement('script')
    script.src=src
    script.type='text/javascript'
    document.body.appendChild(script)
}
//实现发布-订阅模式
class Event{
    constructor(){
        this.events ={}
    }
    on(event,callback){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    off(event,callback){
        if (this.events[event]){
            this.events[event]=this.events[event].filter(item=>item!==callback)
        }
    }
    emit(event,...args){
        if (this.events[event]){
            this.events[event].forEach(callback =>callback(args) )
        }

    }
    once(event,...args){
        if (this.events[event]){
            this.events[event].forEach(callback =>callback(args) )
        }
        this.off(event,callback)
    }
}
//手写数组方法
//1.Array.filter
Array.prototype.myFilter=function (callback){
    let res=[]
    for (let i=0;i<this.length;i++){
        if (callback(this[i])){
            res.push(this[i])
        }
    }
    return res
}
Array.prototype.myReduce=function (fn,initval){
    let result=initval
    let index=0
    if (typeof initval==="undefined"){
        result=this[index]
        index++
    }
    while(index<this.length){
        result=fn(result,this[index++])
    }

    return result
}
//实现sleep函数,很显然是一个异步的函数，直接解决即可
// async function test() {
//     console.log('开始')
//     await sleep(4000)
//     console.log('结束')
// }
function mySleep(delay){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve()
        },delay)
    })
}
//setTimeout实现setInterval
function mySetInterval(fn,delay){
    function repeat(){
        setTimeout(()=>{
            //这里fn不需要修改指向即可。
            fn()
        },delay)
    }
    //注意：repeat也要延迟执行
    setTimeout(repeat,delay)
}
//异步打印1，2，3
//Promise.retry
function PromiseRetry(promise,retried){
    return new Promise((resolve,reject)=>{
        Promise.resolve(promise).then(value => {
            resolve(value)
        }).catch(err=>{
            if (retried>0){
                PromiseRetry(promise,retried-1).then(resolve).catch(reject)
            }else{
                reject(err)
            }
        })
    })
}

function fetchData() {
    return new Promise((resolve, reject) => {
        // 模拟随机失败和成功
        let success = Math.random() > 0.5;
        if (success) {
            resolve("Data fetched successfully");
        } else {
            reject("Fetch failed");
        }
    });
}

// 使用 PromiseRetry 来执行 fetchData，并设置重试次数
let retries = 3;

PromiseRetry(fetchData, retries)
    .then(result => {
        console.log(result); // 如果成功，输出结果
    })
    .catch(error => {
        console.error(error); // 如果失败，输出错误
    });
//手写lazyman,这里promise和resolve都能优化顺序问题。
function myLazyMan(name){
    this.queue=[]
    this.name=name
    this.queue.push(

    )
}
// 重试函数 runWithRetry
// 重试函数：实现一个重试函数runWithRetry(handler: Function, times: number = 1, timeout?: number)，支持异步
function runWithRetry(handler,times,timeout){
    return new Promise((resolve,reject)=>{
        
    })
}