import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export const title = (date: Date) =>
	`🌟 ${format(date, 'eeee dd.MM', { locale: ru })} 🌟`
