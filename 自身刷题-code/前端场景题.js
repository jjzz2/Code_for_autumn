//1.限制输入频次:很简单的，使用debounce
//通过js来完成输入频次限制
const form=document.getElementById('form')
const submitButton=document.getElementById('Button')
form.addEventListener('submit',(event)=>{
    submitButton.disabled=true
    setTimeout(()=>{
        submitButton.disabled=false
    },5000)
})
//2.使用React设计一个表单系统
