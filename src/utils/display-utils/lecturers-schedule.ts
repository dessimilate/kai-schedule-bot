import { dateRegExp } from '@/constants/regexp/date.regexp'
import { ISortedScheduleInfo } from '@/types/schedule.type'
import { LecturersScheduleRow } from '@prisma/client'
import { compareAsc, format, isBefore, isToday, parse } from 'date-fns'
import { ru } from 'date-fns/locale'
import { title } from './title'
import { getClassroom } from './classroom'

export const returnLecturersSchedule = (
	rows: LecturersScheduleRow[],
	lecturer: string
) => {
	const textArray = ['']

	rows.sort((a, b) =>
		compareAsc(
			parse(`${a.date}.${a.time}`, 'dd.MM.H:mm', new Date()),
			parse(`${b.date}.${b.time}`, 'dd.MM.H:mm', new Date())
		)
	)

	const filteredRows = rows.reduce((res: ISortedScheduleInfo[], row) => {
		const existingRow = res.find(el => el.date === row.date)

		if (existingRow) {
			existingRow.info.push(row)
		} else {
			res.push({ date: row.date, info: [row] })
		}

		return res
	}, [])

	for (const row of filteredRows) {
		const today = new Date()
		const date = parse(row.date, 'dd.MM', today)

		if (
			(isBefore(date, today) && !isToday(date)) ||
			!dateRegExp.test(row.date)
		) {
			continue
		}

		let dateText = ''

		for (const [id, info] of Object.entries(row.info)) {
			const { classroom, course, time, text } = info

			if (!+id) {
				dateText += `${title(date)}\n\n`
			}

			dateText += `${course} - ${time}\n${text} ${getClassroom(classroom)}\n`
		}

		if (dateText.length + textArray[textArray.length - 1].length > 3900) {
			textArray.push(dateText)
		} else {
			textArray[textArray.length - 1] += `${dateText}\n`
		}
	}

	if (!textArray[0]) {
		return null
	}

	return textArray.map(text => `🔴 Преподаватель - ${lecturer}\n\n${text}`)
}
