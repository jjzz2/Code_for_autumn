function sleep(fn,wait){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            //这样就行，执行完函数整体即可。
            resolve(fn)
        },wait)

    })
}
