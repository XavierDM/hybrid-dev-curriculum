function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    count,
    reset: () => {
      count = start;
    },
  };
}

const counter = makeCounter(0);
console.log(counter.value()); // 0
counter.increment();
counter.increment();
console.log(counter.value()); // 2
counter.decrement();
console.log(counter.value()); // 1
counter.reset();
console.log(counter.value()); // 0
