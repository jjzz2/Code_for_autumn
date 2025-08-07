//字母异位词分组
function groupAnagrams(strs) {
    const anagrams = {};

    for (let word of strs) {
        // 将每个字符串排序
        const sortedWord = word.split('').sort().join('');

        // 如果排序后的字符串还没有在对象中，则创建一个空数组
        if (!anagrams[sortedWord]) {
            anagrams[sortedWord] = [];
        }

        // 将当前原始字符串添加到对应的组中
        anagrams[sortedWord].push(word);
    }

    // 返回所有的字母异位词组
    return Object.values(anagrams);
}
