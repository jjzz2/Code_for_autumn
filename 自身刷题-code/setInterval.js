function mySetInterval(fn,interval){
    function repeat(){
        fn()
        //注意不要有箭头函数，估计与指向有关
        setTimeout(repeat,interval)
    }
    setTimeout(repeat,interval)
}
mySetInterval(() => {
    console.log('This runs every 1 second');
}, 1000);
function mySetInterval(fn,interval){
    function repeat(){
        fn()
        setTimeout(repeat,interval)
    }
    setTimeout(repeat,interval)


}