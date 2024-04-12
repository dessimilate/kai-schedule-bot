import {
	findByLecturers,
	changeGroup
} from '@/constants/buttons-names.constant'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { switchToCurrentChat }
} = Markup

export const firstEntryButtons = () =>
	inlineKeyboard(
		[
			switchToCurrentChat('Задать группу', changeGroup),
			switchToCurrentChat('Поиск по преподавателям', findByLecturers)
		],
		{ columns: 1 }
	)
