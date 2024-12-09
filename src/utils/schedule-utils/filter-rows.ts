import { ISortedScheduleRow } from '@/types/schedule.type'
import { findDateInText } from '../find-date-in-text'
import { parseTextToInfo } from './parse-text-to-info'
import { dayLib } from '@/constants/dayoffs-phrases.constant'

export const filterRows = (table: string[][], col: number) =>
	table
		.filter(
			row =>
				row[col] &&
				row[col + 1] &&
				!dayLib.some(el => row[col + 1].includes(el))
		)
		.reduce((res: ISortedScheduleRow[], row) => {
			const rowDate = findDateInText(row[0])
			const info = parseTextToInfo(row[col], row[col + 1])

			const existingRow = res.find(el => el.rowDate === rowDate)

			if (existingRow) {
				existingRow.info.push(info)
			} else {
				res.push({ rowDate, info: [info] })
			}

			return res
		}, [])
