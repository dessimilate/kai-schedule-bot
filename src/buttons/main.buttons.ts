import { BUTTON_NAMES } from '@/constants/buttons-names.constant'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const mainButtons = () =>
	inlineKeyboard(
		[
			callback('Расписания', BUTTON_NAMES.schedules),
			switchToCurrentChat('Изменить группу', BUTTON_NAMES.changeGroup),
			switchToCurrentChat(
				'Поиск по преподавателям',
				BUTTON_NAMES.findByLecturers
			),
			callback('Настройка уведомлений', BUTTON_NAMES.notifications)
		],
		{ columns: 1 }
	)
