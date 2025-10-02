//等待await状态变化，不能进行其余的操作
function waitAndLog(color,time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log(color)
            resolve()
        },time)
    })
}
async function printLight(){
    while(1){
        await waitAndLog('red',3000)
        await waitAndLog('yellow',2000)
        await waitAndLog('green',1000)
    }
}

//使用递归而不是使用循环
function mysetInterval(callback,delay){
    let timerId=null
    const interval=()=>{
        callback()
        timerId=setTimeout(interval,delay)
    }
    timerId=setTimeout(interval,delay)
    return function myClearInterval(){
        clearTimeout(timerId)
    }

}
function uploadImage(url) {
    let cnt=0
    let res=[]
    return new Promise((resolve,reject)=>{
        for (let item of url){
            request(item).then((value)=>{
                cnt++
                res.push(value)
                if (cnt===url.length){
                    resolve(res)
                }
            }).catch(reject)
        }

    })
}
function print(){
    for (let i=1;i<5;i++){
        console.log(i)
    }
}
function filterArr1(arr){
    return [...new Set(arr)]
}
function filterArr2(arr){
    arr = arr.filter((item,index)=>arr.indexOf(item)===index)
}
function flatten(arr){
    if (!Array.isArray(arr)||typeof arr ===null){
        return
    }
    for (let i=0;i<arr.length;i++){
        if (Array.isArray(arr[i])){
            flatten(arr[i])
        }else{
            arr.push(arr[i])
        }
    }
    return arr
}
function myMap(array,callback){
    let newarr=[]
    for (let item of array){
        newarr.push(callback(item))
    }
    return newarr
}
function myfilter(array,callback){
    let newarr=[]
    for (let item of array){
        if (callback(item)){
            newarr.push(item)
        }
    }
    return newarr
}
function jstree(list){
    const map=new Map()
    list.forEach(item=>{
        item.children=[]
        map.set(item.id,item)
    })
    const tree=[]
    list.forEach(item=> {
        const parent=map.get(item.parentId)
        if (parent){
            parent.children.push(item)
        }else{
            tree.push(item)
        }
    })
    return tree
}
function parseURLParams(url){
    const params={}
    const queryStringIndex=url.indexOf('?')
    if (queryStringIndex===-1){
        return params
    }
    const query=url.slice(queryStringIndex+1)
    if (!query){
        return params
    }
    const pairs=query.split('&')
    pairs.forEach((pair)=>{
        const [key,value]=pair.split('=')
        if (key){
            params[decodeURIComponent(key)]=decodeURIComponent(value||'')
        }
    })
    return params
}
//类数组转为数组：
const arr1=Array.from(arrLike)
const arr2=[...arrLike]
//add
function add(...args){
    let all=[...args]
    function curried(...next){
        all.push(...next)
        return curried
    }
    curried.valueOf=function (){
        return all.reduce((sum,item)=>sum+item,0)
    }
    return curried
}
// 正确的方式
setInterval(print, 1000);
printLight()
mysetInterval()