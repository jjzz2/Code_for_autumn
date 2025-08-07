function addBigNumbers(num1, num2) {
    // 反转字符串以便从低位对齐计算
    const n1 = num1.split('').reverse();
    const n2 = num2.split('').reverse();
    const maxLength = Math.max(n1.length, n2.length);
    let carry = 0, result = [];

    for (let i = 0; i < maxLength; i++) {
        // 逐位相加并处理进位
        const digit1 = n1[i] ? parseInt(n1[i]) : 0;
        const digit2 = n2[i] ? parseInt(n2[i]) : 0;
        const sum = digit1 + digit2 + carry;
        carry = Math.floor(sum / 10);
        result.push(sum % 10);
    }

    if (carry > 0) result.push(carry); // 处理最高位进位
    return result.reverse().join('');
}
console.log(addBigNumbers("123", "456"));  // "579"
