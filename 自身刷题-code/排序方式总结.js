//1.冒泡排序
function sortArray1(array){
    for (let i=0;i<array.length;i++){
        for (let j=0;j<array.length-1-i;j++){
            if (arr[j]>arr[j+1]){
                let tmp=arr[j+1]
                arr[j+1]=arr[j]
                arr[j]=tmp
            }
        }
    }
}
//2.选择排序，每次选择最小的数来插入最前面来完成
function selectSort(arr){
    let len=arr.length
    let minIndex;
    let tmp;
    for (let i=0;i<len-1;i++) {
        minIndex = i
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        tmp=arr[i]
        arr[i]=arr[minIndex]
        arr[minIndex]=tmp
    }
    return arr
}
