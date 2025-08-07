Promise.myAll=function (promiseArr){
    return new Promise((resolve,reject)=>{
        if (!Array.isArray(promiseArr)){
            throw new Error('arr should be array')
        }
        let count=0
        let promiseArrLength=promiseArr.length
        let resolved=[]
        for (let i=0;i<promiseArrLength;i++){
            Promise.resolve(promiseArr[i]).then(res=>{
                resolved[i]=res
                ++count
                if (count===promiseArrLength){
                    resolve(resolved)
                }
            },(rej)=>{
                reject(rej)
            })
        }
    })
}
Promise.myRace=function (promiseArr){
    return new Promise((resolve,reject)=>{
        if (!Array.isArray(promiseArr)){
            throw new Error('sss')
        }
        promiseArr.forEach(promise=>{
            Promise.resolve(promise).then(resolve,reject)
        })
    })
}
//如果是race方法的话那么就不需要有第一遍的储存遍历了。

const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Promise 1 resolved'), 1000);
});

const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => reject('Promise 2 rejected'), 500);  // 这个会被拒绝
});

const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Promise 3 resolved'), 1500);
});

Promise.myAll([promise1, promise2, promise3])
    .then(results => {
        console.log('All promises resolved:', results);
    })
    .catch(error => {
        console.error('One of the promises rejected:', error);  // Promise 2 rejected
    });
