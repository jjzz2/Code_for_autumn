//1.instanceof
function myInstanceof(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(proto){

    }
}
//2.new
function New(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    let res=constructor.apply(newObj,args)
    return res instanceof Object?res:newObj
}
//3.带循环引用的深拷贝
function deepClone(obj,hash=new WeakMap()){
    if (!obj||typeof obj!=='object')return obj
    //如果存在那么就直接返回，避免循环
    if (hash.get(obj))return hash.get(obj)
    let cloneObj=Array.isArray(obj)?[]:{}
    hash.set(obj,cloneObj)
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            cloneObj[key]=deepClone(obj[key],hash)
        }
    }
    return cloneObj
}
//数组去重
function unique1(array){
    return [...new Set(array)]
}
//应该要相等才对
function unique2(array){
    return array.filter((item,index)=>array.indexOf(item)===index)
}
//使用array.from
function unique3(array){
    return Array.from(new Set(array))
}
//数组扁平
function flatArr1(array){
    return array.toString().split('').map(item=>Number(item))
}
//递归时使用concat,或者reduce都可以
function flatArr2(array){
    return array.reduce((preValue,curItem)=>{
        return preValue.concat(Array.isArray(curItem)?flatArr2(curItem):curItem)
    })
}
//数组乱序
function shuffle1(arr){
    return arr.sort(()=>Math.random()-0.5)
}
function myPromiseAll(arr){
    return new Promise((resolve,reject)=>{
        for (let i=0;i<arr.length;i++){
            Promise.resolve(arr[i]).then((value)=>{
                resolve(value)
            }).catch(reject)
        }
    })
}
//动态加载jsonp
function jsonp(url){
    const script=document.createElement('script')
    script.src=url
    document.body.appendChild(script)
}
//柯里化函数
function curry(fn){
    return function curried(...args){
        if (fn.length<=args.length){
            //return 来完成一个递归调用,代表这返回fn计算的结果
            return fn.apply(this,...args)
        }else{
            return function (...args2){
                return curried.apply(this,args.concat(...args2))
            }
        }
    }
}
//大数相加
function BigInt(nums1,nums2){
    let maxLength=Math.max(nums1.length,nums2.length)
    //这里都转换为字符串了
    nums1=nums1.padStart(maxLength,'0')
    nums2 = nums2.padStart(maxLength,'0')
    let ans=0
    let carry=0
    for (let i=0;i<maxLength;i++){
        sum = parseInt(nums1[i])+parseInt(nums2[i])+carry
        carry=Math.floor(sum/10)
        ans = (sum%10)+carry
    }
    //检测carry
    if (carry===1){
        ans = '1'+ans
    }
    return ans
}
//下划线转驼峰
function strswitch(str){
    let parts=str.split('_')
    let res=""
    for (let part of parts){
        res+=(part[0].toUpperCase()+part.slice(1))
    }
    return (res[0].toLowerCase()+res.slice(1))
}
//arrToTree
function arrToTree(arr){
    let map={}
    let res=[]
    for (let item of arr){
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        let pid=arr[i].pid
        if (map[pid]){
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }else{
            res.push(arr[i])
        }
    }
    return res
}
let arr = [
    { id: 1, pid: null, name: "root" },
    { id: 2, pid: 1, name: "child1" },
    { id: 3, pid: 1, name: "child2" },
    { id: 4, pid: 2, name: "child1.1" },
    { id: 5, pid: 3, name: "child2.1" }
];

let result = arrToTree(arr);
console.log(JSON.stringify(result, null, 2));
//继承方式处理
//1.原型链继承
function parent(){
    this.name='Parent'
}
Parent.prototype.sayHello=function (){
    console.log('hello')
}
function Child1(){
    this.name='Child1'
}
//原型链直接使用prototype来进行继承即可。
Child1.prototype=new Parent()
Child1.prototype.constructor=Child1
const childInstance1=new Child1()
//2.构造函数继承
function child2(){

}