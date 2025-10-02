//limit
function limits(request,maxCount,items){
    return new Promise((resolve,reject)=>{
        let running=0
        let finished=0
        const result=[]
        let index=0
        function dispatch(){
            while(index<items.length&&running<maxCount){
                running++
                let currentIndex=index
                index++
                items[currentIndex].then(value => {
                    result[currentIndex]=value
                    dispatch()
                }).catch(onerror=>{
                    reject(onerror)
                }).finally(()=>{
                    finished++
                    running--
                    if (finished===currentIndex){
                        resolve(result)
                    }
                })
            }
        }
        dispatch()
    })
}
//quickSort
