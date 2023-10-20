const sleep = (ms) => {
  console.log('sleep');

  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}

  console.log('wake up');
};

const promiseSleep = (ms) => new Promise((resolve) => {
  sleep(ms);
  resolve();
});

const start = async () => {
  console.time('test');

  await Promise.all([
    promiseSleep(1000),
    promiseSleep(1000),
  ]);

  console.timeEnd('test');
}

// Try to run this code with `node index.js` command. or index.html
// await start();
