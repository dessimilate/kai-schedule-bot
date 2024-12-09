import { Markup } from 'telegraf'
import { BUTTON_NAMES } from '@/constants/buttons-names.constant'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const closeButton = () =>
	inlineKeyboard([callback('Закрыть', BUTTON_NAMES.close)])
