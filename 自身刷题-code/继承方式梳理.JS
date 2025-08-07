//1.原型链继承
function Parent(){
    this.name='Parent'
}
Parent.prototype.sayHello=function (){
    console.log('hello')
}
function Child1(){
    this.name='Child1'
}
Child1.prototype=new Parent()
//这里是修复constructor对象；
Child1.prototype.constructor=Child1
const childInstance1=new Child1()
childInstance1.sayHello()

//2.构造函数继承
function Parent1(){
    this.name='Parent'
}
Parent1.prototype.sayHello=function () {
    console.log('hello')
}
function Child2(){
    //通过call方法调用其构造函数
    Parent.call(this)
    this.name='Child2'
}
const childInstance2 = new Child2();
console.log(childInstance2.name); // 输出 'Child2'


//3.组合继承
function Child3(){
    Parent.call(this)
    this.name='Child3'
}
Child3.prototype=new Parent()
Child3.prototype.constructor=Child3


//4.寄生继承
class Parent2 {
    constructor() {
        this.name = 'Parent';
    }

    sayHello() {
        console.log('hello from Parent');
    }
}
//通过一个辅助函数进行创
function createChild(){
    //创建一个新的实例对象即可。
    const child=new Parent()
    child.name='xxx'
    return child
}
//url参数解析
function urlParamsToObject(url) {
    const params=new URLSearchParams(url)
    let paramObjs={}
    for (let [key,value] of params){
        paramObjs[key]=decodeURIComponent(value)
    }
    return paramObjs
}

// 使用示例
const url = new URL('https://example.com/?name=binjie09&age=25&gender=male');
const paramsObj = urlParamsToObject(url);
console.log(paramsObj);
//手写函数中的方法
function forEach(arr,callback){
    for (let i=0;i<arr.length;i++){
        callback(arr[i],i, arr)
    }
}
//每隔一秒输出一二三
function sleep(time,i){
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(i)
        },time)
    })
}
//循环打印灯
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
function task(timer,light){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if (light==='red'){
                red()
                resolve()
            }else if (light==='green'){
                green()
                resolve()
            }else if (light==='yellow'){
                yellow()
                resolve()
            }
        },timer)
    })
}
//然后在一个taskRunner任务中进行并行执行.
const taskRunner =  async () => {
    await task(3000, 'red')
    await task(2000, 'green')
    await task(2100, 'yellow')
    taskRunner()
}
taskRunner()
//实现如此日期格式化
const dateFormat = (dateInput, format)=>{
    let day = dateInput.getDate()
    let month = dateInput.getMonth() + 1
    let year = dateInput.getFullYear()
    format = format.replace(/yyyy/, year)
    format = format.replace(/MM/,month)
    format = format.replace(/dd/,day)
    return format
}
//reduce方法
function myReduce(fn,initVal,array){
    let index=0
    let res=initVal
    if (typeof initVal==='undefined'){
        res=fn(array[index],index, array)
    }
    res[index++]=fn(res,array[index],index,array)
    return res
}