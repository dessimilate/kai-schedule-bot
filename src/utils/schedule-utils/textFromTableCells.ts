import { textFromTableCell } from './textFromTableCell'

export const textFromTableCells = (arr: HTMLTableCellElement[]) => {
	return arr.map(cell => textFromTableCell(cell))
}
