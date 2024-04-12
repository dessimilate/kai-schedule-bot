import {
	backToMain,
	beforeLastLesson,
	offNotifications,
	defaultNotifications,
	setNotificationTime
} from '@/constants/buttons-names.constant'
import { ntType } from '@/types/context.interface'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const notificationsButtons = (type: ntType) =>
	inlineKeyboard(
		[
			callback(
				`${type === 'off' ? '✅' : ''}Выключить уведомления`,
				offNotifications
			),
			callback(
				`${type === 'default' ? '✅' : ''}По умолчанию(в 17:00)`,
				defaultNotifications
			),
			switchToCurrentChat(
				`${type === 'atTheCertainTime' ? '✅' : ''}Выбрать время`,
				setNotificationTime
			),
			callback(
				`${type === 'duringTheLesson' ? '✅' : ''}Уведомления перед последней парой`,
				beforeLastLesson
			),
			callback(`Назад`, backToMain)
		],
		{ columns: 1 }
	)
