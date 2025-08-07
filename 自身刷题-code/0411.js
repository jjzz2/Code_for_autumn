function arrToTree(array){
    let map={}
    let res=[]
    for (let item of array){
        //注意这里是id
        map[item.id]=item
        map[item.id].children=[]
    }
    for (let i=0;i<array.length;i++){
        let pid=array[i].pid
        if (!map[pid]||pid===0){
            res.push(array[i])
        }else{
            map[pid].children.push(array[i])
        }
    }
    return  res
}
//柯里化函数
function curry(fn){
    return function curried(...args){
        if (fn.length<=args.length){
            //必须要有返回值
           return fn.apply(this,...args)
        }else{
            return function (...args2){
                args=args.concat(args2)
                return curried.apply(this,...args)
            }
        }
    }
}
//类型判断
function judge(obj){
    let originType=Object.prototype.toString.call(obj)
    let index=originType.indexOf(' ')
    let type=originType.slice(index+1,-1)
    return type.toLowerCase()
}
//1.手写instanceof
function myInstanceof(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){
        if (proto===prototype)return true
        proto=Object.getPrototypeOf(proto)
    }
    return false
}
//手写new
function myNew(constructor,...args){
    let newObj={}
    //注意指向的是newObj
    newObj.__proto__=constructor.prototype
    let result=constructor.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
//手写call，apply,bind
function myCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
function myApply(context,args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}
function myBind(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    return function (...args2){
        args=args.concat(args2)
        context[fnSymbol](...args)
        delete context[fnSymbol]
    }
}
function deepClone(obj){
    if (typeof obj!=='object'||!obj){
        return obj
    }
    let res=Array.isArray(obj)?[]:{}
    //注意这里是let key in Obj
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            res[key]=deepClone(obj[key])
        }
    }
    return res
}
//手写防抖节流
function debounce(fn,wait){
    let timer=null
    return function (...args){
        if (timer)clearTimeout(timer)
        timer =setTimeout(()=>{
            fn.apply(this,...args)
        },wait)
    }
}
function throttle(fn,wait){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=wait){
            fn.apply(this,...args)
            pre = now
        }
    }
}
//手写ajax请求
function ajax(url){
    return new Promise((resolve, reject) => {
        const xhr=new XMLHttpRequest()
        xhr.open('GET',url, true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }else{
                    reject('error')
                }
            }
        }
        xhr.send()
    })
}
//数组去重
function filter(array){
    return [...new Set(array)]
}
function unique2(array){
    return array.filter((item,index)=>{
        return array.indexOf(item)!==index
    })
}
function unique3(array){
    return Array.from(new Set(array))
}
//数组扁平化
function flat(array,depth){
    let res=[]
    if (!Array.isArray(array)){
        throw new Error
    }
    for (let i=0;i<array.length;i++){
        if (Array.isArray(array[i])&&depth>0){
            res=res.concat(flat(array[i],depth-1))
        }else{
            res.push(array[i])
        }
    }
    return res
}
//乱序
function shuffle1(arr){
    //要不然大于等于小于零进行排序
    return arr.sort(()=>Math.random()-0.5)
}
//Promise.all
function MyPromiseAll(promises){
    let cnt=0
    let res=[]
    return new Promise((resolve,reject)=>{
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value =>{
                cnt++
                res[i]=value
                if (cnt===promises.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
function MyRace(promises){
    return new Promise((resolve, reject) => {
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then(value =>{
                resolve(value)
            })
        }
    })
}
//手撕快排
function quickSort(array){
    let left=[]
    let right=[]
    //需要返回
    if (array.length<=1){
        return array
    }
    let midIndex=Math.floor((array.length)/2)
    let midiIndexVal=array[midIndex]
    for (let i=0;i<array.length;i++){
        if (i!==midIndex){
            if(array[i]<midiIndexVal){
                left.push(array[i])
            }else{
                right.push(array[i])
            }
        }
    }
    return quickSort(left).concat([midiIndexVal,quickSort(right)])
}
//eventBus
class EventBus{
    constructor(){
        this.events={}
    }
    on(name,callback){
        let events=this.events
        if (!this.events[name]){
            this.events[name]=[]
        }
        this.events[name].push(callback)
    }
    off(name,callback){
        let events=this.events
        if (this.events[name]){
            this.events[name]=this.events[name].filter(item=>item!==callback)
        }

    }
    emit(name,...args){
        if(this.events[name]){
            this.events[name].forEach(item=>{
                item(...args)
            })
        }
    }
    once(name,callback){
        //触发一次事件监听
        const onceWrapper=(...args)=>{
            callback(...args)
            this.off(name, onceWrapper)
        }
        this.on(name, onceWrapper)
    }
}
//下划线转驼峰
function getKebCase(str){
    let arr=str.split('')
    return arr.map((item)=>{
        if (item.toUpperCase()===item){
            return '_'+item.toLowerCase()
        }else{
            return item
        }

    }).join('')
}
//限制最大并发
function limits()