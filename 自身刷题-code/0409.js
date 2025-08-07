//1.array.filter
function unique1(array){
    return [...new Set(array)]
}
function unique2(array){
    return array.filter((item,index)=>{
        return array.indexOf(item)===index
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
//重新写
function unique1(arr){
    return [...new Set(arr)]
}
function unique2(arr){
    let res=[]
    arr.forEach(item=>{
        if (res.indexOf(item)===-1){
            res.push(arr)
        }
    })
}
function unique3(arr){
    //使用array.from方法对其进行浅拷贝
    return Array.from(new Set(arr))
}
//扁平化
function flat1(array){
    //先转换为字符，在转换为数组
    return array.toString().split(',').map(item=>Number(item))
}
function flat2(array){
    //使用reduce
    return array.reduce((accu,cur)=>{
       if (Array.isArray(cur)){
           cur = flat2(cur)
           accu=accu.concat(cur)
       }else{
           accu.push(cur)
       }
       return accu
    },[])
}
function flat3(array){
    let res=[]
    for (let i=0;i<array.length;i++){
        if(Array.isArray(array[i])){
            res=res.concat(flat3(array[i]))
        }else{
            res.push(array[i])
        }
    }
    return res
}
//手写数组乱序
function random(array){
    return Math.random()
}
//对象扁平化
function flattenObject(obj,prefix=''){
    let res={}
    for (let key in Object){
        if(obj.hasOwnProperty(key)){
            const newKey=prefix?prefix+'.'+key:key
            if (typeof obj[key]==='object'&&obj[key]!==null){
                Object.assign(result,flattenObject(obj[key],newKey))
            }else{
                //注意这里是newKey
                res[newKey]=obj[key]
            }
        }
    }
    return res
}
//reduce,看自己实现加不加上arr，建议先加上arr来方便理解
function Reduce(arr,fn,initVal){
    let res=initVal
    let index=0
    if (typeof initVal==='undefined'){
        res=arr[index]
        index++
    }
    for (let i of arr){
        res=fn()
    }
}
//filter
function filter(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i])){
            res.push(array[i])
        }
    }
    return res
}
//map
function map(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i])){
            res.push(array[i])
        }
    }
    return res
}
//sleep函数
async function test(){
    console.log('开始')
    await sleep(4000)
    console.log(结束)
}
function sleep(wait){
    return new Promise(resolve => {
        setTimeout(resolve,wait*1000)
    })
}
//setTimeOut实现setInterval
function setInterval(fn,wait){
    //开启一个计时器
    function repeat(){
        //异步代码
        setTimeout(()=>{
          repeat()
        },wait)
        //同步执行部分
        fn()
    }
    setTimeout(repeat,wait)
}
//1.filter
function filter(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i],i, array)){
            res.push(arr[i])
        }
    }
    return res
}
function map(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        res.push(callback(array[i],i, array))
    }
    return res
}
//