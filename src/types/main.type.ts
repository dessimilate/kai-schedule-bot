import type { ISortedScheduleRow } from './schedule.type'

export interface ISchedule {
	course: string
	oddSchedule?: ISortedScheduleRow[]
	evenSchedule?: ISortedScheduleRow[]
	session?: ISortedScheduleRow[]
	sessionRepeat?: ISortedScheduleRow[]
}
