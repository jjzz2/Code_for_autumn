//1.手写ajax请求
function ajax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest()
        xhr.open('GET',url, true)
        xhr.onreadystatechange=function (){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    resolve(JSON.stringify(xhr.responseText))
                }
            }else{
                reject('error')
            }
        }
        xhr.send()
    })
}
//数组的各种方法
function filter(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        if (callback(array[i],i, array)){
            res.push(array[i])
        }
    }
    return res
}
function map(array,callback){
    let res=[]
    for (let i=0;i<array.length;i++){
        res.push(callback(array[i],i, this))
    }
    return res
}
function reduce(array,callback,initval){
    let res=initval
    let index=0
    if (typeof initval==='undefined'){
        res=array[index]
        index++
    }
    for (let i=index;i<array.length;i++){
        res.push(callback(array[i],i, this))
    }
    return res
}
//手写脚本中的jsonp
function jsonp(src){
        const script=document.createElement('script')
        script.src=src
        script.type = "text/javasctipt"
        // 将这个 <script> 标签插入到当前网页的 body 元素中，从而触发浏览器加载并执行指定的 JavaScript 文件。
        document.body.appendChild(script)
}
//手写数组乱序
//1.sort+Math.random()
function shuffle1(arr){
//     如果返回值小于 0，sort() 会把第一个元素排在前面。
// 如果返回值大于 0，sort() 会把第二个元素排在前面。
// 如果返回值等于 0，sort() 会认为这两个元素相等，不会改变它们的顺序
    return arr.sort(()=>Math.random()-0.5)
}
//每隔一秒输出1，2，3
const arr=[1,2,3]
arr.reduce((p,x)=>{
    return p.then(()=>{
        return new Promise(resolve => {
            setTimeout(()=>resolve(console.log(x)),1000)
        })
    })
},Promise.resolve())

//红绿灯交替重复亮
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
//亮灯的函数
const light=function (timer,callback){
    return new Promise(resolve => {
        setTimeout(()=>{
            callback()
            resolve()
        },timer)
    })
}
//每一步的函数
const step=function (){
    Promise.resolve().then(()=>{
        return light(3000,red)
    }).then(()=>{
        return light(2000,green)
    }).then(()=>{
        return light(1000,yellow)
    }).then(()=>{
        return step()
    })
}
//下划线转驼峰
function getKebCase(str){
    let array=str.split('')
    return array.map((item)=>{
        if (item.toUpperCase()===item){
            return'_'+item.toLowerCase()
        }else{
            return item
        }
    }).join('')
}
//带优先级的fetch
function myFetch(maxCount=5){
    let queue=0
    let count=0
    function fetchRequest(url,options={},priority=0){
        return new Promise((resolve,reject)=>{

        })
    }
    //insert和run是一样的

}