//1.防抖
//1.1 最基本写法
//注意：必须返回函数本身
function mydebounce(fn,delay){
    //1.创建一个变量
    let timer=null
    const _debounce=()=>{
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn()
            timer=null
        },delay)
    }
    return _debounce
}
//1.2对指针指向的优化
function mydebounce2(fn,delay){
    let timer=null
    const _debounce=()=>{
        if(timer) clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this)
            timer=null
        },delay)

    }
    return _debounce
}
//1.3优化参数
function mydebounce3(fn,delay){
    let timer=null
    const _debounce=(...args)=>{
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,args)
            timer=null
        },delay)
    }
    return _debounce
}
//1.1手写节流函数
function myThrottle(fn,interval){
    let startTime=0
    const _throttle=function (){
        const nowTime=new Date().getTime()
        const waitTime=interval-(nowTime-startTime)
        if (waitTime<= 0){
            fn()
            startTime=nowTime
        }
    }
    return _throttle
}
//1.2优化this指向和参数
function myThrottle(fn,interval){
    let startTime=0
    let _throttle=function (...args){
        const nowTime=new Date().getTime()
        const waitTime=interval-(nowTime-startTime)
        if (waitTime<= 0){
            fn.apply(this,args)
            startTime=waitTime
        }
    }
    return _throttle
}