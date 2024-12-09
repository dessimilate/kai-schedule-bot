import { BUTTON_NAMES } from '@/constants/buttons-names.constant'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { switchToCurrentChat }
} = Markup

export const firstEntryButtons = () =>
	inlineKeyboard(
		[
			switchToCurrentChat('Задать группу', BUTTON_NAMES.changeGroup),
			switchToCurrentChat(
				'Поиск по преподавателям',
				BUTTON_NAMES.findByLecturers
			)
		],
		{ columns: 1 }
	)
