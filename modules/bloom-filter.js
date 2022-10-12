const fs = require("fs");
const { djb2, sdbm, loselose } = require("./hash");

class BloomFilter {
  constructor() {
    this.loadOrCreateFilter();
  }

  static hash(s, i) {
    switch (i) {
      case 0:
        return djb2(s) % 16n;
      case 1:
        return sdbm(s) % 16n;
      case 2:
        return loselose(s) % 16n;
    }
  }

  add(s) {
    for (let i = 0; i < 3; i++) {
      const h = BloomFilter.hash(s, i);
      this.array[h] = 1;
    }
  }

  has(s) {
    const o =
      this.array[BloomFilter.hash(s, 0)] &
      this.array[BloomFilter.hash(s, 1)] &
      this.array[BloomFilter.hash(s, 2)];
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
      fs.writeFileSync("./bloom.json", JSON.stringify(this.array));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = new BloomFilter();
