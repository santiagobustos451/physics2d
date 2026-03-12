export function forEachPair<T>(items: T[], callback: (a: T, b: T, i: number, j: number) => void) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      callback(items[i], items[j], i, j);
    }
  }
}