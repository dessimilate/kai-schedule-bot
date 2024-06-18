import { classroomNames } from '@/constants/classrooms-names.constant'
import type { IScheduleRow } from '@/types/main.type'

export const parseTextToInfo = (time: string, info: string): IScheduleRow => {
	time = time.replace('.', ':')

	let text: string | string[] = info.match(/^([А-Яа-я]+\s)+/g)
	text = text ? text[0].trim() : ''

	let lecturer: string | string[] = info.match(
		/[А-Яа-я]+\s[А-Яа-я]\.[А-Яа-я]\./g
	)
	lecturer = lecturer ? lecturer[0].trim() : ''

	let classroom: string | string[] = info.match(/\([А-Яа-я0-9\s]+\)$/)
	classroom = classroom ? classroom[0].replace(/\(|\)/g, '').trim() : ''
	if (classroomNames[classroom]) classroom = classroomNames[classroom]

	return { time, text, lecturer, classroom }
}
