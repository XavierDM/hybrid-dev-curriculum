import { groupBy, sortBy, uniqueBy } from './dataUtils.js';

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

const groupedEmployees = groupBy(employees, 'department');
const sortedEmployees = sortBy(employees, 'name', 'asc');
const uniqueDepartments = uniqueBy(employees, 'department');
const departmentNames = uniqueDepartments.map((e) => e.department);

console.log('Grouped Employees:', groupedEmployees);
console.log('Sorted Employees:', sortedEmployees);
console.log('Unique Departments:', uniqueDepartments);
console.log('Department Names:', departmentNames);
