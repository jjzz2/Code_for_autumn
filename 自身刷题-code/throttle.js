function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if(now-pre>=delay){
            fn.apply(this,args)
            pre=now
        }
    }
}