function getUrlParams(url){
    const params=new URL(url).searchParams
    let object={}
    params.forEach((item,index)=>object[index]=item)
    return object
}

const url = 'https://example.com?name=john&age=30&city=New+York';
console.log(getUrlParams(url)); // 输出: { name: 'john', age: '30', city: 'New York' }

function MyPromiseAllSettled(promises){
    let res=[]
    let cnt=0
    return new Promise((resolve)=>{
        for (let i=0;i<promises.length;i++){
            Promise.resolve(promises[i]).then((value)=>{
                res[i]=value
            }).catch(reason => res[i]=reason).finally(()=>{
                cnt++
                if (cnt===promises.length){
                    resolve(res)
                }
            })
        }
    })
}
Array.prototype.myReduce=function (initVal,callback){
    let array=this
    let index=0
    let res=initVal
    if (typeof initVal==='undefined'){
        res = array[index]
        index++
    }
    while(index<array.length){
        res = callback(res, array[index],index,array)
        index++
    }
    return res
}
function quickSort(array){
    if (array.length<=1)return array
    let left=[]
    let right=[]
    let midIndex=Math.floor(array.length/2)
    let midIndexVal=array[midIndex]
    for (let i=0;i<array.length;i++){
        if (i!==midIndex){
            if (array[i]<=midIndexVal){
                left.push(array[i])
            }else{
                right.push(array[i])
            }
        }
    }
    return quickSort(left).concat([midIndexVal],quickSort(right))
}
console.log(quickSort([5, 2, 7, 1, 3]))
// Output: [1, 2, 3, 5, 7]
//串行执行promise
const tasks = [1, 2, 3]

tasks.reduce((prevPromise, item) => {
    return prevPromise.then(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('任务', item)
                resolve()
            }, 1000)
        })
    })
}, Promise.resolve())
async function runSerial(){
    const tasks=[1,2,3]
    for (const item of tasks){
        await new Promise(resolve => {
            setTimeout(()=>{
                console.log('res',item)
                resolve()
            },1000)
        })
    }
}
//1.原型链继承：使用子类的原型指向其的实例
//即：child.prototype=new Parent()

//2.构造函数继承：即：patent.call方法

//3.组合继承：将两个组合

//5.寄生组合