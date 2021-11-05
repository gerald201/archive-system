const cypherKey = '686728963a9eb156952d382895c1cbedbb45c3f6ffda8d5d393ffe93d3004d883aef7a4d25627199bf3574660ba1e8a53e393029ba28ad55a27e0934220c9b1e';

export function decrypt(string) {
  return string.match(/.{1,2}/g)
    .map(function(a) {
      return parseInt(a, 16);
    })
    .map(function(a) {
      return cypherKey.split('')
        .map(function(b) {
          return b.charCodeAt(0);
        })
        .reduce(function(b, c) {
          return b ^ c;
        }, a);
    })
    .map(function(a) {
      return String.fromCharCode(a);
    })
    .join('');
}

export function encrypt(text) {
  return text.split('')
    .map(function(a) {
      return a.split('')
        .map(function(b) {
          return b.charCodeAt(0);
        })
    })
    .map(function(a) {
      return cypherKey.split('')
        .map(function(b) {
          return b.charCodeAt(0);
        })
        .reduce(function(b, c) {
          return b ^ c;
        }, a);
    })
    .map(function(a) {
      return ('0' + Number(a).toString(16)).substr(-2);
    })
    .join('');
}

export default {
  decrypt,
  encrypt
};
