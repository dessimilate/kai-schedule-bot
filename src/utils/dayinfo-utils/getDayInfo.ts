import { ntType } from '@/types/context.interface'
import { getDayOfTheWeek } from './getDayOfTheWeek'

type infoType = 'info' | 'week' | 'dayOfWeek' | 'tomorrowDay'

export const getDayInfo = (
	info: infoType,
	props?: {
		group?: string
		notification_type?: ntType
		time?: [number, number]
	}
): any => {
	const date = new Date()
	const day = date.getDay()
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
	const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)

	const dayWeek = `${String(date.getDate()).padStart(2, '0')}.${String(
		date.getMonth() + 1
	).padStart(2, '0')}`

	if (info === 'info') {
		return [
			`Сегодня ${getDayOfTheWeek(date.getDay())} ${dayWeek}`,
			`${week % 2 ? 'Нечетная' : 'Четная'} неделя`,
			props?.group ? `Введенная группа: ${props.group}` : 'Группа не задана',
			props?.notification_type
				? `Уведомления: ${
						props.notification_type === 'off'
							? 'Выключены'
							: props.notification_type === 'default'
								? 'По умолчанию'
								: props.notification_type === 'atTheCertainTime'
									? `В указанное время(${props.time?.map(el => String(el).padStart(2, '0'))?.join(':')})`
									: 'Во время пар'
					}`
				: ''
		].join('\n')
	} else if (info === 'dayOfWeek') {
		return getDayOfTheWeek(date.getDay())
	} else if (info === 'week') {
		return week
	} else if (info === 'tomorrowDay') {
		return getDayOfTheWeek(day === 6 ? 0 : day + 1)
	}
}
