import axios from 'axios'
import { parseToHtml } from '@/utils/schedule-utils/parseToHtml'
import { textFromTableCell } from '@/utils/schedule-utils/textFromTableCell'
import { textFromTableCells } from '@/utils/schedule-utils/textFromTableCells'
import { createMatrix } from '@/utils/createMatrix'

export interface IReturnType {
	dataTable: string[][]
	coursesNames: string[]
}

export const parseFromLink = async (
	link: string
): Promise<IReturnType[] | null> => {
	const { data } = await axios.get<string>(link)

	const tables = parseToHtml(data).querySelectorAll('table')
	const dataToReturn: IReturnType[] = []

	for (let i = 0; i < tables.length; i++) {
		const tableRows: HTMLTableCellElement[][] = [
			...tables[i].querySelector('tbody').querySelectorAll('tr')
		].map(el => [...el.querySelectorAll('td')])

		if (!tableRows.length) return null

		const tableHead = tableRows[0]
		const table = tableRows.slice(1)

		const coursesNames = textFromTableCells(tableHead)
			.map(course => {
				const matchArr = course.match(/\d+/)
				if (matchArr) return matchArr[0]
				return null
			})
			.filter(Boolean)

		const tableWidth = tableHead.reduce((res, el) => res + el.colSpan, 0)
		const dataTable: (string | undefined)[][] = createMatrix(
			table.length,
			tableWidth
		)

		table.forEach((row, j) => {
			row.forEach(el => {
				let k: number

				const cellText = textFromTableCell(el)

				const cellHeight = el.rowSpan

				const cellWidth = el.colSpan

				for (k = 0; k < dataTable[j].length; k++) {
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

		dataToReturn.push({
			dataTable,
			coursesNames
		})
	}

	return dataToReturn
}
