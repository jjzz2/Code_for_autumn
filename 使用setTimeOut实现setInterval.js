function MySetInterval(fn,wait){
    function repeat() {
        setTimeout(() => {
            fn()
            repeat()
        }, wait)
    }
    repeat()
}
setInterval(()=>console.log('hello world'),1000)