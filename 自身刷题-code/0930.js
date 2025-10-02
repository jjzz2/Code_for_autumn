function myAjax(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.readyState === 200) {
                    resolve(JSON.stringify(xhr.responseText))
                } else {
                    reject('error')
                }
            }

        }
        xhr.send(null)
    })

}

function unique1(array) {
    return Array.from(new Set(array))
}

function unique2(array) {
    return [...new Set(array)]
}

function unique3(array) {
    return array.filter((item, index) => array.indexOf(item) === index)
}

function unique4(array) {
    let res = []
    array.forEach(item => {
        if (res.indexOf(item) === -1) {
            res.push(item)
        }
    })
    return res
}

//展开
function flat1(array) {
    return array.toString().split('').map(Number)
}

function flat2(array) {
    let array2 = []
    for (const item of array) {
        if (Array.isArray(item)) {
            array2 = array2.concat(flat2(item))
        } else {
            res.push(item)
        }
    }
    return res
}

//乱序
function randomSort(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//Promise
function MyPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        const res = []
        for (let i = 0; i < promises.length; i++) {
            promises[i].then((value) => {
                res[i] = value
                if (i === promises.length - 1) {
                    resolve(res)
                }
            }).catch(onerror => reject(onerror))
        }
    })
}

function race(promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then((value) => {
                resolve(value)
            }).catch(reject)
        }
    })
}

//并发控制
//因为是并发控制，所以不能使用for循环一瞬间就执行完所有的items.
// 必须使用递归的方式来对其进行遍历
function limits(items, asyncTask, maxCount) {
    return new Promise((resolve, reject) => {
        const res = []
        let running = 0
        let index = 0
        let finished = 0

        function dispatch() {
            while (running < maxCount && index < items.length) {
                running++
                const currentIndex = index;
                const currentItem = items[index];
                index++; // 现在再递增 index，为下一次 dispatch 做准备
                asyncTask(items[index]).then(value => {
                    res[currentIndex] = value
                }).catch(onerror => reject(onerror)).finally(() => {
                    running--
                    finished++
                    if (finished === items.length) {
                        resolve(res)
                        dispatch()
                    }
                })
            }
        }

        dispatch()
    })

}

//快排
function quickSort(array){
    //使用二分的方式去做
}
//数组转树

function arrToTree(array) {

}

