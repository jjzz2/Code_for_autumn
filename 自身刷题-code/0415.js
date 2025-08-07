//1.含有索引深拷贝
function deepClone(obj,hash=new WeakMap()){
    if (obj===null||typeof obj!=='object')return obj
    let newObj=Array.isArray(obj)?[]:{}
    if (hash.get(obj))return hash.get(obj)
    hash.set(obj,newObj)
    for(let key in obj){
        if (obj.hasOwnProperty(key))newObj[key]=deepClone(obj[key])
    }
    return newObj
}
//2.下划线转驼峰
function s(str){
    let x=str.split('_')
    let ans=""
    let cnt=0
    for (let item of x){
        if (cnt!==0){
            let cur=item[0]+item.slice(1)
            ans+=cur
        }
        else{
            ans+=item
        }
    }
    return ans
}
//解析url
function searchURL(url){
    
}
//array to tree
function ArraytoTree(array){
    let map={}
    let res=[]
    for (let item of array){
        map[item.id]=item
    }
    for (let i=0;i<array.length;i++){
        let pid=array[i].pid
        if (!map[pid]||map[pid]===null){
            res.push(array[i])
        }else{
            map[pid].children={}||map[pid].children
            map[pid].children.push(array[i])
        }
    }
    return res
}
//limits
function limits(array,n,callback){
    return new Promise((resolve,reject)=>{
        let cnt=0
        let runningTasks=0
        let res=[]
        function run(){
            if (cnt===array.length&&runningTasks===0){
                resolve(callback(res))
            }
            for (let i=0;i<array.length;i++){
                cnt++
                runningTasks++
                if (runningTasks<=n){
                    Promise.resolve(array[i]).then((val)=>{
                        runningTasks--
                        res.push(val)
                        run()
                    }).catch(reject)
                }
            }
        }
        run()
    })
}
//将数组转换为对象
function change(array){
    let obj={}
    array.forEach((item,index)=>{
        obj[index]=item
    })
    return obj
}

function isEqual(a,b){
    function isEqual(a, b) {
        // 如果 a 和 b 都是原始类型（非对象类型）
        if (typeof a !== 'object' && typeof b !== 'object') {
            return a === b; // 直接比较值
        }

        // 如果 a 或 b 是 null 或者其中一个是非对象类型
        if ((a === null || b === null) || (typeof a !== 'object' || typeof b !== 'object')) {
            return false;
        }

        // 如果 a 和 b 是同一个对象引用，直接返回 true
        if (a === b) {
            return true;
        }

        // 获取对象的所有属性名
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        // 如果两个对象的属性数量不同，直接返回 false
        if (keysA.length !== keysB.length) {
            return false;
        }

        // 逐个比较属性值
        for (let key of keysA) {
            if (!keysB.includes(key) || !isEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }
}
//手写Promise
class Promise{
    constructor(){
        this.state='pending'
        this.onResolvedCallbacks=[]
        this.onRejectedCallbacks=[]
        this.reason=null
        this.value = null
        let resolve=()=>{

        }
        let reject=()=>{

        }
    }

}
//数组乱序
function randomSortArray2(arr) {
    let lenNum = arr.length - 1;
    for (let i = 0; i < lenNum; i++) {
        let index = parseInt(Math.random() * (lenNum + 1 - i));
        [arr[index], arr[lenNum - i]] = [arr[lenNum - i], arr[index]];
    }
    return arr;
}
function testRandomSort() {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = randomSortArray2([...original]);

    console.log('原始数组：', original);
    console.log('乱序后：  ', result);

    // 判断是否包含相同元素
    const isSameSet = original.slice().sort().toString() === result.slice().sort().toString();
    // 判断顺序是否改变
    const isOrderChanged = original.toString() !== result.toString();

    console.log('元素一致：', isSameSet);
    console.log('顺序改变：', isOrderChanged);
}
testRandomSort()