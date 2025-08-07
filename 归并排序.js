function mergeSort(arr){
    let len=arr.length
    if (len<2)return arr
    let mid=Math.floor(len/2)
    let left=arr.slice(0,mid)
    let right=arr.slice(mid)
    return mergeSort(mergeSort(left),mergeSort(right))
}
function merge(left,right){
    let result=[]
    while(left.length>0&&right.length>0) {
        if (left[0]<= right[0]){
            right.push(left.shift())
        }else{
            result.push(right.shift())
        }

    }
    while(left.length)result.push(left.shift())
    while(right.length)result.push(right.shift())
    return result
}