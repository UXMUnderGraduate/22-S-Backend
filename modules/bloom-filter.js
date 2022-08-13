const fs = require("fs");
const { BloomFilter } = require("bloom-filters");

const loadOrCreateFilter = () => {
  let filter;
  try {
    const data = fs.readFileSync("./bloom.json");
    filter = BloomFilter.fromJSON(JSON.parse(data));
  } catch (err) {
    console.error(err);
    filter = new BloomFilter(16, 3);
  }

  return filter;
};

const saveFilter = (filter) => {
  try {
    const exported = filter.saveAsJSON();
    fs.writeFileSync("./bloom.json", JSON.stringify(exported));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = class ClassicBloomFilter {
  constructor() {
    this.filter = loadOrCreateFilter();
  }

  add(word) {
    this.filter.add(word);
    return saveFilter(this.filter);
  }

  has(word) {
    return this.filter.has(word);
  }
};
