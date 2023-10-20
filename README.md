[![ko](https://img.shields.io/badge/lang-ko-green.svg)](https://github.com/almond-bongbong/promise-test/blob/master/README.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/almond-bongbong/promise-test/blob/master/README.en.md)

# 자바스크립트 프로미스에 대한 오해: 비동기 스레드가 아닙니다.

자바스크립트를 처음 시작하는 많은 개발자는 프로미스가 무엇이고 어떻게 작동하는지에 대해 오해하는 경우가 많습니다. 한 가지 일반적인 오해는 프로미스가 본질적으로 연산을 비동기적으로 만들거나 별도의 스레드에서 실행된다는 것입니다. 이 글은 이러한 오해를 바로잡는 것을 목표로 합니다.

## Promise는 비동기 작업을 생성하지 않습니다.

`Promise`는 비동기 연산을 관리하는 데 도움이 되는 언어 구조이지만 연산을 비동기적으로 만들지는 않습니다. 코드 하나를 살펴보겠습니다:

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
`start` 함수가 몇 초가 걸릴지 예상이 되시나요?

이 예제에서 `sleep` 함수는 동기식이며 이벤트 루프를 차단합니다. `Promise`로 감싸도 이 사실은 변하지 않습니다. 따라서 `Promise.all`을 실행해도 각 sleep 함수가 차례로 1초씩 이벤트 루프를 차단하기 때문에 완료하는 데 약 2초가 걸립니다.


## Non-Blocking 함수가 작동하는 방식

자바스크립트는 단일 스레드 언어이며, 대부분의 Non-Blocking 작업은 새 스레드를 생성하지 않고 이벤트 루프 또는 기본 시스템에서 관리합니다. `setTimeout`, `fs.readFile`과 같은 함수는 물론 `fetch`와 같은 브라우저 API도 별도의 스레드에서 실행되지 않지만 시스템 수준에서 구현되는 방식이나 이벤트 루프와 상호 작용하는 방식 때문에 Non-Blocking 이 됩니다.


### `fs.readFile`의 경우

Node.js에서 `fs.readFile` 함수는 Non-Blocking 으로 보이지만, 실제로는 **JavaScript 코드**를 별도의 스레드에서 실행하지 않습니다. 대신 I/O 작업은 운영 체제에게 위임됩니다. 내부적으로 Node.js는 libuv라는 라이브러리를 사용하여 이러한 종류의 작업을 수행합니다. 이 라이브러리는 스레드 풀을 사용합니다. I/O 작업이 완료되면, 콜백이 이벤트 큐에 위치하게 되고 이후에 Node.js의 이벤트 루프에 의해 실행됩니다.

I/O 작업이 메인 자바스크립트 스레드에서 발생하지 않는 것은 사실이지만, `fs.readFile`이 별도의 스레드에서 자바스크립트 코드를 실행한다고 말하는 것도 정확하지 않습니다.


## 결론

자바스크립트에서 `Promise`는 비동기 작업을 생성하는 방법이 아니라 비동기 작업을 관리하는 방법이라는 점을 이해하는 것이 중요합니다. 함수가 프로미스를 반환하도록 만든다고 해서 본질적으로 Non-Blocking 또는 비동기 함수가 되는 것은 아니라는 점을 항상 기억하세요.


