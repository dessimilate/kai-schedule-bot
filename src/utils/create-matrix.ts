export const createMatrix = (width: number, height: number) =>
	Array.from({ length: width }, () => new Array(height).fill(undefined))
