//手写Promise.all,那么需要的就是一个大数组和分别比对
function promiseAll(promises){
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(promises)){
            console.error('error')
        }
        let result=[]
        let count=0
        let nums=promises.length
        for(let i=0;i<nums;i++){
            Promise.resolve(promises[i]).then(value => {
                result[i]=value
                count++
                if(count===nums){
                    return resolve(result)
                }

            },err=>{
                return reject(err)
            })
        }
    })
}

let arr = [
    { id: 1, category: 'A', name: 'apple' },
    { id: 2, category: 'B', name: 'banana' },
    { id: 3, category: 'A', name: 'apricot' },
    { id: 4, category: 'C', name: 'cherry' },
    { id: 5, category: 'B', name: 'blueberry' }
];
let prop = 'category';
function groupByProperty(arr, prop) {
    // 返回分类后的结果
    let res={}
    for (let item of arr){
        if (item[prop]){
            res[item[prop]]=[]||res[item[prop]]
            res[item[prop]].push(item)
        }
    }
    return res
}
console.log(groupByProperty(arr, prop))


function sortIPsByFrequency(ips) {
    let countMap = {};

    // 1. 统计出现次数
    for (let ip of ips) {
        countMap[ip] = (countMap[ip] || 0) + 1;
    }

    // 2. 将唯一 IP 组成数组，并排序
    let result = Object.keys(countMap).sort((a, b) => {
        return countMap[b] - countMap[a]; // 按频率降序
    });

    return result;
}
//直接使用Object.keys进行遍历即可。