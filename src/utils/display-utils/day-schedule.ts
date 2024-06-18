export interface IProps {
	time: string
	text: string
	lecturer: string
	classroom: string
}

export const returnDaySchedule = (props: IProps[]) =>
	props
		.map(row =>
			[
				`В ${row.time}`,
				`${row.text} в ${row.classroom}`,
				`Преподаватель - ${row.lecturer}`
			].join('\n')
		)
		.join('\n\n')
