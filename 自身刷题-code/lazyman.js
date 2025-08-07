function Lazyman(name){
    this.queue=[]
    this.name=name
    //1.初始化
    this.queue.push(()=>{
        return new Promise((resolve)=>{
            console.log(this.name)
            resolve()
        })
    })
    //1.rest
    this.rest=function (time){
        //将每一个函数都当作一个任务队列来输入输出
        this.queue.push(()=>{
            return new Promise(resolve => {
                //注意函数引用和函数调用的区别。
                setTimeout(resolve,time*1000)
            })
        })

    }
    //2.restFirst
    this.restFirst=function (time){
        this.queue.unshift(()=>{
            return new Promise(resolve => {
                setTimeout(resolve,time*1000)
            })
        })
    }
    //3.study
    this.study=function (name){
        this.queue.push(()=>{
            return new Promise(resolve =>{
                console.log('study')
                resolve()
            })
        })
    }
    //使用递归启动
    this.run=function (run){
        const tasks=this.queue.shift()
        tasks.then(()=>{
            this.run()
        })
    }
    setTimeout(this.run.bind(this))
    return this
}