//sumof
function sumOf(...args1){
    return function addMore(...args2) {
        if (args2.length === 0) {
            return args1.reduce((acc, cur) => acc + cur, 0)
        }
        args1.push(...args2)
        return addMore
    }
}
function sumOf(...args1){
    return function addMore(...args2){
        if (args2.length===0){
            return args1.reduce((acc,cur)=>acc+cur, 0)
        }
        args1.push(...args2)
        return addMore
    }
}
//hardMan
function hardMan(name){
    this.name=name
    this.queue=[]
    this.queue.push(()=>{
        return new Promise((resolve)=>{
            console.log('xxx')
            resolve()
        })
    })
    this.study=function (job){
        this.queue.push(()=>{
            return new Promise(resolve => {
                console.log('xxx')
                resolve()
            })
        })
    }

    this.rest=function (wait){
        this.queue.push(()=>{
            return new Promise(resolve => {
                setTimeout(()=>{
                    resolve()
                },wait*1000)
            })
        })
    }
}
//Array.filter
function MyFilter(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i],i, array)){
            res.push(array[i])
        }
    }
    return res
}
//注意：首先reduce是在原型链上的，然后对其进行分割
function myReduce(array,fn,initVal){
    let res=initVal
    let index=0
    if (typeof initVal==='undefined'){
        res = array[index]
        index++
    }
    while(index<array.length){
        res=fn(res,array[index++])
    }
    return res
}
//function map
function MyMap(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        res.push(callback(array[i],i,array))
    }
    return res
}
//Promise.retry,首先其是数组
function promiseRetry(fn,retries){
    return new Promise((resolve,reject)=>{
        promise.resolve(fn()).then(resolve).catch(onerror=>{
            console.log(onerror)
            if (retries>=0){
                Promise.retry(fn,retries-1).then(resolve).catch(reject)
            }else{
                //掌握链式调用的精髓
                reject(onerror)
            }
        })
    })
}
function sumOf(...args1){
    return function add(...args2){
        if (args2.length ===0){
            args1=args1.reduce((accu,cur)=>accu+cur,0)
        }
        args1=args1.concat(...args2)
        return add
    }
}
//使用urlSearchParmas来解析。
function getURlParams(url){
    const searchParams=new URL(url).searchParams
    //使用键值对来处理
    const paramsObj = {};
    searchParams.forEach((value, key) => {
        paramsObj[key] = value;
    });

    return paramsObj;  // 返回查询参数对象
}
const x= getURlParams("https://www.example.com/path?name=example&id=123&active=true")
console.log(x)
function findDifferent(str){
    let x=new Set()
    let markPlace=0
    for (let i=0;i<str.length;i++){
        if (x.has(str[i])){
            //有就代表重复了
            markPlace=i
            break
        }
        x.add(str[i])
    }
    for (let i=markPlace;i<str.length;i++){
        if (!x.has(str[i])){
            return i
        }
    }
}
