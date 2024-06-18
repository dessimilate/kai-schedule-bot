import { returnDaySchedule } from '@/utils/display-utils/day-schedule'
import { getDayOfTheWeek } from '@/utils/dayinfo-utils/day-of-the-week'

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
		.map(day => {
			const [d, m] = day.date.split('.')
			const dayNum = new Date(new Date().getFullYear(), +m - 1, +d).getDay()

			return [
				`◀️◀️◀️  ${getDayOfTheWeek(dayNum)} ${day.date}  ▶️▶️▶️`,
				returnDaySchedule(day.daySchedule)
			].join('\n\n')
		})
		.join('\n\n')
