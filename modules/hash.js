// The following algorithms are the implementations of djb2, sdbm, and lose lose.
// http://www.cse.yorku.ca/~oz/hash.html

module.exports.djb2 = (s) => {
  let h = BigInt(5381);
  for (let i = 0; i < s.length; i++) {
    h = (h << 5n) + h + BigInt(s.charAt(i).charCodeAt());
  }
  return h;
};

module.exports.sdbm = (s) => {
  let h = BigInt(0);
  for (let i = 0; i < s.length; i++) {
    h = BigInt(s.charAt(i).charCodeAt()) + (h << 6n) + (h << 16n) - h;
  }
  return h;
};

module.exports.loselose = (s) => {
  let h = BigInt(0);
  for (let i = 0; i < s.length; i++) {
    h += BigInt(s.charAt(i).charCodeAt());
  }
  return h;
};
