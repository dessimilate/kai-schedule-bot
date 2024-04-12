import {
	backToMain,
	evenWeek,
	examList,
	oddWeek,
	reExamList,
	todayList,
	tomorrowList
} from '@/constants/buttons-names.constant'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { Markup } from 'telegraf'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const schedulesButtons = () =>
	inlineKeyboard(
		[
			callback('Расписание на сегодня', todayList),
			callback('Расписание на завтра', tomorrowList),
			callback(
				getDayInfo('week') % 2 ? 'Эта неделя' : 'Нечетная неделя',
				oddWeek
			),
			callback(
				getDayInfo('week') % 2 ? 'Четная неделя' : 'Эта неделя',
				evenWeek
			),
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
