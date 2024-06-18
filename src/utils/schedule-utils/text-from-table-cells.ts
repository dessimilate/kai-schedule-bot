import { textFromTableCell } from './text-from-table-cell'

export const textFromTableCells = (arr: HTMLTableCellElement[]) => {
	return arr.map(cell => textFromTableCell(cell))
}
