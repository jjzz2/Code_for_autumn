  function myFetch(maxCount=5){
    let queue=0
    let count=0
    function fetchRequest(url,options={},priority=0){
        return new Promise((resolve,reject)=>{
            insertByPriority({ priority, url, options, resolve, reject })
            run()
        })
    }
    function insertByPriority(request){
        let index = queue.findIndex(item => item.priority < request.priority)
        if (index === -1) {
            queue.push(request)
        } else {
            queue.splice(index, 0, request)
        }
    }
    function run() {
        if (count >= maxCount || queue.length === 0) return

        count++
        const { url, options, resolve, reject } = queue.shift()

        fetch(url, options)
            .then(resolve)
            .catch(reject)
            .finally(() => {
                count--
                run()
            })
    }
    return fetchRequest
}
//带优先级的fetch
function Fetch(){
    //还是一样的，一个queue和count来保证优先级

}
//event
class event{
    constructor(){
        //使用对象
        this.events={}
    }
    on(event,fn){
        let events=this.events
        if (!events[event]){
            events[event]=[]
        }
        events[event].push(fn)
    }
    off(event,fn){
        let events=this.events
        if (events[event]){
            events[event]=events[event].filter(item=>item!==fn)
        }
    }
    emit(event,...args){
        let events=this.events
        if (events[event]){
            for (let i=0;i<events[event].length;i++){
                events[event][i](...args)
            }
        }
    }
}
function myReduce(fn,initVal){
    let res=initVal
    let index=0

}