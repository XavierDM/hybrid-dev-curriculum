////////////////////////////////
/////// WEEK 1 DAY 1 ///////////
////////////////////////////////
const numbers = [1, 2, 3, 4, 5];
//console.log(numbers);
const doubled = numbers.map((n) => n * 2);
//console.log(doubled);
const evens = numbers.filter((n) => n % 2 === 0);
//console.log(evens);
const sum = numbers.reduce((total, n) => total + n, 0);
//console.log(sum);
const result = numbers
  .filter((n) => n > 2)
  .map((n) => n * 10)
  .reduce((sum, n) => sum + n, 0);
//console.log(result);

//const combined = [...arr1, ...arr2];
const original = { name: 'Xavier', role: 'hare developer' };
const updated = { ...original, role: 'tortoise developer' };
console.log(original);
console.log(updated);
/*function logAll(first, ...others) {
  console.log('First:', first);
  console.log('Others:', others);
}*/

const employees = [
  { name: 'Xavier', salary: 2000, department: 'IT' },
  { name: 'Steven', salary: 2500, department: 'IT' },
  { name: 'Jules', salary: 1500, department: 'Maintenance' },
  { name: 'Kitten', salary: 2500, department: 'Wellbeing' },
  { name: 'Brian', salary: 1500, department: 'IT' },
];
const total = employees
  .filter((employee) => employee.department === 'IT')
  .reduce((total, employee) => total + employee.salary, 0);
console.log(total);
