import {
	backToMain,
	beforeLastLesson,
	offNotifications,
	defaultNotifications,
	setNotificationTime
} from '@/constants/buttons-names.constant'
import { notificationButtonText } from '@/constants/notification-text.constant'
import { sessionType } from '@/types/context.interface'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const notificationsButtons = ({
	notification_time,
	notification_type
}: sessionType) =>
	inlineKeyboard(
		[
			callback(
				notificationButtonText(notification_type, notification_time).off,
				offNotifications
			),
			callback(
				notificationButtonText(notification_type, notification_time).default,
				defaultNotifications
			),
			switchToCurrentChat(
				notificationButtonText(notification_type, notification_time)
					.atTheCertainTime,
				setNotificationTime
			),
			callback(
				notificationButtonText(notification_type, notification_time)
					.duringTheLesson,
				beforeLastLesson
			),
			callback(`Назад`, backToMain)
		],
		{ columns: 1 }
	)
