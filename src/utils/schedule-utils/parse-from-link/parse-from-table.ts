import type { IParsedScheduleArray } from '@/types/schedule.type'
import { createMatrix } from '@/utils/create-matrix'
import { textFromTableCells } from '@/utils/schedule-utils/text-from-table-cells'
import { textFromTableCell } from '@/utils/schedule-utils/text-from-table-cell'

export const parseFromTable = (
	table: HTMLTableElement
): IParsedScheduleArray | null => {
	const dataToReturn: IParsedScheduleArray = { coursesNames: [], dataTable: [] }

	const tableRows: HTMLTableCellElement[][] = [
		...table.querySelector('tbody').querySelectorAll('tr')
	].map(el => [...el.querySelectorAll('td')])

	if (!tableRows?.length) return null

	const tableHead = tableRows[0]
	const tableBody = tableRows.slice(1)

	const coursesNames = textFromTableCells(tableHead)
		.map(course => {
			const matchArr = course.match(/\d+/)
			if (matchArr) return matchArr[0]
			return null
		})
		.filter(Boolean)

	const tableWidth = tableHead.reduce((res, el) => res + el.colSpan, 0)
	const dataTable: (string | undefined)[][] = createMatrix(
		tableBody?.length,
		tableWidth
	)

	tableBody.forEach((row, j) => {
		row.forEach(el => {
			let k: number

			const cellText = textFromTableCell(el)

			const cellHeight = el.rowSpan

			const cellWidth = el.colSpan

			for (k = 0; k < dataTable[j]?.length; k++) {
				if (dataTable[j][k] === undefined) {
					dataTable[j][k] = cellText
					break
				}
			}

			if (cellHeight > 1) {
				for (let n = 0; n < cellHeight - 1; n++) {
					dataTable[j + n + 1][k] = cellText
				}
			}

			if (cellWidth > 1) {
				for (let n = 0; n < cellWidth - 1; n++) {
					dataTable[j][k + n + 1] = cellText
				}
			}
		})
	})

	return {
		dataTable,
		coursesNames
	}
}
