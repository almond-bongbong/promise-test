[![ko](https://img.shields.io/badge/lang-ko-green.svg)](https://github.com/almond-bongbong/promise-test/blob/master/README.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/almond-bongbong/promise-test/blob/master/README.en.md)

# Demystifying JavaScript Promises: They're Not Asynchronous Threads

Many developers starting with JavaScript often have misconceptions about what Promises are and how they work. One common misunderstanding is that Promises inherently make operations asynchronous or that they run in a separate thread. This article aims to clarify these misconceptions.

## Promises Do Not Create Asynchronous Tasks
Firstly, a `Promise` is a language construct that helps you manage asynchronous operations, but it doesn't make an operation asynchronous. Let's look at a piece of code:

```js
const sleep = (ms) => {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
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

  console.timeEnd('test'); // ???
}

start();
```
Can you guess how long the `start` function will take to run?

In this example, the `sleep` function is synchronous and blocks the event loop. Wrapping it in a `Promise` doesn't change that fact. So, when you run `Promise.all`, it still takes about 2 seconds to complete, because each `sleep` function is blocking the event loop for 1 second each, one after the other.


## How Non-Blocking Functions Work

JavaScript is a single-threaded language, and most non-blocking operations are managed by the event loop or the underlying system rather than by spinning up new threads. Functions like `setTimeout`, `fs.readFile`, and even browser APIs like fetch don't run on separate threads but are non-blocking because of how they're implemented at the system level or how they interact with the event loop.

### The Case of `fs.readFile`

In Node.js, the function `fs.readFile` appears to be non-blocking, but it doesn't actually run the JavaScript code on a separate thread. Instead, the I/O operation is offloaded to the operating system. Under the hood, Node.js uses a library called libuv, which employs a thread pool to perform these kinds of operations. Once the I/O operation is complete, a callback is placed in the event queue to be executed by the Node.js event loop. This makes `fs.readFile` non-blocking, but not because it runs your code on a separate thread.


## Conclusion

It's crucial to understand that Promises in JavaScript are a way to manage asynchronous behavior, rather than a way to create asynchronous behavior. Always remember that making a function return a `Promise` doesn't inherently make the function non-blocking or asynchronous.
