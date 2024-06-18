import { getWeek } from 'date-fns'

export const weekNumber = () => {
	const date = new Date()
	const day = date.getDay()

	const week = getWeek(date, { weekStartsOn: 1 })

	return { week, isOdd: !!(week % 2), date, day }
}
