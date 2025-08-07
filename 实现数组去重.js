//1.使用set
function uniqueArray(arr) {
   return [...new Set(arr)]
}
//2.使用filter
function uniqueArray2(arr) {
    return arr.filter(((item,index) => arr.indexOf(item) ===index))
}
//3.使用reduce
//reduce中的第一个参数依据第二个的[]的类型来决定
function uniqueArray3(arr){
    return arr.reduce((accu,cur)=>{
        if (!accu.includes(cur)){
            accu.push(cur)
        }
        return accu
    },[])
}
function uniqueArray4(arr){
    return arr.reduce((accu,cur)=>{
        if (!accu.includes(cur)){
            accu.push(cur)
        }
        return accu
    },[])
}
