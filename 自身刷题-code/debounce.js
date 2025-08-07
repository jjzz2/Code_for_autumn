function debounce(fn, wait) {
    let timer
    const debounced = function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }

    // 添加一个方法查看 timer 的值
    debounced.getTimer = () => timer

    return debounced
}

function c() {
    console.log(1)
}

let debouncedC = debounce(c, 1000)
debouncedC()
console.log(debouncedC.getTimer()) // 会打印出 setTimeout 的定时器 ID
