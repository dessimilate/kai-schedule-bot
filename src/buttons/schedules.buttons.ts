import {
	backToMain,
	evenWeek,
	examList,
	oddWeek,
	reExamList,
	todayList,
	tomorrowList
} from '@/constants/buttons-names.constant'
import { weekNumber } from '@/utils/dayinfo-utils/week-number'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const schedulesButtons = (idOdd = weekNumber().isOdd) =>
	inlineKeyboard(
		[
			callback('Расписание на сегодня', todayList),
			callback('Расписание на завтра', tomorrowList),
			callback(idOdd ? 'Эта неделя' : 'Нечетная неделя', oddWeek),
			callback(!idOdd ? 'Эта неделя' : 'Четная неделя', evenWeek),
			callback('Расписание Экзаменов', examList),
			callback('Расписание Пересдачи', reExamList),
			callback('Назад', backToMain)
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
