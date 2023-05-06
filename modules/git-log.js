const { exec } = require("child_process");

module.exports = {
  getLast: (pwd) => {
    return new Promise((resolve, reject) => {
      exec(
        `git --git-dir="${pwd}/.git" log -1 --pretty=format:"%h - %s"`,
        (error, stdout) => {
          if (error) {
            reject(new Error(error.message));
            return;
          }
          resolve(stdout);
        }
      );
    });
  },
};
