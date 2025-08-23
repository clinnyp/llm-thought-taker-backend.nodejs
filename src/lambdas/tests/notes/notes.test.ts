function sub(a: number, b: number): number {
  return a - b
}

test('sum', () => {
  expect(sub(3, 2)).toBe(1)
})