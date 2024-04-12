import {
	groupsKey,
	lecturersKey,
	schedulesKey
} from '@/constants/scheduleKeys.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { ISchedule } from '@/types/main.type'
import { getLinks } from '@/utils/schedule-utils/getLinks'
import { parseFromLink } from '@/utils/schedule-utils/parseFromLink'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { format } from 'date-fns'
import { uniq } from 'lodash'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'

@Injectable()
export class ScheduleService {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private prisma: PrismaService
	) {}

	private getIndexSchedule(index: number) {
		return 8 * Math.floor(index / 4) + (index % 4)
	}

	@Cron(CronExpression.EVERY_HOUR)
	private async setSchedules() {
		console.log(
			`****\n${format(new Date(), 'y.MM.dd HH:mm:ss')}\nstart of update\n****\n`
		)

		const scheduleData: ISchedule[] = []
		const sessionData: ISchedule[] = []
		const sessionRepeatData: ISchedule[] = []
		const courses: string[] = []
		const generalData: ISchedule[] = []

		const { schedule, session, sessionRepeat } = await getLinks()

		for (let f = 0; this.getIndexSchedule(f) < schedule.length; f++) {
			const i = this.getIndexSchedule(f)

			const arr1 = await parseFromLink(schedule[i])
			const arr2 = await parseFromLink(schedule[i + 4])

			// if (!arr1.length || !arr2.length) {
			// 	console.log(`problem with schedule\nindex in table ${f}\n`)
			// }

			if (!arr1.length) arr1.push({ dataTable: [], coursesNames: [] })
			if (!arr2.length) arr2.push({ dataTable: [], coursesNames: [] })

			const { coursesNames: cn1, dataTable: oddTable } = arr1[0]
			const { coursesNames: cn2, dataTable: evenTable } = arr2[0]
			const coursesNames = cn1.length >= cn2.length ? cn1 : cn2

			coursesNames.forEach(course => {
				if (!courses.includes(course)) {
					courses.push(course)
				}
			})

			scheduleData.push(
				...coursesNames.reduce((res: ISchedule[], course, m) => {
					const courseSchedule: ISchedule = {
						course,
						schedule: { odd: {}, even: {} }
					}

					const courseIndex = 1 + m * 2

					oddTable.forEach(row => {
						if (row[courseIndex + 1] || row[courseIndex]) {
							if (courseSchedule.schedule.odd[row[0]]) {
								courseSchedule.schedule.odd[row[0]].push([
									row[courseIndex],
									row[courseIndex + 1]
								])
							} else {
								courseSchedule.schedule.odd[row[0]] = [
									[row[courseIndex], row[courseIndex + 1]]
								]
							}
						}
					})

					evenTable.forEach(row => {
						if (row[courseIndex + 1] || row[courseIndex]) {
							if (courseSchedule.schedule.even[row[0]]) {
								courseSchedule.schedule.even[row[0]].push([
									row[courseIndex],
									row[courseIndex + 1]
								])
							} else {
								courseSchedule.schedule.even[row[0]] = [
									[row[courseIndex], row[courseIndex + 1]]
								]
							}
						}
					})

					return [...res, courseSchedule]
				}, [])
			)
		}

		for (let f = 0; f < session.length; f++) {
			const arr = await parseFromLink(session[f])

			// if (!arr.length) {
			// 	console.log(`problem with session\nindex in table ${f}\n`)
			// }

			if (!arr.length) arr.push({ dataTable: [], coursesNames: [] })

			const { coursesNames, dataTable } = arr[0]

			coursesNames.forEach(course => {
				if (!courses.includes(course)) {
					courses.push(course)
				}
			})

			sessionData.push(
				...coursesNames.reduce((res: ISchedule[], course, m) => {
					const courseSchedule: ISchedule = {
						course,
						session: {}
					}

					const courseIndex = 1 + m * 2

					dataTable.forEach(row => {
						if (row[courseIndex + 1] && row[courseIndex]) {
							if (courseSchedule.session[row[0]]) {
								courseSchedule.session[row[0]].push([
									row[courseIndex],
									row[courseIndex + 1]
								])
							} else {
								courseSchedule.session[row[0]] = [
									[row[courseIndex], row[courseIndex + 1]]
								]
							}
						}
					})

					return [...res, courseSchedule]
				}, [])
			)
		}

		const dataSR = await parseFromLink(sessionRepeat)

		if (!dataSR.length) {
			console.log('problem with resession\n')
		} else {
			for (let i = 0; i < dataSR.length; i++) {
				const { coursesNames, dataTable } = dataSR[i]

				coursesNames.forEach(course => {
					if (!courses.includes(course)) {
						courses.push(course)
					}
				})

				sessionRepeatData.push(
					...coursesNames.reduce((res: ISchedule[], course, m) => {
						const courseSchedule: ISchedule = {
							course,
							sessionRepeat: []
						}

						const currInd = m * 3

						dataTable.slice(1).forEach(row => {
							if (row[currInd + 2] || row[currInd + 1] || row[currInd]) {
								courseSchedule.sessionRepeat.push([
									row[currInd],
									row[currInd + 1],
									row[currInd + 2]
								])
							}
						})

						return [...res, courseSchedule]
					}, [])
				)
			}
		}

		courses.forEach(course => {
			generalData.push({
				course,
				schedule: scheduleData.find(el => el.course === course)?.schedule,
				session: sessionData.find(el => el.course === course)?.session,
				sessionRepeat: sessionRepeatData.find(el => el.course === course)
					?.sessionRepeat
			})
		})

		// const oldData = await this.prisma.schedule.findUnique({
		// 	where: { key: 'schedule' }
		// })

		// if (oldData) {
		// }

		await this.prisma.schedule.upsert({
			where: { key: schedulesKey },
			create: { key: schedulesKey, value: JSON.stringify(generalData) },
			update: { value: JSON.stringify(generalData) }
		})

		const groupList = generalData.map(el => el.course)

		await this.prisma.schedule.upsert({
			where: { key: groupsKey },
			create: { key: groupsKey, value: JSON.stringify(groupList) },
			update: { value: JSON.stringify(groupList) }
		})

		console.log('****\nupdate completed\n****\n')
	}

	@Cron(CronExpression.EVERY_HOUR)
	private async setLecturers() {
		const data: ISchedule[] = JSON.parse(
			(
				await this.prisma.schedule.findUnique({
					where: { key: schedulesKey }
				})
			)?.value || '[]'
		)

		const flatObj = (value: { [key: string]: [string, string][] }) => {
			if (!value) return []
			return Object.values(value).map(el2 => el2.map(el3 => el3[1]))
		}

		const flatArr = (value: [string, string, string][]) => {
			if (!value) return []
			return value.flat()
		}

		const lecturersNames = uniq(
			data
				.map(el1 => [
					...flatObj(el1?.schedule?.odd),
					...flatObj(el1?.schedule?.even),
					...flatObj(el1?.session),
					...flatArr(el1?.sessionRepeat)
				])
				.flat(2)
				.map(el => el.match(/[А-Яа-я]+\s{0,1}[А-Яа-я]\.\s{0,1}[А-Яа-я]\./gi))
				.filter(Boolean)
				.flat()
				.sort()
		)

		await this.prisma.schedule.upsert({
			where: { key: lecturersKey },
			create: { key: lecturersKey, value: JSON.stringify(lecturersNames) },
			update: { value: JSON.stringify(lecturersNames) }
		})
	}

	async getTelegrafSessions() {
		const data = (await this.prisma.telegrafSessions.findMany()).map(
			el => ((el.session = JSON.parse(el?.session ? el?.session : '{}')), el)
		)

		return data
	}
}
