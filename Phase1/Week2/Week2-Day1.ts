interface Customer {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  createdBy: Customer;
}

interface Order {
  id: number;
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  orderDate: Date;
}

function createProduct(data: Product): Product {
  console.log(`Product created: ${data.name} at $${data.price}`);
  return data;
}

function createCustomer(data: Customer): Customer {
  console.log(`Customer created: ${data.name}`);
  return data;
}

function createCartItem(
  product: Product,
  quantity: number,
  createdBy: Customer
): CartItem {
  return { product, quantity, createdBy };
}

function createOrder(
  id: number,
  customer: Customer,
  items: CartItem[],
  totalAmount: number,
  orderDate: Date
): Order {
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

//console.log(`Customer name: ${createCustomer.name}`);
