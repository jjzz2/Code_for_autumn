function debounce(fn,delay){
    let timer
    return function (...args) {
        if (timer)clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(this,args)
        },delay)
    }
}
function throttle(fn,delay){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=delay){
            fn.apply(this,args)
        }
        pre = now
    }
}
class LRU