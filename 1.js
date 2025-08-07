const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;
function change(a){
    //先做了3，要不然很麻烦
    let count=0
    for (let i  of a){
        if (i>='0'&&i<='9'){
            count++
        }
        if ((i>='A'&&i<='F')||(i>='a'&&i<='f')){
            count++
        }
        else{
            return false
        }
    }
    return true
}
const HEX_TO_RGB = (nums) => {
    //先对其进行分类
    let ans=[]
    nums=nums.slice(1)
    if (nums.length===3){
        for (let i of nums){
            if (i>='0'&&i<='9'){
                ans.push(i)
            }
            else{
                if ((i>='A'&&i<='F')||(i>='a'&&i<='f')){
                    if (i ==='A'||i ==='a'){
                        ans.push(170)
                    }
                    if (i ==='b'||i ==='B'){
                        ans.push(187)
                    }
                    if (i==='c'||i ==='C'){
                        ans.push(204)
                    }
                    if(i ==='d'||i ==='D'){
                        ans.push(221)
                    }
                    if (i ==='e'||i ==='E'){
                        ans.push(238)
                    }
                    if (i ==='f'||i ==='F'){
                        ans.push(255)
                    }
                }else{
                    return '非标准格式'
                }
            }
        }
        return `rgb(${ans[0]},${ans[1]},${ans[2]})`
    }
    if (nums.length===6){
        for (let i=0;i<nums.length;i++){
            if (nums[i]>='F'){
                if (nums[i]<='a'){
                    return '非标准格式'
                }

                if (nums[i]>='f'){
                    return '非标准格式'
                }
            }
        }
        let x=nums.slice(0,2)
        let y=nums.slice(0,2)
        let z=nums.slice(0,2)
        ans.push(x)
        ans.push(y)
        ans.push(z)
        for (let i of ans){
            if (change(i)){
                return '非标准格式'
            }
        }
        return `rgb(${ans[0]},${ans[1]},${ans[2]})`
    }
    // 在此写你的逻辑
    return `rgb(${ans[0]},${ans[1]},${ans[2]})`
}

void async function () {
    while(line = await readline()){
        let tokens = line.split(' ');
        console.log(HEX_TO_RGB(tokens[0]))
    }
}()