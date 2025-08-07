const getUrlParams2 = (url) => {
    const u = new URL(url);
    const s = new URLSearchParams(u.search);
    const obj = {};
    s.forEach((v, k) => (obj[k] = v));
    return obj;
};
