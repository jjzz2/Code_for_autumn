class TaskScheduler{
    constructor(maxTasks=2) {
        this.running=0
        this.taskQueues=[]
        this.maxTasks=maxTasks
    }
    addTask(task){
        return new Promise((resolve)=>{
            this.taskQueues.push({task,resolve})
            this.schedule()
        })
    }
    schedule(){
        if(this.running>this.maxTasks||this.taskQueues.length===0){
            return
        }
        const {task,resolve}=this.taskQueues.shift()
        this.running++
        task.then(()=>{
            this.running--
            resolve()
            this.schedule()
        })
    }
}
//任务调度限制其的变量
//todo 以上为类的写法，不太好，以后改为以下写法：
//假设里面都是promise函数
function limitRunTasks(tasks,n,callback){
    return new Promise((resolve,reject)=>{
        let index=0
        let runningCount=0
        let res=[]
        function run() {
            if (runningCount === tasks.length) {
                resolve(callback(res))
                return
            }
            while (index < tasks.length && runningCount < n) {
                let curIndex = index
                index++
                runningCount++
                tasks[curIndex].then((val) => {
                    res[curIndex] = val
                    runningCount--
                    //递归调用来完成任务
                    run()
                }).catch(reject)
            }

        }
        run()
    })
}
function limitRunTasks(tasks,n,callback){
    return new Promise((resolve,reject)=>{
        let index=0
        let runningCount=0
        let res=[]
        function run(){
            if (runningCount===0&&index===tasks.length){
                resolve(callback(res))
                return
            }
            while(index<tasks.length&&runningCount<n){
                let curIndex=index
                index++
                runningCount++
                tasks[curIndex].then((val)=>{
                    res[curIndex]=val
                    runningCount--
                    run()
                }).catch(reject)
            }
        }
        run()
    })
}