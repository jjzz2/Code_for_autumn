//1.debounce
function debounce(fn,wait){
    let timer
    return function (...args){
        if (timer)setTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,args)
        },wait)
    }
}
//2.throttle
function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (pre-now>=delay){
            fn.apply(this,...args)
            pre=now
        }
    }
}
//3.instanceof
function myInstanceof(obj,tar){
    let proto=obj.prototype
    let prototype=Object.getPrototypeOf(tar)
    while(proto){
        if (proto===prototype)return true
        proto=Object.getPrototypeOf(prototype)
    }
    return false
}
//4.new
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    let res=constructor.apply(newObj,args)
    return res instanceof Object?res:newObj
}
//deepClone
function deepClone(obj){
    if (typeof obj!=='object'){
        throw new Error()
    }
    let newObj=Array.isArray(obj)?[]:{}
    //使得其的key遍历
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepClone(obj[key])
        }else{
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//sumOf
function sumOf(...args1){
    return function addMore(...args2){
        if (args2.length===0){
            return args1.reduce((accu,cur)=>{return accu+cur},0)
        }
        args1.push(...args2)
        return addMore
    }
}
//array
//改变数组中的值反而用map
function arrToTree(array){
    let map={}
    let res=[]
    for (let item of array){
        map[item.id]=item
    }
    for (let i=0;i<array.length;i++){
        let pid=array[i].pid
        if (map[pid]){
            map[pid].children=map[pid].children||[]
            map[pid].children.push(array[i])
        }else{
            res.push(array[i])
        }
    }
    return res
}
//Promise.all
function MyPromiseAll(promises){
    if(!Array.isArray(promises)){
        throw new Error
    }
    return new Promise((resolve,reject)=>{
        let count=0
        let res=[]
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value => {
                count++
                res[i]=value
                if (count===promises.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
function myReduce(fn,initval){
    let res=initval
    let index=0
    if (typeof initval==='undefined'){}
    res=this[index]
    index++
}
function myInstanceof(obj,tar){
    //对象的原型
    let proto=Object.getPrototypeOf(obj)
    //函数的原型
    let prototype=tar.prototype
    while(proto){
        if (proto===prototype)return true
        proto=Object.getPrototypeOf(proto)
    }
    return false
}
//总复习
//1.promise.race
function myPromiseRace(promises){
    return new Promise((resolve,reject)=>{
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then((val)=>{
                resolve(val)
            }).catch(reject)
        }

    } )
}
//2.lazyMan
function lazyMan(name){
    this.queue=[]
    this.name=name
    //1.初始化
    this.queue.push(()=>{
        return new Promise(resolve => {
            console.log(name)
            resolve()
        })
    })
    //1.rest
    this.rest=function (delay){
        this.queue.push(()=>{
            return new Promise(resolve => {
                //不使用箭头函数，直接进行调用
                setTimeout(resolve,delay*1000)
            })
        })
    }
    //2.restFirst
    this.restFirst=function (delay){
        this.queue.unshift(()=>{
            return new Promise(resolve => {
                setTimeout(resolve,delay*1000)
            })
        })
    }
}
//curried
function curry(fn){
    return function curried(...args1){
        if (fn.length<args1.length){
            fn.apply(this,args1)
        }else return function (...args2){
            args1=args1.concat(...args2)
            curried.apply(this,args1)
        }
    }
}
//new
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    const res=constructor.apply(newObj,...args)
    return res instanceof Object?res:newObj
}
//限制并发
function limits(promises,limits){
    function
    return new Promise(resolve,reject)
}
//手写reduce
function myReduce(fn,initVal){
    let res=[initVal]
    let index=0
    if (initVal===undefined){

    }
}
//promise.retry
function myPromiseRetry(count,promises){
    return new Promise((resolve,reject) =>{
    })
}
//sumOf
function sumOf(...args){

    return function add(...args1){
        if (args1.length===0){
            args.reduce((acc,cur)=>acc+cur,0)
        }
        args.push(...args1)
        return add
    }
}
function sleep(fn,wait){
    return new Promise(resolve => {
        setTimeout(()=>resolve(fn),wait*1000)
    })
}
//手写call，apply，bind
function myCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}
//bind
function myBind(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    return function (...args1){
        args = args.concat(args1)
        context[fnSymbol](...args)
        delete context[fnSymbol]
    }
}
//apply就是跟call参数调换了一下，结果都是一样的
function myReduce(fn,initVal){
    let result=initVal
    let index=0
    if (initVal===undefined){
        result=this[index]
    }
    //实现累加
    while(index<this.length){
        result=fn(this[index++])
    }
    return result
}
function PromiseRetry(fn,retries){
    return new Promise((resolve,reject) => {
        Promise.resolve(fn()).then(resolve)
    }).catch(err=>{
        if (retries>=0){
            PromiseRetry(fn,retries-1).then(resolve).catch(reject)
        }else{
            reject(error)
        }
    })
}
//继续总复习
//数组乱序
function shufflel1(arr){
    return arr.sort(()=>Math.random()-0.5)
}
function randomSortArray(arr){
    let backArr=[]
    while(arr.length){
        let index=parseInt(Math.random()*arr.length)
        backArr.push(arr[index])
        arr.splice(index, 1);
    }
    return backArr
}
//手写jsonp
function addScript(src){
    const script=document.createElement('script')
    script.src=src
    script.type='text/javascript'
    document.body.appendChild(script)
}
addScript('')