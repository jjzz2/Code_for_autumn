//1.手写new
function myNew(constructor,...args){
    let obj={}
    obj.__proto__=Object.getPrototypeOf(constructor)
    let result=constructor.apply(obj,...args)
    return result instanceof Object ?result:obj
}
//2.事件总线
class Events{
    //使用类
    constructor(){
        this.events={}
    }
    on(event,fn){
        if (!this.events[event]){
            //直接创建键值即可
            this.events[event]={}
        }
        else{
            this.events[event].push(fn)
        }
    }
    off(event,fn){
        if (!this.events[event]){
            return
        }
        this.events[event]=this.events[event].filter(item=>item!==fn)
    }
    emit(event,args){
        for(let i=0;i<this.events[event].length;i++){
            this.events[event][i](...args)
        }
    }
}
//手写call,apply,bind
function myCall(context,...args){
        context=context||window
        let fnSymbol=Symbol('fn')
        context[fnSymbol]=this
        context[fnSymbol](...args)
        delete context[fnSymbol]
}
//将数组转为树：
function arrToTree(arr){
    const map={}
    const result=[]
    for (let item of arr){
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        const pid=arr.pid
        if (map[pid]){
            //注意是子节点，因此应该是children
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }else{
            result.push(arr[i])
        }
    }
    return result
}
//限制最大并发
function limitRunTasks(run,num){
    return new Promise((resolve)=>{
        let running=0
        let res=[]
        //出发点
        let index=0
        function doit(){
            //其在函数体内进行返回
        if (index===run.length&&running===0){
            resolve(res)
            return
        }
        while(index<run.length&&running<num){
            let cur=index
            index++
            running++
            run[cur].then((val)=>{
                res[val]=val
                running--
                doit()
            })
        }
        }
        doit()
    })

}
//手写flat
function myFlat(array,dep){
    if (!Array.isArray(array)){
        return
    }
    let i=0
    let res=[]
    while(i<arr.length){
        if (Array.isArray(arr[i])&&dep>0){
            res = res.concat(myFlat(arr[i],dep-1))
        }else{
            res.push(arr[i])
        }
        i++
    }
    return res
}
//