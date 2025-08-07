//1.解析url
// "https://www.example.com/page?name=Tom&age=25&city=Beijing"
function parseURL(url) {
    const result = {};
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1) return result; // 没有参数直接返回空对象

    const queryStr = url.slice(queryIndex + 1); // 获取参数部分
    const pairs = queryStr.split('&'); // 拆成每个 key=value

    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        result[key] = decodeURIComponent(value || ''); // 防止 value 是 undefined
    }

    return result;
}
function parseURL(url){
    const result={}
    const queryIndex=url.indexOf('?')
    if (queryIndex===-1)return result
    const queryStr=url.slice(queryIndex+1)
    const pairs=queryStr.split('&')
    for (const pair of pairs){
        //对其进行解构
        const [key,value]=pair.split('=')
        result[key]=decodeURIComponent(value||'');
    }
    return result
}
