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
  console.log(
    `Cart item created: ${quantity} x ${product.name} for ${createdBy.name}`
  );
  return { product, quantity, createdBy };
}

function createOrder(
  id: number,
  customer: Customer,
  items: CartItem[],
  totalAmount: number,
  orderDate: Date
): Order {
  console.log(
    `Order created: ${id} for ${customer.name} with total $${totalAmount}`
  );
  return { id, customer, items, totalAmount, orderDate };
}

const customer1 = createCustomer({
  id: 1,
  name: 'Xavier',
  email: 'xavier@example.com',
  createdAt: new Date('2023-03-16'),
});

const laptop = createProduct({ id: 1, name: 'Laptop', price: 999.99 });
const mouse = createProduct({ id: 2, name: 'Mouse', price: 29.99 });
const monitor = createProduct({ id: 3, name: 'Monitor', price: 99.99 });

const cartItem1 = createCartItem(laptop, 1, customer1);
const cartItem2 = createCartItem(mouse, 2, customer1);
const order = createOrder(
  1,
  customer1,
  [cartItem1, cartItem2],
  laptop.price * cartItem1.quantity + mouse.price * cartItem2.quantity,
  new Date('2023-03-16')
);
//console.log(`Customer name: ${createCustomer.name}`);
