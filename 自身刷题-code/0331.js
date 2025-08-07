//1.手写new
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=Object.getPrototypeOf(constructor)
    let result=constructor.apply(newObj,args)
    return result instanceof Object?result:newObj
}
//2.手写Promise类别的所有函数
function myPromiseAll(arr){
    return new Promise((resolve, reject) => {
        let cnt=0
        let res=[]
        for (let i=0;i<arr.length;i++) {
            Promise.resolve(arr[i]).then(value => {
                res[i] = value
                cnt++
                if (cnt === arr.length) {
                    resolve(res)
                }
            }).catch(reject)
        }
    })
}
function myPromiseRace(arr){
    return new Promise((resolve,reject)=>{
        for (let i=0;i<arr.length;i++){
            Promise.resolve(arr[i]).then(value => {
                resolve(value)
            }).catch(reject)
        }
    })
}
function myAjax(url){
    return new Promise((resolve,reject)=>{
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
//限制最大并发
function limits(){

}
//myreduce
function myReduce(fn,initial){
        let result=initial
        let index=0
        if (typeof initial==='undefined'){
            result=this[index]
            index++
        }
        while(index<this.length){
            result=fn(result,this[index++])
        }
        return result
}
//myflat
function myFlat(array,depth){
    if (typeof array!=='object'||array===null){
        throw new Error('not a array')
    }


}