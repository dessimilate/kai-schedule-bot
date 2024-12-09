import {
	classroomNames,
	noClassroom
} from '@/constants/classrooms-names.constant'
import { deleteFromText } from '@/constants/delete-from-text.constant'
import { lecturerRegExp } from '@/constants/regexp/lecturer.regexp'
import { IRowInfo } from '@/types/schedule.type'

export const parseTextToInfo = (time: string, info: string): IRowInfo => {
	info = deleteFromText
		.reduce((res: string, el) => res.replace(el, ''), info)
		.trim()

	time = time ? time.replace('.', ':') : 'неизвестно'

	let text: string | string[]

	let lecturer: string | string[] = info.match(lecturerRegExp)

	if (lecturer) {
		lecturer = lecturer[0].trim()

		const indexLecturer = info.indexOf(lecturer)

		text = info.slice(0, indexLecturer).trim()
	} else {
		lecturer = ''
		text = ''
	}

	let classroom: string | string[] = info.match(/\([А-Яа-я0-9\s]+\)$/)
	classroom = classroom
		? classroom[0].replace(/\(|\)/g, '').trim()
		: noClassroom
	if (classroomNames[classroom]) classroom = classroomNames[classroom]

	return { time, text, lecturer, classroom }
}
