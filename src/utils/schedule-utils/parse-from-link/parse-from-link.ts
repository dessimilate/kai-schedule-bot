import axios from 'axios'
import { parseToHtml } from '@/utils/schedule-utils/parse-to-html'
import type { IParsedScheduleArray } from '@/types/schedule.type'
import { parseFromTable } from '@/utils/schedule-utils/parse-from-link/parse-from-table'

export const parseFromLink = async (
	link: string,
	isReturnArray = false
): Promise<IParsedScheduleArray | IParsedScheduleArray[]> => {
	const { data } = await axios.get<string>(link)
	if (!data) return null

	const tables = parseToHtml(data).querySelectorAll('table')
	if (!tables) return null

	const dataToReturn: IParsedScheduleArray[] = []

	tables.forEach(table => {
		const tableData = parseFromTable(table)
		if (tableData) dataToReturn.push(tableData)
	})

	if (isReturnArray) {
		return dataToReturn
	} else {
		return dataToReturn[0]
	}
}
