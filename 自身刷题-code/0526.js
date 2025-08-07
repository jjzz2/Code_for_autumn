//1.手写instanceOf
function myInstanceOf(obj,tar){
    let __proto__=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(__proto__){
        if (__proto__===prototype){return true}
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false;
}
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    let result=constructor.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
function myCall(context,...args) {
    //结果是这样的，必须进行返回
    context = context||window
    let fn=Symbol('fnSymbol')
    context[fn]=this
    let result=context[fn](...args)
    delete context[fn]
    return result
}
function myApply(context,arg){
    context=context||window
    let fn=Symbol('fnSymbol')
    context[fn]=this
    let result=context[fn](...arg)
    delete context[fn]
    return result
}
function myBind(context,...args){
    context=context||window
    let fn=Symbol('fnSymbol')
    context[fn]=this
    return function(...args2){
        args=args.concat(...args2)
        let result=context[fn](...args)
        delete context[fn]
        return result
    }
}
function myDeepClone(obj,hash=new WeakMap()){
    if (hash.get(obj))return hash.get(obj)
    if (typeof obj!=='object'||obj===null)return obj
    let cloneObj=Array.isArray(obj)?[]:{}
    hash.set(obj,cloneObj)
    for (let key of obj){
        if (Object.hasOwnProperty(key)){
            cloneObj[key]=myDeepClone(obj[key],hash)
        }else{
            cloneObj[key]=obj[key]
        }
    }
    return cloneObj

}
function findPath(root,target){
    if (!root)return []
    let cur=[root]
    let res=[]
    function dfs(root){
        if (root===target){
            res=[...cur]
            return
        }
        if (root.left===null&&root.right===null){
            return
        }
        if (root.left){
            cur.push(root.left)
            dfs(root.left)
            cur.pop()
        }
        if (root.right){
            cur.push(root.right)
            dfs(root.right)
            cur.pop()
        }
    }
    dfs(root)
    return res
}
function myAjax(url){
    return new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest()
        xhr.open('GET',url,true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }else{
                    reject(onerror=>onerror)
                }
            }
            xhr.send()
        }
    })
}
//去重
//1.filter
function myFilter1(array){
    return [...new Set(array)]
}
//2.
function myFilter2(array){
    return array.filter((item,index)=>array.indexOf(item)===index)
}
function myFilter3(array){
    let res=[]
    array.forEach((item)=>{
        if (res.indexOf(item)===-1){
            res.push(item)
        }
    })
    return res
}
//3.数组扁平
function flatten1(array){
    return array.toString().split('').map(Number)
}
function flatten2(array){
    let res=[]
    for (let item of array){
        if (Array.isArray(item)){
            res = res.concat(flatten2(item))
        }else{
            res.push(item)
        }

    }
    return res
}
//乱序
function shuffle(array){

    for (let i=0;i<array.length;i++){
        let j=Math.floor(Math.random()*(i+1))
        [array[i],array[j]]=[array[j],array[i]]
    }
    return array
}
//Promise.all
function myPromiseAll(arr){
    return new Promise((resolve,reject)=>{
        if (!Array.isArray(arr)){
            reject(arr)
            return
        }
        let res=[]
        let cnt=0
        for (let i=0;i<arr.length;i++){
            Promise.resolve(arr[i]).then((value)=>{
                res[i]=value
                cnt++
                if (cnt===arr.length){
                    resolve(res)
                }
            }).catch(error=>{
                reject(error)
            })
        }

    })
}
function myPromiseRace(arr){
    return new Promise((resolve,reject)=>{
        for (let item of arr){
            Promise.resolve(item).then((value)=>{
                resolve(value)
            }).catch(onerror=>reject(onerror))
        }
    })
}
//quickSort
function quickSort(arr){
    let leftIndex=0
    let rightIndex=arr.length-1
}

//curried
function curry(fn,...args){
    return function curried(...args2){
        if (args.length>=fn.length){
            fn.apply(this,...args)
        }else return function (...args2){
            args=args.concat(...args2)
            curried.apply(...args)
        }
    }
}
//防抖节流
function debounce(fn,delay){
    let timer
    return function (...args){
        if (timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(this,...args)
        },timer)
    }
}
function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=delay){
            fn.apply(this,...args)
        }
        pre = now
    }
}
class EventBus{
    constructor(){
        this.events={}
    }
    on(event,callback){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    off(event,callback){
        if (this.events[event]){
            this.events[event]=this.events[event].filter((item)=>item!==callback)
        }
    }
    emit(event,...args){
        if (this.events[event]){
            this.events[event].forEach((callback)=>callback(...args))
        }
    }
}
//数组方法
function myFilter(array,callback){
    if (!Array.isArray(array)){
        console.error('err')
        return
    }
    let result=[]
    for (let item of array){
        if (callback(item)){
            result.push(item)
        }
    }
    return result
}
function myMap(array,callback){
    let res=[]
    for (let item of array){
        res.push(callback(item))
    }
    return res
}
function myFill(array,callback,startIndex=0,endIndex=array.length){
    for (let i=startIndex;i<endIndex;i++){
        array[i]=callback(array[i])
    }
    return array
}
function myReduce(initVal,index){

}
//柯里化
function myCurried(fn,initVal){

}

//url
function parseURL(url){
    const x=new URL(url).searchParams
    let object={}
    x.forEach((item,index)=>{
        object[index]=item
    })
    return object
}
//手写Promise
class myPromise{
    constructor(callback){
        this.state='pending'
        this.value=null
        this.reason=null
        const resolve=(value)=>{
            if (this.state==='pending'){
                this.state='resolved'
                this.value=value
            }
        }
        const reject=(reason)=>{
            if (this.state==='pending'){
                this.state='rejected'
                this.reason=reason
            }
        }
        try {
            callback(resolve,reject)
        }catch(error){
            reject(error)
        }
    }
    //then传入的都是函数
    then(onfullified,onrejected){
        if (this.state==='resolved'){
            onfullified(this.value)
        }
        if (this.state==='rejected'){
            onrejected(this.value)
        }
        if (this.state==='pending'){
            this.onResolvedCallbacks.push(()=>{
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(()=>{
                onRejected(this.reason)
            })
        }
        //可用链式调用
        return new MyPromise((resolve,reject)=>{
            const resolveWrapper=(onFulfilled)=>{
                try {
                    const x=onFulfilled(this.value)
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            }
            const rejectWrapper=(onRejected)=>{
                try {
                    const x=onRejected(this.reason)
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            }
            if (this.state==='funfilled'){
                resolveWrapper(this.value)
            }
            if (this.state==='rejected'){
                rejectWrapper(this.reason)
            }
            if (this.state==='pending'){
                this.onResolvedCallbacks.push(resolveWrapper)
                this.onRejectedCallbacks.push(rejectWrapper)
            }
        })
    }

}

//大数相加

//下划线
function change(){

}
//sleep
function MySleep(delay){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,delay)
    })
}
//setInterval
//1，2，3

//lazyMan

//红，黄，绿

//并发控制
function limitRun(array,limit){
    return new Promise((resolve,reject)=>{
        let runningTask=0
        let sum=0
        let res=[]
      const run=()=> {
          if (sum === array.length && runningTask === 0) {
              resolve(res)
              return
          }
          while (runningTask <= limit&&sum<=array.length) {
              let index = sum
              runningTask++
              sum++
              Promise.resolve(array[index]).then((value) => {
                  res[index] = value
                  runningTask--
                  run()
              }).catch(reject)
          }
      }
    })
}
//列表转树
function arrToTree(array){
    let map={}
    let res=[]
    for (let item of array){
        map[item.id]=item
        map[item.id].children=[]
    }
    for (let i=0;i<array.length;i++){
        let parentID=array[i].parentId
        if (map[parentID]){
            map[parentID].children.push(array[i])
        }else{
            res.push(array[i])
        }
    }
    return res
}
//继承方式
//寄生组合式继承解决这个问题：使用一个inherit来进行解决
function inherit(child,parent){
    let prototype=Object.create(parent.prototype)
    prototype.constructor=child
    child.prototype=prototype
}
function Parent(){
    this.name='parent'
}
Parent.prototype.sayName=function (){
    console.log(this.name)
}
function Child(){
    Parent.call(this)
    this.type='child'
}
inherit(Child,Parent)
let child=new Child()
child.sayName()
console.log(child.name)
//curry函数
function curry(fn,...args){
    return function curried(){
        if (args.length>=fn.length){
            return fn.apply(this,...args)
        }else{
            return function (...args2){
                args=args.concat(args2)
                return curried.apply(this,...args)
            }
        }
    }
}