import type { Result } from '../Week2/ts-utils/dist/utils.js';
import { tryCatch, memoize, fetchUser } from '../Week2/ts-utils/dist/utils.js';

async function safeFind(id: string) {
  return tryCatch(() => fetchUser(id));
}

const result = await safeFind('XavierDM');
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error.message);
}
const memoFib = memoize((n: number): number => {
  console.log(`Calculating for ${n}`);
  return n <= 1 ? n : n + (n - 1);
});

memoFib(10);
memoFib(10);
memoFib(10);
