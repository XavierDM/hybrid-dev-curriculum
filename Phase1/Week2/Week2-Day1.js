"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_console_1 = __importDefault(require("node:console"));
function createProduct(data) {
    return data;
}
function createCustomer(data) {
    return data;
}
function createCartItem(product, quantity, createdBy) {
    return { product, quantity, createdBy };
}
function createOrder(id, customer, items, totalAmount, orderDate) {
    return { id, customer, items, totalAmount, orderDate };
}
createCustomer({
    id: 1,
    name: 'Xavier',
    email: 'xavier@example.com',
    createdAt: new Date('2023-03-16'),
});
createProduct({ id: 1, name: 'Laptop', price: 999.99 });
createProduct({ id: 2, name: 'Mouse', price: 29.99 });
createProduct({ id: 3, name: 'Monitor', price: 99.99 });
node_console_1.default.log(`Customer name: ${createCustomer.name}`);
