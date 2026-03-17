function first<T>(arr: T[]): T {
  //console.log(arr[0]);
  return arr[0];
}

first([1, 2, 3]); // Returns number
first(['a', 'b', 'c']); // Returns string

interface Repository<T> {
  findById(id: number): T | null;
  findAll(): T[];
  save(entity: T): T;
  delete(id: number): void;
}
//console.log(first([8, 5, 3, 1, 2, 4, 7, 6, 9]));

function stack<T>(items: T[]): Stack<T> {
  let stack: T[] = items;

  console.log(stack);
  return {
    push(item: T) {
      stack.push(item);
      return item;
    },
    pop() {
      return stack.pop();
    },
    peek() {
      return stack[stack.length - 1];
    },
    isEmpty() {
      return stack.length === 0;
    },
  };
}

interface Stack<T> {
  push(item: T): T | undefined;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
}

const numberStack = [1, 3, 4, 6, 9, 8, 7, 33, 12];
const myStack = stack(numberStack);

console.log(myStack.peek()); // last item
console.log(myStack.isEmpty()); // false
myStack.push(99);
console.log(myStack.peek()); // 99
console.log(myStack.pop()); // removes and returns 99
console.log(myStack.peek()); // back to previous last item
//console.log(stack([5]));
