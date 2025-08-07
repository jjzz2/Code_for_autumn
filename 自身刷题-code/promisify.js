//将一个普通函数转换为promise类型
function promisify(fn){
    return function (...args){
        return new Promise((resolve,reject)=>{
            fn(...args,(err,res)=>{
                if (err){
                    reject(err)
                }else{
                    resolve(res)
                }
            })

        })
    }
}