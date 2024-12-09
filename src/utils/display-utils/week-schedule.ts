import { returnDaySchedule } from '@/utils/display-utils/day-schedule'
import { getDayOfTheWeek } from '@/utils/dayinfo-utils/day-of-the-week'
import { compareAsc, format, isBefore, isToday, parse } from 'date-fns'
import { ru } from 'date-fns/locale'
import { title } from './title'

export interface IProps {
	date: string
	daySchedule: {
		time: string
		text: string
		lecturer: string
		classroom: string
	}[]
}

export const returnWeekSchedule = (props: IProps[]) =>
	props
		.map(day =>
			`${title(parse(day.date, 'dd.MM', new Date()))}\n\n`.concat(
				day.daySchedule ? returnDaySchedule(day.daySchedule) : '🎉 выходной 🎉'
			)
		)
		.join('\n\n')
