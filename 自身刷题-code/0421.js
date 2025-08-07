//1.手写深拷贝，含hash
function deepClone(obj,hash=new WeakMap){
    if (hash.get(obj))return hash.get(obj)
    let newObj=Array.isArray(obj)?[]:{}
    hash.set(obj,newObj)
    for (let key in obj){
        if (obj.hasOwnProperty(obj[key])){
            newObj[key]=deepClone(obj[key])
        }else{
            newObj[key]=obj[key]
        }
    }
    return newObj
}
//手写ajax
function myAjax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest()
        xhr.open('GET',url,true)
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
//手写jsonp
function myJsonp(src){
    let script=document.createElement('script')
    script.type=''
    script.src=src
    document.body.appendChild(script)
}
//解析url对象
function searchURL(url){
    const parts=window.searchURL(url)

}
//类型判断函数
function myTypeof(obj){
    return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
}
function myTypeOf(obj){
    return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
}
//手写继承
//1.原型链继承
function Parent(){
    this.name='Parent'
}
Parent.prototype.sayHello=function (){
    console.log('hello')
}
function Child1(name){
    this.name=name
}
Child1.prototype=new Child1
//忍不住了，写一会儿手写题
//并发控制
function limits(fetchLists,callback,limits){
    return new Promise((resolve,reject)=>{
        let runningTasks=0
        let cnt=0
        let res=[]
        function run(){
            if (cnt===fetchLists.length&&runningTasks===0){
                resolve(callback(res))
            }
            let index=cnt
            cnt++
            runningTasks++
            if (runningTasks<=limits) {
                Promise.resolve(fetchLists[index]).then((val) => {
                    res[index] = val
                    runningTasks--
                    run()
                })
            }
        }
        run()
    })
}
//手写
function filter(array){
    let ans={}
    for (let item of array){
        if (ans[item])ans[item]++
        else{
            ans[item]=1
        }
    }
    let array2=[]
    for (let key in ans){
        array2.push([key, ans[key]])
    }
    array2=array2.sort((a,b)=>a[1]-b[1])
    let array3=[]
    for (let item of array2){
        array3.push(item[0])
    }
    return array3
}
function uploadWithConcurrencyLimit(files, limit) {
    let executing = 0; // 当前正在执行的任务数
    const results = []; // 存储上传结果
    let index = 0; // 当前处理的文件索引

    return new Promise((resolve, reject) => {
        function executeNext() {
            if (index >= files.length && executing === 0) {
                resolve(results); // 所有任务完成
                return;
            }

            while (executing < limit && index < files.length) {
                executing++;
                const file = files[index++];
                uploadFile(file).then((result) => {
                    results.push(result);
                    executing--;
                    executeNext(); // 继续执行下一个任务
                }).catch(reject); // 如果某个任务失败则终止所有任务
            }
        }

        executeNext();
    });
}
//arrTotree
function arrToTree(array){
    let map={}
    let res=[]
    for (let item of array){
        map[item.id]=item
    }
    for(let i=0;i<array.length;i++){
        let pid=array[i].pid
        if (map[pid]){
            map[pid].children=[]||map[pid].children
            map[pid].children.push(array[i])
        }else{
            res.push(array[i])
        }

    }
    return res
}
//sum
function sum(...args1){
    return function addMore(...args2){
        args1=args1.concat(args2)
        return args1.reduce((accu,cur)=>accu+cur, 0)
    }
    addMore()
}