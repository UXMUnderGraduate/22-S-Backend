const fs = require("fs");

class BloomFilter {
  constructor() {
    this.loadOrCreateFilter();
  }

  static djb2(s) {
    let h = BigInt(5381);
    for (let i = 0; i < s.length; i++) {
      h = h * 33n + BigInt(s.charAt(i).charCodeAt());
    }
    return h;
  }

  static hash(n, i) {
    switch (i) {
      case 0:
        return (n / 3n) % 16n;
      case 1:
        return (n / 2n) % 16n;
      case 2:
        return (n / 7n) % 16n;
    }
  }

  add(s) {
    const n = BloomFilter.djb2(s);
    for (let i = 0; i < 3; i++) {
      const h = BloomFilter.hash(n, i);
      this.array[h] = 1;
    }
  }

  has(s) {
    const n = BloomFilter.djb2(s);
    const o =
      this.array[BloomFilter.hash(n, 0)] &
      this.array[BloomFilter.hash(n, 1)] &
      this.array[BloomFilter.hash(n, 2)];
    return Boolean(o);
  }

  loadOrCreateFilter() {
    try {
      const data = fs.readFileSync("./bloom.json");
      this.array = JSON.parse(data);
    } catch (err) {
      console.error(err);
      this.array = Array(16).fill(0);
    }
  }

  saveFilter() {
    try {
      fs.writeFileSync("./bloom.json");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = new BloomFilter();
