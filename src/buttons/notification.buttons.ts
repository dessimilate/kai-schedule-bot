import { BUTTON_NAMES } from '@/constants/buttons-names.constant'
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
				BUTTON_NAMES.offNotifications
			),
			callback(
				notificationButtonText(notification_type, notification_time).default,
				BUTTON_NAMES.defaultNotifications
			),
			switchToCurrentChat(
				notificationButtonText(notification_type, notification_time)
					.atTheCertainTime,
				BUTTON_NAMES.setNotificationTime
			),
			callback(
				notificationButtonText(notification_type, notification_time)
					.duringTheLesson,
				BUTTON_NAMES.beforeLastLesson
			),
			callback(`Назад`, BUTTON_NAMES.backToMain)
		],
		{ columns: 1 }
	)
