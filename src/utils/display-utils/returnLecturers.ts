import { ISchedule } from '@/types/main.type'
import { getMonthByName } from '../dayinfo-utils/getMonthByName'

export const returnLecturers = (schedules: ISchedule[], name: string) => {
	return schedules
		.map(el => {
			const evenArr = Object.entries(el?.schedule?.even || {}).map(
				([day, scheduleArr]) =>
					scheduleArr.map(
						scheduleEl =>
							`Дата: <u>${day}</u> | Время: <u>${scheduleEl[0].replace('.', ':')}</u> | Группа: <u>${
								el.course
							}</u>\n${scheduleEl[1]}`
					)
			)
			const oddArr = Object.entries(el?.schedule?.odd || {}).map(
				([day, scheduleArr]) =>
					scheduleArr.map(
						scheduleEl =>
							`Дата: <u>${day}</u> | Время: <u>${scheduleEl[0].replace('.', ':')}</u> | Группа: <u>${
								el.course
							}</u>\n${scheduleEl[1]}`
					)
			)

			const session = Object.entries(el?.session || {}).map(
				([day, scheduleArr]) =>
					scheduleArr.map(
						scheduleEl =>
							`Дата: <u>${day}</u> | Время: <u>${scheduleEl[0].replace('.', ':')}</u> | Группа: <u>${
								el.course
							}</u>\n${scheduleEl[1]}`
					)
			)

			const reSession = (el?.sessionRepeat || []).map(([date, time, sch]) =>
				date
					? `Пересдача | Дата: <u>${date}</u> | Время: <u>${time.replace('.', ':') || 'Неизвестно'}</u>  | Группа: <u>${
							el.course
						}</u>\n${sch}`
					: ''
			)

			return [...evenArr, ...oddArr, ...session, ...reSession]
		})
		.flat(2)
		.filter(el => el.includes(name))
		.sort((a, b) => {
			const date1 = a.match(/\d{1,3}\.\d{1,3}/gi)
			const date2 = b.match(/\d{1,3}\.\d{1,3}/gi)

			if (date1 && !date2) {
				return -1
			} else if (!date1 && date2) {
				return 1
			} else if (!date1 && !date2) {
				// const findMonth1 = a.match(/Дата: [А-Яа-я<>]+\s/gi)
				// const findMonth2 = b.match(/Дата: [А-Яа-я<>]+\s/gi)

				// console.log(findMonth1, findMonth2)

				// if (findMonth1 && findMonth2) {
				// 	// console.log(findMonth1[0].slice(6), findMonth2[0].slice(6))
				// 	const monthNumber1 = getMonthByName(findMonth1[0].slice(6))
				// 	const monthNumber2 = getMonthByName(findMonth2[0].slice(6))

				// 	return monthNumber1 - monthNumber2
				// }

				return 0
			}

			const [day1, month1] = date1[0].split('.')
			const [day2, month2] = date2[0].split('.')

			const compare1 = +month1 - +month2
			const compare2 = +day1 - +day2

			return compare1 ? compare1 : compare2
		})
}
