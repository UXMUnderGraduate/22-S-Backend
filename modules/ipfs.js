const ipfs = require("ipfs-http-client");

class IPFS {
  constructor() {
    this.init();
  }

  init() {
    try {
      const instance = ipfs.create("http://localhost:5001");
      this.node = instance;
    } catch (err) {
      console.error(err);
    }
  }

  getInstance() {
    return this.node;
  }
}

module.exports = new IPFS();
