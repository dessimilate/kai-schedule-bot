import { notificationType, sessionType } from '@/types/context.interface'
import { getDayOfTheWeek } from './day-of-the-week'
import { weekNumber } from '@/utils/dayinfo-utils/week-number'
import { notificationText } from '@/constants/notification-text.constant'

export interface IProps {
	group?: string
	notification_type?: notificationType
	time?: string
}

export const getDayInfo = ({
	group,
	notification_type: type,
	notification_time: time,
	role
}: Partial<sessionType> = {}) => {
	const { isOdd, date } = weekNumber()

	const dayWeek = `${String(date.getDate()).padStart(2, '0')}.${String(
		date.getMonth() + 1
	).padStart(2, '0')}`

	return [
		`Сегодня ${getDayOfTheWeek(date.getDay())} ${dayWeek}`,
		`${isOdd ? 'Нечетная' : 'Четная'} неделя`,
		group ? `Введенная группа: ${group}` : 'Группа не задана',
		group && `Уведомления: ${notificationText(time)[type]}`
	]
		.filter(Boolean)
		.join('\n')
}
