export function fibonacci(n: number): number {
  return n === 0 || n === 1
    ? 1
    : fibonacci(n - 1) + fibonacci(n - 2)
}

export function asyncFibonacci(n: number): Promise<number> {
  return Promise.resolve(fibonacci(n))
}