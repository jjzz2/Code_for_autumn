//手写instanceof
function myInstanceof(obj,tar){
    //这里不一样因为可以自己定义变量
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){
        if (proto ===prototype)return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}
//手写new
function myNew(constructor,...args){
    let newObj={}
    //必须是对象的原型
    newObj.__proto__=constructor.prototype
    let result=constructor.apply(newObj,args)
    return result instanceof Object?result:newObj
}
function Car(name,price){
    this.name = name
    this.price = price
}
Car.prototype.run = function() {
    console.log(this.price);
};
var test_create = myNew(Car, 'a', 100000);
console.log(test_create)
// compare
let obj = new Car( 'a', 100000)
console.log(obj)
//手写call,apply,bind
function myCall(context,...args){
    context=context||window
    const fn=Symbol('fn')
    context[fn]=this
    context[fn](args)
    delete context[fn]
}
function myApply(context,arg){
    context=context||window
    const fn=Symbol('fn')
    context[fn]=this
    context[fn]=this
    context[fn](...arg)
    delete context[fn]
}
function myBind(context,...args){
    context=context||window
    const fn=Symbol('fn')
    context[fn]=this
    return function (...args2){
        args=args.concat(...args2)
        context[fn](...args)
        delete context[fn]
    }
}
//deepclone
function DeepClone(obj,hash=new WeakMap()){
    if (!obj||typeof obj==='object')return obj
    if (hash.get(obj))return hash.get(obj)
    let newObj=Array.isArray(obj)?[]:{}
    hash.set(obj,newObj)
    for (let key in obj){
        if (Object.hasOwnProperty(key)){
            newObj[key]=DeepClone(obj[key],hash)
        }else{
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//手写防抖节流
function debounce(fn,delay){
    let timer
    return function (...args){
        if (timer)clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(this,...args)
        },delay)
    }
}
function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=delay){
            fn.apply(this,...args)
        }
        pre = Date.now()
    }
}
function ajax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest()
        //开启
        xhr.open('GET',url, true)
        xhr.onreadystatechange=function(){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }
            }else{
                reject('error')
            }
        }
        xhr.send()
    })
}
//数组去重
function uniqueArray1(array){
    return [...new Set(array)]
}
function uniqueArray2(array){
    return array.filter((item,index)=>{
        return array.indexOf(item)===index
    })
}
function uniqueArray4(array){
    let res=[]
    array.forEach((item,index)=>{
        if (res.indexOf(item)===-1){
            res.push(item)
        }
    })
    return res
}
//数组扁平化
function FlatArray(array,depth){
    if (!Array.isArray(array))return array
    let newarray=[]
    for (let i=0;i<array.length;i++){
        if (Array.isArray(array[i])&&depth>0){
            //newarray.push(...FlatArray(array[i],depth-1))
            newarray=newarray.concat(FlatArray(array[i],depth-1))
        }else{
            newarray.push(array[i])
        }
    }
    return newarray
}
function FlatArray2(array){
    return array.toString().split('').map(item=>Number(item))
}
//数组乱序
function array1(array){
    return array.sort(()=>Math.random()-0.5)
}
function randomSort(arr){
    let backArr=[]
    while(arr.length){
        let index=parseInt(Math.random*arr.length)
        backArr.push(arr[index])
        arr.splice(index, 1)
    }
    return backArr
}
function myPromiseAll(promises){
    return new Promise((resolve,reject)=>{
        let res=[]
        let cnt=0
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value => {
                res.push(value)
                cnt++
                if (cnt===promises.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
function myPromiseRace(promises){
    return new Promise((resolve,reject)=>{
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value => {
                resolve(value)
            }).catch(reject)
        }
    })
}
//retried
function myPromiseRetried(promise,retried){
    return new Promise((resolve,reject)=>{
        Promise.resolve(promise).then(value => {
            resolve(value)
        }).catch(onerror=>{
            console.log(onerror)
            if (retried>0) myPromiseRetried(promise,retried-1).then(resolve).catch(reject)
            else{
                reject(onerror)
            }
        })
    })
}
class myPromise {
    constructor() {
        this.state = 'pending'
        this.onResolved = []
        this.onRejected = []
        this.reason = null
        this.value = null
        let resolve = (value) => {
            //对其进行递归调用

        }
    }
}
    // optim('class-a') // a
    // optim('class-aa') // b
    // optim('class-a') // a
    // optim('class-a class-aa class-b') // a b c
function optim(className){
    let strs=className.split(' ')
    let res=""
    let cnt=0
    for (let str of strs){
        let g=str.split('-')
        if (g[1]==='a'){
            res+='a'
        }
        if (g[1]==='aa'){
            res+='b'
        }
        if (g[1]==='b'){
            res+='c'
        }
        if(cnt!==strs.length)res+=' '
        cnt++
    }
    return res
}
// 封装一个fetch，有最大并发限制10，每个请求可以有优先级，根据优先级发请求，优先级大于等于0，
// 越大优先级越高 如 myFetch(url, options={}, priority=0)
function myFetch(url,options={},priority=0){
    return new Promise((resolve,reject)=>{

    })
}
//快排
function quickSort(array){
    let left=[]
    let right=[]
    let midIndex=Math.floor(array.length/2)
    let midIndexVal=array[midIndex]
    for (let i=0;i<array.length;i++){
        if(i!==midIndex){
            if (array[i]<=midIndexVal){
                left.push(array[i])
            }else{
                right.push(array[i])
            }
        }
    }
    return quickSort(left).concat([midIndexVal],quickSort(right))
}
//手写jsonp
function jsonp(src){
    const script=document.createElement('script')
    script.src=src
    script.type='text/js'
    document.body.appendChild(script)
}
//手写函数柯里化
function curry(fn){
    return function curried(...args){
        if (fn.length<=args.length){
            fn.apply(this,args)
        }else return function (...args2){
            args=args.concat(args2)
            return curried.apply(this,args)
        }
    }
}
//发布订阅模式
class Events{
    constructor(){
        this.events={}
    }
    on(event,callback){

    }
}
//手写对象扁平化
function flattenObject(obj, parentKey = '', result = {}) {
    for (let key in obj) {

        if (obj.hasOwnProperty(key)) {
            const currentKey = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];

            // 核心判断条件
            if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value) &&
                !(value instanceof Date) &&
                !(value instanceof RegExp)
            ) {
                flattenObject(value, currentKey, result); // 递归处理对象
            } else {
                result[currentKey] = value; // 存入最终结果
            }
        }
    }
    return result;
}

// 示例
const obj1 = {
    a: 1,
    b: { c: 2, d: { e: 3 } },
    f: [4,5],
    g: new Date()
};

console.log(flattenObject(obj1));
/* 输出:
{
  "a": 1,
  "b.c": 2,
  "b.d.e": 3,
  "f": [4,5],
  "g": Date实例
}
*/
//sumof
function mySumof(...args){
    return function add(...args1){
        args=args.concat(args1)
        if (args1.length===0)return args.reduce((accu,cur)=>accu+cur,0)
        return add
    }
}

