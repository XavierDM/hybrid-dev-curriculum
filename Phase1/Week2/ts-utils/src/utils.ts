export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      return { ...groups, [groupKey]: [...(groups[groupKey] || []), item] };
    },
    {} as Record<string, T[]>
  );
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function tryCatch<T, E extends Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await fn();
    return { success: true, data: data };
  } catch (error) {
    const data = error;
    return { success: false, error: error as E };
  }
}

export function memoize<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map();
  return (...args: any[]) => {
    const cacheKey = JSON.stringify(args);
    const cachedValue = cache.get(cacheKey);

    if (cachedValue) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedValue;
    }
    const result = fn(...args);
    cache.set(cacheKey, result);
    console.log(`New calculation for key: ${cacheKey}`);
    return result;
  };
}

export async function fetchUser(id: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(
      `I'm gracefully telling you that there was an error ${error}`
    );
    return null;
  }
}
