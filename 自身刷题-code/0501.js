//总复习
//1.手写instanceof
function myInstanceOf(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){
        if (prototype===proto)return true
        proto=Object.getPrototypeOf(proto)
    }
    return false
}
//手写new
function myNew(constructor,...args){
    let newObj={}
    //如果没有传入构造函数应该如何解决？
    newObj.__proto__=constructor.prototype
    let  result=constructor.apply(newObj,args)
    return result instanceof Object?result:newObj
}
//手写call，apply，bind
function myCall(context,args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}
function myApply(context,args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}
function myBind(){}
//手写深拷贝
function deepClone(obj,hash=new WeakMap()){
    if (obj===null||typeof obj!=='object'){
        return obj
    }
    if (hash.get(obj))return hash.get(obj)
    let newObj=Array.isArray(obj)?[]:{}
    hash.set(obj,newObj)
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepClone(obj[key])
        }else{
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//手写防抖节流
function debounce(fn,delay){
    let timer;
    return function (...args){
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,...args)
        },delay)
    }
}
//对象扁平化
function Flatten(array){
    let res=[]
 if (!Array.isArray(array)){
     return false
 }
 for (let item of array){
     if (Array.isArray(item)){
         res = res.concat(Flatten(item))
     }else{
         res.push(item)
     }
 }
 return res
}
//url参数解析
function DecodeURL(url){
    let x=new URL(url)
    let s=new URLSearchParams(url)
    let obj={}
    s.forEach((item,index)=>{
        obj[index]=item
    })
    return obj
}
//数组常见方法
Array.prototype.myFilter=function (callback){
    let array=this
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i],i, array)){
            res.push(array[i])
        }
    }
    return res
}
Array.prototype.myMap=function (){

}
Array.prototype.myReduce=function (callback,initVal){
    let array=this
    let res=initVal
    let index=0
    if (typeof initVal==='undefined'){
        res = callback(array[index],index++,array)
    }
    while(index<array.length){
        res = callback(array[index],index++,array)
    }
    return res
}
//数组去重
function filter(array){
    return [...new Set(array)]
}
function filter2(array){
    return array.filter((item,index)=>array.indexOf(item)===index)
}
function filter3(array){
    return array.reduce((acc,cur)=>{
        if ()
    })
}
//数据判断
function typeOf(obj){
    return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
}
//数组乱序
function shuffle(array){
    for(let i=0;i<array.length;i++){
        const j=Math.floor(Math.random()*(i+1))
        [array[i],array[j]]=[array[j],array[i]]
    }
    return array
}
function lastSuccessfulPromise(array){
    return new Promise((resolve,reject)=>{
        let index=0
        let res=null
        if (index===array.length-1){
            if(res ===null){
                reject('All promise is reject')
            }else{
                resolve(res)
            }
        }
        array[index].then(value => {
            res = value
            index++
            lastSuccessfulPromise(array)
        }).catch(onerror=>{
            index++
            lastSuccessfulPromise(array)
        })
    })
}