function myInstanceOf(obj,constructor){
    let __proto__=Object.getPrototypeOf(obj)
    let prototype=constructor.prototype
    while(__proto__){
        if(__proto__===prototype){
            return true
        }
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false
}
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    let result=constructor.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
function myCall(context,args){
    context=context||window
    let fn=Symbol('fn')
    context[fn]=this
    let result= context[fn](...args)
    delete context[fn]
    return result
}
function myApply(context,...args){
    context=context||window
    let fn=Symbol('fn')
    context[fn]=this
    let result=context[fn](args)
    delete context[fn]
    return result
}
function myBind(context,...args) {
    context = context || window
    let fn = Symbol('fn')
    context[fn]=this
    return function (...args2){
        let  finalArgs=args.concat(...args2)
        return context[fn](...finalArgs)
    }
}
function DeepClone(obj){
    if (typeof obj!=='object'||obj===null)return obj
    let newObj=Array.isArray(obj)?[]:{}
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepClone(obj[key])
        }else{
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//debounce+throttle
function myDebounce(fn,wait){
    let timer=null
    return function (...args){
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,args)
        },wait)
    }
}
function myThrottle(fn,wait){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=wait){
            fn.apply(this,...args)
            pre = now
        }
    }
}
function ajax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest()
        xhr.open('GET',url, true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }else{
                    reject('err')
                }
            }
        }
        xhr.send()
    })
}
//数组去重
function filter1(arr){
    return [...new Set(arr)]
}
function filter2(arr){
    let res=[]
    arr.forEach((item)=>{
        if (!res.find(item)){
            res.push(item)}
    })
    return res
}
function filter3(arr){
    return arr.filter((item,index)=>arr.indexOf(item)===index)
}
//数组扁平化
function flattenArray(arr){
    if (typeof arr!=='object'){
        return arr
    }
    let array=[]
    for (let i=0;i<arr.length;i++){
        if (Array.isArray(arr[i])){
            array=array.concat(flattenArray(arr[i]))
        }else{
            array[i]=arr[i]
        }
    }
    return array
}
function flattenArray2(arr){
    return arr.toString().split('').map(Number)
}
//数组乱序
function randomArray(arr){

}
//promise.all等方法
function myPromiseAll(arr){
    let res=[]
    let cnt=0
    return new Promise((resolve,reject)=>{
        for (let i=0;i<arr.length;i++){
            Promise.resolve(arr[i]).then((val)=>{
                res[i]=val
                cnt++
                if (cnt===arr.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
function myPromiseRace(arr){
    return new Promise((resolve,reject)=>{
        for (let i=0;i<arr.length;i++){
            Promise.resolve(arr[i]).then((val)=>{
                resolve(val)
            }).catch(reject)
        }
    })
}
//快排
function quickSort(arr){
    let left=[]
    let right=[]
    let midIndex=Math.floor(arr.length/2)
    let minIndexVal
}