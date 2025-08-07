//手写useState
const useState=(props)=>{
    let obj=props
    function setObj(newObj){
        obj=newObj
    }
    return [obj,setObj]
}
//手写reduce
function myReduceof(array,initVal,fn){
    let res=initVal
    let index=0
    if (typeof initVal==='undefined'){
        res = array[index]
        index++
    }
    while(index<array.length){
        res = fn(res,array[index++],index++,array)
    }
    return res
}
//手写filter
function myFilter(array,fn){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (fn(array[i],i, array)){
            res.push(array[i])
        }

    }
    return result
}
function myMap(array,fn){
    let res=[]
    for (let i=0;i<array.length;i++){
        res.push(fn(res[i],i, array))
    }
    return res
}
function mySleep(times,i){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(i)
        },times)
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
    return function(...args2){
        args=args.concat(...args2)
        context[fnSymbol](...args)
        delete context[fnSymbol]
    }
}
//数组去重
function filter1(array){
    return [...new Set()]
}
function filter2(array){
    //找到其的值确实是首次出现的，那么就对其进行保留
    return array.filter((item,index)=>array.indexOf(item)===index)
}
function filter3(array){
    res = array.reduce((acc,cur)=>{
        if(!acc.includes(cur)){
            acc.push(cur)
        }
        return acc
    })
    return res
}
//数组乱序
function random(arr){
    return arr.sort(()=>Math.random()-0.5)
}
//lazyman
function Lazyman(){}
//快速排序
function quickSort(arr){
    let left=[]
    let right=[]

}
//解析url
function parseURL(url){
    let parts=searchParam(url)

}
//横线转驼峰
function parse(string){
    let x=string.split('_')
    let res=""
    let cnt=0
    for (let part of s){
        if (cnt!==0) {
            res += part[0].toUpperCase()
            res += part.slice(1, -1)
        }else{
            res+=part
        }
        cnt++
    }
    return res

}
//收写reduce
function myReduce(initval,array,fn){
    let res=initval
    let index=0
    if (typeof initval==='undefined'){
        res=array[index++]
    }
    while(index<array.length){
        index++
        res = fn(res, array[index],index,array)
    }
    return res
}
let Object= {
    "id": 1,
    "name": "A",
    "children": [
    {
        "id": 2,
        "name": "B",
        "children": [
            {
                "id": 4,
                "name": "D",
                "children": []
            },
            {
                "id": 5,
                "name": "E",
                "children": []
            }
        ]
    },
    {
        "id": 3,
        "name": "C",
        "children": [
            {
                "id": 6,
                "name": "F",
                "children": []
            }
        ]
    }
]
}
const getURL=(url)=>{
    const parseURL=new URL(url)
    const x=new URLSearchParams(url.search)
    const s={}
    x.forEach((item,index)=>s[index]=item)
    return s
}
//手写sumOf
function mySumof(...args){
    const store=[...args]
    const chainable=(...newArgs)=>{
        store.push(...newArgs)
        return chainable
    }
    chainable.sumOf=function (){
       return store.reduce((accu,cur)=>accu+cur,0)
    }
    return chainable
}
console.log(mySumof(1)(2)(3).sumOf()); // 输出: 6
console.log(mySumof(1, 2)(3).sumOf()); // 输出: 6
console.log(mySumof(10).sumOf()); // 输出: 10

function limits(array,limit,callback){
    return new Promise((resolve,reject)=>{
        let cnt=0
        let runningTasks=0
        let res=[]
        function run(){
            if (cnt===array.length-1&&runningTasks===0){
                resolve(callback(res))
            }
            while(runningTasks<=limit){
                let index=cnt
                cnt++
                runningTasks++
                Promise.resolve(array[index]).then((value)=>{
                    res[index]=value
                    runningTasks--
                    run()
                }).catch(reject)
            }
        }
        run()
    })
}
//如果是图片的话直接返回fetch就可以了
function myAjax(url){
    return new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest()
        xhr.open(url,'GET',true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }
            }
        }
        xhr.send()
    })
}
function myFetch(url){
    return new Promise((resolve,reject)=>{

    })
}
//PromiseRetry
function myPromiseRetry(promise,cnt){
    return new Promise((resolve,reject)=>{
        Promise.resolve(promise).then(value => {
            resolve(value)
            }
        ).catch(err=>
            {if(cnt>0){
                myPromiseRetry(promise,cnt-1).then(resolve).catch(reject)
            }else {
                reject(err)
            }
        }
        )
    })
}
//字母异位词分组
function groupAnagrams(strs) {
    const anagrams = {};

    for (let word of strs) {
        // 将每个字符串排序
        const sortedWord = word.split('').sort().join('');

        // 如果排序后的字符串还没有在对象中，则创建一个空数组
        if (!anagrams[sortedWord]) {
            anagrams[sortedWord] = [];
        }

        // 将当前原始字符串添加到对应的组中
        anagrams[sortedWord].push(word);
    }

    // 返回所有的字母异位词组
    return Object.values(anagrams);
}
