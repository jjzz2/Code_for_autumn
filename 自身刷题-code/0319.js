//1.数组转树
function arrToTree(arr){
    let map={}
    let res=[]
    for (let item of arr){
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        let pid=arr[i].pid
        if (map[pid]){
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }else{
            res.push(arr[i])
        }
    }
    return res
}
//2.事件总线
class Events{
    constructor(){
        this.sub={}
    }
    on(event,callback){
        if (!this.sub[event]){
            this.sub[event]=[]
        }
        this.sub[event].push(callback)
    }
    off(event,callback){
        if (!this.sub[event]) {
            return
        }
        this.sub[event].filter(item=>item!==callback)
    }
    emit(event,args){
        if (!this.sub[event]){
            return
        }
        for (let i=0;i<this.sub[event].length;i++){
            this.sub[event][i](...args)
        }
    }

}
//3.限制最大并发
function limits(promises,n){
        return new Promise(resolve => {
            let count=0
            let runningTasks=0
            let res=[]
            function run(){
                if (count===promises.length&&runningTasks===0){
                    resolve(res)
                    return
                }
                while(count<promises.length&&runningTasks<n){
                    count++
                    runningTasks++
                    promises[count].then(value =>{
                        res[count]=value
                        runningTasks--
                        run()
                    })
                }
            }
            run()
        })
}
//promise.all
function myPromiseAll(promises){
    if (!Array.isArray(promises)){
        throw new Error()
    }
    return new Promise(((resolve,reject) => {
        let count=0
        let len=promises.length
        let res=[]
        for(let i=0;i<len;i++){
            //将其封装为Promise的形态否则传入非promise形态时会报错
            Promise.resolve(promises[i]).then(value =>{
                res[i]=value;
                count++
                if (count===len){
                    resolve(res)
                }
            }).catch(reject)
        }
    }))
}
//promise.race
function myPromiseRace(promises){
    if (!Array.isArray(promises)){
        throw new Error()
    }
    return new Promise((resolve,reject) => {
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value => {
                resolve(value)
            }).catch(reject)
        }
    })
}
//curried
function curry(fn){
    if (typeof fn!=='function'){
        throw new Error
    }
    return function curried(args){
        if (fn.length<=args.length){
            return fn.apply(this,args)
        }else return function (...args2){
            curried.apply(this,args.concat(args2))
        }
    }
}
//ajax函数
function myAjax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest()
        xhr.open('GET',url, true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    //注意这里是responseText
                    resolve(JSON.stringify(xhr.responseText))
                }else{
                    reject('err')
                }
            }
        }
        xhr.send(null)
    })
}
//shallowClone
//注意其肯定是遍历钥匙
function shallowClone(obj){
    let newObj=Array.isArray(obj)?[]:{}
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//deepClone
function deepClone(obj){
    if (typeof obj!=='object'||obj===null){
        return obj
    }
    let newObj=Array.isArray(obj)?[]:{}
    for (let key in obj){
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepClone(obj[key])
        }
    }
    return newObj
}
//new
function myNew(constructor,...args){
    let newObj={}
    newObj.prototype=Object.getPrototypeOf(constructor)
    const res=constructor.apply(newObj,args)
    return res instanceof Object?res:newObj
}
//instance of
function myInstanceof(obj,tar){
    let proto=obj.prototype
    let prototype=Object.getPrototypeOf(tar)
    while(proto){
        if (proto===prototype){
            return true
        }
        proto=Object.getPrototypeOf(proto)
    }
    return false
}
//debounce
function debounce(fn,wait){
    let timer
    return function (...args){
        if (timer)clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(this,args)
        },wait)
    }
}
function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>delay){
            fn.apply(this,args)
        }

    }
}
//去重
function filter1(arr){
    return [...new Set(arr)]
}
function filter2(arr){
    return arr.filter(item=>arr.indexOf(item)!==item)
}
//手写简易Promise
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
    // 保存初始化状态
    var self = this;

    // 初始化状态
    this.state = PENDING;

    // 用于保存 resolve 或者 rejected 传入的值
    this.value = null;

    // 用于保存 resolve 的回调函数
    this.resolvedCallbacks = [];

    // 用于保存 reject 的回调函数
    this.rejectedCallbacks = [];

    // 状态转变为 resolved 方法
    function resolve(value) {
        // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }

        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
            // 只有状态为 pending 时才能转变，
            if (self.state === PENDING) {
                // 修改状态
                self.state = RESOLVED;

                // 设置传入的值
                self.value = value;

                // 执行回调函数
                self.resolvedCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        }, 0);
    }

    // 状态转变为 rejected 方法
    function reject(value) {
        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
            // 只有状态为 pending 时才能转变
            if (self.state === PENDING) {
                // 修改状态
                self.state = REJECTED;

                // 设置传入的值
                self.value = value;

                // 执行回调函数
                self.rejectedCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        }, 0);
    }

    // 将两个方法传入函数执行
    try {
        fn(resolve, reject);
    } catch (e) {
        // 遇到错误时，捕获错误，执行 reject 函数
        reject(e);
    }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
    // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
    onResolved =
        typeof onResolved === "function"
            ? onResolved
            : function(value) {
                return value;
            };

    onRejected =
        typeof onRejected === "function"
            ? onRejected
            : function(error) {
                throw error;
            };

    // 如果是等待状态，则将函数或者value加入对应列表中
    if (this.state === PENDING) {
        this.resolvedCallbacks.push(onResolved);
        this.rejectedCallbacks.push(onRejected);
    }

    // 如果状态已经凝固，则直接执行对应状态的函数

    if (this.state === RESOLVED) {
        onResolved(this.value);
    }

    if (this.state === REJECTED) {
        onRejected(this.value);
    }
};
console.log("开始");

const promise = new MyPromise((resolve) => {
    //此时被推入内部
    console.log("执行器内部");
    resolve("结果");
});

promise.then((value) => {
    console.log("then回调:", value);
});

console.log("结束");
//call,apply,bind
function MyCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
function MyApply(context,args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}
function myBind(context,args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    return function (...args2){
        args=args.concat(args2)
        context[fnSymbol](...args)
        delete context[fnSymbol]
    }
}
//quickSort
function quickSort(arr){
    let left=[]
    let right=[]
    let midIndex=Math.floor(arr.length/2)
    let midIndexVal=arr[midIndex]
    //注意：需要将标准值剔除防止重复出现。
    for (let i=0;i<arr.length;i++){
        if(i!==midIndex){
            if (arr[i]<midIndexVal){
                left.push(arr[i])
            }else{
                right.push(arr[i])
            }
        }
    }
    return quickSort(left).concat([midIndexVal],quickSort(right))
}
