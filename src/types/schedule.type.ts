import { LecturersScheduleRow } from '@prisma/client'

export interface IParsedScheduleArray {
	dataTable: string[][]
	coursesNames: string[]
}

export interface ISortedScheduleRow {
	rowDate: string
	info: IRowInfo[]
}

export interface ISortedScheduleInfo {
	date: string
	info: LecturersScheduleRow[]
}

export interface IRowInfo {
	time: string
	text: string
	lecturer: string
	classroom: string
}
