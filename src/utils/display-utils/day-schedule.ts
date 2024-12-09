import { getClassroom } from './classroom'

export interface IProps {
	time: string
	text: string
	lecturer: string
	classroom: string
}

export const returnDaySchedule = (props: IProps[]) => {
	const schedule = props
		.map(
			row =>
				row.text &&
				[
					`💡 В ${row.time}`,
					`${row.text} ${getClassroom(row.classroom)}`,
					`Преподаватель - ${row.lecturer}`
				].join('\n')
		)
		.filter(Boolean)

	if (schedule.length) {
		return schedule.join('\n\n')
	} else {
		return '🎉 выходной 🎉'
	}
}
