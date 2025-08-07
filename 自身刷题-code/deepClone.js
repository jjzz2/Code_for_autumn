// 深拷贝的实现
function deepClone(obj,hash=new WeakMap()){
    if (obj ===null)return obj
    if (obj instanceof Date)return new Date(obj)
    if(obj instanceof RegExp)return new RegExp(obj)
    if (typeof obj!=='object')return obj
    //判断是否是对象
    if (hash.get(obj))return hash.get(obj)
    let cloneObj=new obj.constructor()
    hash.set(obj,cloneObj)
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            cloneObj[key]=deepClone(obj[key],hash)
        }
    }
    return cloneObj
}
function ajax(url){
    return new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest()
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
function unique1(array){
    return [...new Set(array)]
}
function unique2(array){
    return array.filter((item,index)=>{
        return array.indexOf(item===index)
    })
}
function unique3(array){
    let res=[]
    array.forEach(item=>{
        if (res.indexOf(item)===-1){
            res.push(item)
        }
    })
    return res
}
//手写数组乱序
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        // 在 [0, i] 范围内随机取一个索引
        const j = Math.floor(Math.random() * (i + 1));

        // 交换 arr[i] 和 arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
