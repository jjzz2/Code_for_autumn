//首先写构造函数
class MyPromise{
    constructor(callback){
        this.state='pending'
        this.value=null
        this.reason=null
        this.onResolvedCallbacks=[]
        this.onRejectedCallbacks=[]
        const resolve=(value)=>{
            if (this.state==='pending') {
                this.state = 'fulfilled'
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject=(reason)=>{
            if (this.state==='pending'){
                this.state='rejected'
                this.reason=reason
                this.onRejectedCallbacks.forEach(fn=>fn())
            }
        }
        try{
            callback(resolve,reject)
        } catch (e){
            reject(e)
        }

    }
    then(onFulfilled,onRejected){
        if (this.state==='fulfilled'){
            onFulfilled(this.value)
        }
        if (this.state==='rejected'){
            onRejected(this.reason)
        }
        //对于异步进行调用
        if (this.state==='pending'){
            this.onResolvedCallbacks.push(()=>{
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(()=>{
                onRejected(this.reason)
            })
        }
        //可用链式调用
        return new MyPromise((resolve,reject)=>{
            const resolveWrapper=(onFulfilled)=>{
                try {
                    const x=onFulfilled(this.value)
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            }
            const rejectWrapper=(onRejected)=>{
                try {
                    const x=onRejected(this.reason)
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            }
            if (this.state==='funfilled'){
                resolveWrapper(this.value)
            }
            if (this.state==='rejected'){
                rejectWrapper(this.reason)
            }
            if (this.state==='pending'){
                this.onResolvedCallbacks.push(resolveWrapper)
                this.onRejectedCallbacks.push(rejectWrapper)
            }
        })
    }
    catch(fn){
        return this.then(null,fn)
    }
}