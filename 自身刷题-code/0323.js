//array to tree
function arrayToTree(arr){
    let map={}
    let res=[]
    for (let item of arr){
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        let pid=arr[i].pid
        if (map[pid]){
            //todo 增加判断
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }else{
            res.push(arr[i])
        }
    }
    return res
}
//debounce
function debounce(fn,delay){
    let timer
    return function (args){
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,...args)
        },delay)
    }
}
//throttle
function throttle(fn,wait){
    let pre=Date.now()
    return function (...args){
        let nowTime=Date.now()
        if (nowTime-pre>=wait){
            //todo 增加现在计算时间
            pre = nowTime
            fn.apply(this,args)
        }
    }
}
//curried
function curry(fn){
    return function curried(...args){
        if (args.length>=fn.length){
            fn.apply(this,args)
        }else return function (args2){
            args=args.concat(...args2)
            curried.apply(this,args)
        }
    }
}
//Promise.race
function MyPromiseRace(promises){
    return new Promise((resolve,reject) => {
        for (let item of promises){
            Promise.resolve(item).then(value =>{
                resolve(value)
            }).catch(onerror=>reject(onerror))
        }
    })
}
//Promise.all
function myPromiseAll(promises){
    let res=[]
    let cnt=0
    return new Promise((resolve,reject)=>{
        //todo 不能使用for...of的形式，必须保持相对顺序
        for (let i=0;i<promises.length;i++){
            Promise.resolve(i).then(value => {
                res[i]=value
                cnt++
                if (cnt===promises.length){
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
//限制并发
function limit(fetchList,n){
    return new Promise((resolve, reject) => {
        let runningTasks=0
        let cnt=0
        let res=[]
        function run(){
            if(cnt===fetchList.length&&runningTasks===0){
                resolve(res)
                return
            }
            while(cnt<fetchList.length&&runningTasks<n){
                //todo 设置一个currentIndex来保存当前值
                let currentIndex=cnt
                cnt++
                runningTasks++
                fetchList[currentIndex].then(value => {
                    res[currentIndex]=value
                    runningTasks--
                    run()
                }).catch(reject)
            }
        }
        run()
    })
}
//手写flat
function myFlat(array,depth=1){
    let res=[]
    if (!Array.isArray(array)){
        throw new Error('err')
    }
    for(let i=0;i<array.length;i++){
        if (Array.isArray(array[i])&&depth>0){
            res[i]=res[i].concat(array[i],depth-1)
        }else{
            res[i]=array[i]
        }
    }
    return res

}
//手写ajax
function myAjax(url){
    return new Promise((resolve, reject) => {
        let xhr=new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    const res=JSON.stringify(xhr.responseText)
                    resolve(res)
                }else{
                    reject('error')
                }
            }
        }
        xhr.send()
    })
}
//手写deepClone--完全版，使用弱引用完成
function deepClone(obj,hash=WeakMap){
    if(typeof obj!=='object'||obj===null){
        return obj
    }
    if(hash.has(obj)){
        return hash.get(obj)
    }
    let newObj=Array.isArray(obj)?[]:{}
    hash.set(obj,newObj)
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepClone(obj[key],hash)
        }
    }
    return newObj
}
//手写快排
function quickSort(arr){
    //结束递归：
    if (arr.length<1){
        return arr
    }
    let left=[]
    let right=[]
    let midIndex=Math.floor(arr.length/2)
    let midIndexVal=arr[midIndex]
    for (let i=0;i<arr.length;i++){
        if (arr[i]<midIndexVal){
            left.push(arr[i])
        }else{
            right.push(arr[i])
        }
    }
    return quickSort(left).concat([midIndexVal],quickSort(right))
}
//手写reduce
Array.prototype.myReduce=function (callback,initial){
    let result=initial
    //记录起始点
    let index=0
    if (typeof initial==='undefined'){
        result=this[index]
        index++
    }
    while(index<this.length){
        result=callback(result,this[index++])
    }
    return result
}
//手写lazyman
