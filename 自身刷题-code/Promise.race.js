Promise.race=function (args){
    if(!Array.isArray(args)){
        console.error()
    }
    return new Promise((resolve,reject) =>{
        for(let i=0;i<args.length;i++){
            Promise.resolve(args[i]).then(resolve,reject)
        }
    })
}
//直接这样看其哪一个先出来即可。
//然后进行竞速即可。