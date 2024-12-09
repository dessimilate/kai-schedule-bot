import { BUTTON_NAMES } from '@/constants/buttons-names.constant'
import { weekNumber } from '@/utils/dayinfo-utils/week-number'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const schedulesButtons = (idOdd = weekNumber().isOdd) =>
	inlineKeyboard(
		[
			callback('Расписание на сегодня', BUTTON_NAMES.todayList),
			callback('Расписание на завтра', BUTTON_NAMES.tomorrowList),
			callback(idOdd ? 'Эта неделя' : 'Нечетная неделя', BUTTON_NAMES.oddWeek),
			callback(!idOdd ? 'Эта неделя' : 'Четная неделя', BUTTON_NAMES.evenWeek),
			callback('Расписание Экзаменов', BUTTON_NAMES.examList),
			callback('Расписание Пересдачи', BUTTON_NAMES.reExamList),
			callback('Назад', BUTTON_NAMES.backToMain)
		],
		{
			wrap: (_, i) => {
				switch (i) {
					case 1:
						return true
					case 2:
						return true
					case 3:
						return false
					case 4:
						return true
					case 5:
						return true
					case 6:
						return true
					case 7:
						return true
					default:
						return false
				}
			}
		}
	)
