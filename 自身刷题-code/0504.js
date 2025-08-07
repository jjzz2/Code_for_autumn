function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) return reject(new TypeError('Chaining cycle detected'));

    if ((x !== null) && (typeof x === 'object' || typeof x === 'function')) {
        let called = false;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x,
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class myPromise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = value => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = reason => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };

        const promise2 = new myPromise((resolve, reject) => {
            const handle = (cb, val) => {
                setTimeout(() => {
                    try {
                        const x = cb(val);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            };

            if (this.status === 'fulfilled') {
                handle(onFulfilled, this.value);
            } else if (this.status === 'rejected') {
                handle(onRejected, this.reason);
            } else {
                this.onResolvedCallbacks.push(() => handle(onFulfilled, this.value));
                this.onRejectedCallbacks.push(() => handle(onRejected, this.reason));
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}
//const
// 模拟异步请求函数
function request(url) {
    return new Promise(resolve => {
        const delay = Math.random() * 2000 + 1000; // 随机延迟1-3秒
        setTimeout(() => {
            console.log(`完成请求：${url}，耗时 ${delay.toFixed(0)}ms`);
            resolve(url);
        }, delay);
    });
}

// 请求列表（需要控制并发）
const urls = [
    'https://api.com/1',
    'https://api.com/2',
    'https://api.com/3',
    'https://api.com/4',
    'https://api.com/5',
    'https://api.com/6',
    'https://api.com/7'
];
function limitRequest(urls, maxConcurrent, requestFn) {
    // 返回一个最终完成所有请求的 Promise
    return new Promise((resolve,reject)=>{
        let cnt=0
        let runningPromises=0
        let res=[]
        function run(){
            if (cnt===urls.length&&runningPromises===0){
                resolve(res)
                return
            }
                 while(runningPromises<maxConcurrent&&cnt<urls.length){
                    //必须这样使用index来及进行
                    let index=cnt
                    cnt++
                    runningPromises++
                    requestFn(urls[index]).then(value => {
                        res[index]=value
                        runningPromises--
                        run()
                    }).catch(onerror=>{
                        reject(onerror)
                    })
                }
        }
        run()
    })
}
limitRequest(urls,3,request).then(()=>{
    console.log('done')
})
//没有问题了,注意使用while+递归来完成


//Promise.all
function myPromiseAll(promises){
    return new Promise((resolve,reject)=>{
        let cnt=0
        let res=[]
        for (let item of promises){
            Promise.resolve(item).then(value => {
                res.push(item)
                cnt++
                if (cnt===promises.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
class Event{
    constructor(){
        this.events={}
    }
    on(callback,event){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    off(callback,event){
        if (this.events[event]){
            this.events[event]=this.events[event].filter((fn)=>fn!==callback)
        }
    }
    emit(event,...args){
        this.events[event].forEach((callback)=>callback(...args))
    }
    once(event,callback){
        //注意,once是要移除,所以已经算要移除了,所以如此去写
        const wrapper=(...args)=>{
            callback(...args)//执行
            this.off(callback)//移除
        }
        this.on(event,wrapper)
    }
}
//列表转树,列表转id
function arrToTree(array){
    let map={}
    let res=[]
    for (let item of array){
        map[item.id]=item
    }
    for (let i=0;i<array.length;i++){
        let pid=array[i].pid
        if (map.hasOwnProperty(pid)){
            map[pid].children=[]||map[pid].children
            map[pid].children.push(array[i])
        }else{
            res.push(array[i])
        }
    }
    return res
}
//找id,使用递归的方式去找
function search(json,id){
    for (let item of json){
        if (item.id===id){
            return item
        }
        search(item,id)
    }
    return null
}
//树形转数组
function TreeToArr(tree){
    let res=[]
    for (let key in tree){
        if (tree[key].children){
            TreeToArr(tree[key].children)
        }else{
            res.push(tree[key])
        }
    }
    return res
}
const data = [
    { val: 1, children: [
            { val: 2, children: [
                    { val: 3 },
                    { val: 4 }
                ]},
            { val: 5 }
        ]},
    { val: 6 },
    { val: 7 }
]
//数组乱序
function shuffle(arr){
    for (let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
            [arr[i] , arr[j]]=[arr[j],arr[i]]
    }
    return arr

}
let nums = [1, 2, 3, 4, 5];
console.log(shuffle(nums)); // 每次输出都不同，例如 [3,1,5,2,4]

//setTimeOut实现setInterval
function setInterVal(fn,time){
    let interval=function (){
        setTimeout(interval,time)
        fn()
    }
    setTimeout(interval,time)
}