const statsUtil = require('./src/index.js');

// simulates CPU processing
function keepCpuBussy() {
  setInterval(() => {
    const now = Date.now()
    while (Date.now() < now + 100);
  }, 20);
}

function prettyPrint(data) {
  for (const key in data) {
    console.log(
      `#################### ${key.toUpperCase()} ####################`
    );
    console.log(data[key], "\n");
  }
}

console.time();
statsUtil.getStats(1000)
  .then((data) => {
    prettyPrint(data);
    console.timeEnd();
  })
  .catch((error) => console.error(error));
