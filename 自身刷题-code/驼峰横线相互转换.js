function getKebCase(str){
    let arr=str.split('')
    return arr.map((item)=>{
        if (item.toUpperCase()===item){
            return'_'+item.toLowerCase()
        }else{
            return item
        }
    }).join('')
}
function strswitch(str){
    let parts=str.split('_')
    let res=""
    for (let part of parts){
        res+=(part[0].toUpperCase()+part.slice(1))
    }
    //由于slice是如此使用的，那么使用slice即可得到数据
    return (res[0].toLowerCase()+res.slice(1))
}
let testStr = "hello_world_example";
console.log(strswitch(testStr));  // 输出 "helloWorldExample"
