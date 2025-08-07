//牛客手撕，再战，百世轮回！
//1.手写发布订阅模式
class Eventemitter{
    constructor(){
        this.events={}
    }
    on(event,callback){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)

    }
    off(event,callback){}
    emit(event,callback){}
}
//2.手写Promise
class Promise{
    constructor(executor){
        this.status='pending'
        this.value=undefined
        this.reason=undefined
        this.onResolvedCallbacks=[]
        this.onRejectedCallbacks=[]
        let resolve=(data)=>{
            if (this.status==='pending'){
                this.value=data
                this.status='resolved'
                this.onResolvedCallbacks.forEach(fn=>fn())
            }
        }
        let reject=(reason)=>{
            if (this.status==='pending'){
                this.value=reason
                this.status='rejected'
                this.onRejectedCallbacks.forEach(fn=>fn())
            }
        }
        try{
            executor(resolve,reject)
        }catch (e){
            reject(e)
        }
    }
    then(onFulFilled,onRejected){
        if (this.status==='resolved'){
            onFulFilled(this.value)
        }
        if (this.status==='rejected'){
            onRejected(this.reason)
        }
        if (this.status==='pending'){
            this.onRejectedCallbacks.push(()=>{
                onFulFilled(this.reason)
            })
            this.onResolvedCallbacks.push(()=>{
                onRejected(this.status)
            })
        }

    }

}
class myPromise2{
    constructor(executor){
        this.state='penging'
        this.onResolved=[]
        this.onRejected=[]
        this.value=null
        this.reason=null
        //resolve,reject构造函数
        let resolve=(value)=>{
            if (this.state==='penging'){
                this.state='resolved'
                this.value=value
                this.onResolved.forEach(fn=>fn())
            }
        }
        let reject=(reason)=>{
            if (this.state==='penging'){
                this.state='rejected'
                this.reason=reason
                this.onRejected.forEach(fn=>fn())
            }
            try {
                executor(resolve,reject)
            }catch (e){
                reject(e)
            }
        }
    }
    then(fullified,resolved){
        if (this.state==='Resolved'){
            fullified(this.value)
        }
        if(this.state==='rejected'){
            resolved(this.reason)
        }
        if (this.state==='penging'){
            this.onResolved.push(fullified)
            this.onRejected.push(resolved)
        }
    }


}
//3.下滑线转驼峰
function stringSwitch(str){
    let array=str.split('_').map((item)=>{

        return item[0].toUpperCase()+item.slice(1)
    })
    return array.join('')
}
function deepclone(obj,hash=new WeakMap()){
    if (!obj||typeof obj!=='object')return obj
let newObj=Array.isArray(obj)?[]:{}
    if (hash.get(obj))return hash.get(obj)
    hash.set(obj,newObj)
    for (let key in obj){
        if (Object.hasOwnProperty(key)){
            newObj[key]=deepclone(obj[key],hash)
        }
    }
    return newObj
}

//4.深拷贝含引用
//5.大数相加
function BigInt(number1,number2){
    let x1=number1.toString().split('')
    let x2=number2.toString().split('')
    let res=[]
    let n=x1.length-1
    let m=x2.length-1
    let carry=0
    while(x1[n]||x2[m]||carry>=0){

    }
    return res.join('')
}
//7.场景题
//todoList