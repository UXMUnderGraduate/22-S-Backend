const ipfs = require("ipfs-core");

class IPFS {
  constructor() {
    this.init();
  }

  async init() {
    this.node = await ipfs.create();
  }

  getInstance() {
    return this.node;
  }
}

module.exports = new IPFS();
