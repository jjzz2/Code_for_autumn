//1.数组转树
function arrToTree(arr){
    let map={}
    let res=[]
    for (let item of arr){
        //其不是复制其的对象，而是保存其的引用然后才能将结果反馈到result中去
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        let pid=arr[i].pid
        if (map[pid]){
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }
        else{
            res.push(arr[i])
        }

    }
    return res
}
// 测试用例：数组转树
const inputArray = [
    { id: 1, pid: 0, name: '节点1' },
    { id: 2, pid: 1, name: '节点2' },
    { id: 3, pid: 1, name: '节点3' },
    { id: 4, pid: 2, name: '节点4' },
    { id: 5, pid: 3, name: '节点5' },
    { id: 6, pid: 0, name: '节点6' },
];

const result = arrToTree(inputArray);
console.log(JSON.stringify(result, null, 2));
//2，限制最大并发
function limit(fetchList,n){
    return new Promise(resolve => {
        let count = 0
        let runningTasks = 0
        let res = []

        function run() {
            if (count === fetchList.length && runningTasks === 0) {
                resolve(res)
            }
            count++
            runningTasks++
            //注意这里还要套一层for循环
            while (count < fetchList.length && runningTasks < fetchList) {
                fetchList[count].then(value => {
                    res[count] = value
                    runningTasks--
                    //对其进行递归处理完成循环
                    run()
                })
            }
        }
        run()
    })
}
//实现事件总线
class Events{
    constructor(){
        this.events={}
    }
    on(event,callback){
        if (!this.events[event]){
            this.events[event]=[]
        }
        this.events[event].push(callback)
    }
    off(event,callback){
        if (!this.events[event]){
            return
        }
        this.events[event]=this.events[event].filter(item=>item!==callback)
    }
    emit(event,...args){
        if (this.events[event]){
            for (let i=0;i<this.events[event].length;i++){
                this.events[event][i](...args)
            }
        }
    }
}
//手写实现reduce
Array.prototype.myReduce=function (fn,initVal){
    let index=0
    let result=initVal
    if (typeof initVal==='undefined'){
        result=this[index]
        index++
    }
    while(index<this.length){
        result=fn(result,this[index++])
    }
    return result
}
//手写new
function myNew(fn,...args){
    let newObj={}
    newObj.__proto__=Object.getPrototypeOf(fn)
    let result=fn.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
//手写ajax，既然是请求那么就必须要获得请求路径url,这种异步的一般都要返回一个new Promise来操作
function ajax(url){
    return new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest()
            //规定method以及是否异步，先确定请求类型，然后再写其他的
        xhr.open('GET',url,true)
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