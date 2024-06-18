export interface IScheduleRow {
	time: string
	text: string
	lecturer: string
	classroom: string
}

export interface IDaySchedule {
	date: string
	daySchedule: IScheduleRow[]
}

export interface ISchedule {
	course: string
	oddSchedule?: IDaySchedule[]
	evenSchedule?: IDaySchedule[]
	session?: IDaySchedule[]
	sessionRepeat?: IDaySchedule[]
}
