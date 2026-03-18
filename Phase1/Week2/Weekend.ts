import { groupBy, chunk, debounce, retry } from './ts-utils/dist/utils.js';

const employees = [
  { id: 1, name: 'Alice', department: 'Engineering' },
  { id: 2, name: 'Bob', department: 'Marketing' },
  { id: 3, name: 'Charlie', department: 'Engineering' },
  { id: 4, name: 'David', department: 'Marketing' },
  { id: 5, name: 'Eve', department: 'HR' },
  { id: 6, name: 'Frank', department: 'HR' },
  { id: 7, name: 'Grace', department: 'Engineering' },
  { id: 8, name: 'Heidi', department: 'Marketing' },
  { id: 9, name: 'Ivan', department: 'HR' },
  { id: 10, name: 'Judy', department: 'Engineering' },
];

const groupedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let attempts = 0;
const flakyFunction = async () => {
  attempts++;
  if (attempts < 3) throw new Error(`Attempt ${attempts} failed`);
  return 'Success';
};

const result = await retry(flakyFunction, 3, 500);

const debouncedLog = debounce((msg: string) => {
  console.log(`Fired: ${msg}`);
}, 500);

debouncedLog('Call 1');
debouncedLog('Call 2');
debouncedLog('Call 3');



console.log(groupBy(employees, 'department'));
console.log(chunk(groupedNumbers, 2));
console.log(result);
setTimeout(() => {
  debouncedLog('Call 4');
}, 1000 )
//console.log(result)
