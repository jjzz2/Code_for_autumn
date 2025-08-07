let sleep=function (time,i){
    return new Promise(function (resolve,reject){
        setTimeout(function (){
            resolve(i)
        },time)
    })
}
let start=async function(){
    for (let i=1;i<=3;i++){
        let result=await sleep(1000,i)
        console.log(result)
    }
}
start()