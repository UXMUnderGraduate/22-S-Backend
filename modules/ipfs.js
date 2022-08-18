const ipfs = require("ipfs-core");

class IPFS {
  init() {
    return new Promise((resolve, reject) => {
      ipfs
        .create()
        .then((instance) => {
          this.node = instance;
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  getInstance() {
    return this.node;
  }
}

module.exports = new IPFS();
