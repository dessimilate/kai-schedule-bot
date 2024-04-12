import {
	changeGroup,
	findByLecturers,
	notifications,
	schedules
} from '@/constants/buttons-names.constant'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const mainButtons = () =>
	inlineKeyboard(
		[
			callback('Расписания', schedules),
			switchToCurrentChat('Изменить группу', changeGroup),
			switchToCurrentChat('Поиск по преподавателям', findByLecturers),
			callback('Настройка уведомлений', notifications)
		],
		{ columns: 1 }
	)
