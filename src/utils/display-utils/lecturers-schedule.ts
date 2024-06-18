import { LecturersScheduleRow } from '@prisma/client'
import { compareAsc, isBefore, isToday, parse } from 'date-fns'

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

	for (const row of rows) {
		const today = new Date()
		const date = parse(row.date, 'dd.MM', today)
		if (isToday(date) || isBefore(date, today)) {
			continue
		}

		const text = [
			`${row.course} - ${row.date} - ${row.time}`,
			`${row.text} в ${row.classroom}`
		].join('\n')

		if (text.length + textArray[textArray.length - 1].length > 3900) {
			textArray.push(text)
		} else {
			textArray[textArray.length - 1] += `\n\n${text}`
		}
	}

	if (!textArray[0]) {
		return null
	}

	return textArray.map(text => `Преподаватель - ${lecturer}${text}`)
}
