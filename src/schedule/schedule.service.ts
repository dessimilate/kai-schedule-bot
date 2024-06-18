import { dayLib } from '@/constants/dayoffs-phrases.constant'
import { coursesKey, lecturersKey } from '@/constants/info-db.constant'
import { PrismaService } from '@/prisma.service'
import { findDateInText } from '@/utils/find-date-in-text'
import { getLinks } from '@/utils/schedule-utils/get-links'
import { parseLink } from '@/utils/schedule-utils/parse-from-link/parse-link'
import { parseTextToInfo } from '@/utils/schedule-utils/parse-text-to-info'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { format } from 'date-fns'
import { union, uniq } from 'lodash'

export interface IInfo {
	courses: string[]
	lecturers: string[]
}

@Injectable()
export class ScheduleService {
	constructor(private prisma: PrismaService) {}

	@Cron(CronExpression.EVERY_HOUR)
	private async setSchedules() {
		console.log(`${format(new Date(), 'y.MM.dd HH:mm:ss')} - schedule update`)

		const { schedule, session, sessionRepeat } = await getLinks()

		const { courses: c1, lecturers: l1 } =
			await this.parseFromScheduleArray(schedule)

		const { courses: c2, lecturers: l2 } =
			await this.parseFromSessionArray(session)

		const lecturers = union(l1, l2)
		const courses = union(c1, c2)

		await this.prisma.$transaction([
			this.prisma.info.upsert({
				where: { key: coursesKey },
				create: { key: coursesKey, value: courses },
				update: { value: courses }
			}),
			this.prisma.info.upsert({
				where: { key: lecturersKey },
				create: { key: lecturersKey, value: lecturers },
				update: { value: lecturers }
			})
		])

		console.log('schedule update completed\n')
	}

	@Cron(CronExpression.EVERY_HOUR)
	private async setLecturersSchedule() {
		console.log(`${format(new Date(), 'y.MM.dd HH:mm:ss')} - lecturers update`)

		const lecturers = (
			await this.prisma.info.findUnique({
				where: { key: lecturersKey }
			})
		)?.value

		if (lecturers) {
			for (const lecturer of lecturers) {
				const oddLecturers = await this.prisma.oddScheduleRow.findMany({
					where: { lecturer }
				})

				const evenLecturers = await this.prisma.evenScheduleRow.findMany({
					where: { lecturer }
				})

				const sessionLecturers = await this.prisma.sessionRow.findMany({
					where: { lecturer }
				})

				const data = [
					...oddLecturers.map(el => ({
						time: el.time,
						text: el.text,
						date: el.oddWeekScheduleDate,
						course: el.oddWeekScheduleBoardCourse,
						classroom: el.classroom
					})),
					...evenLecturers.map(el => ({
						time: el.time,
						text: el.text,
						date: el.evenWeekScheduleDate,
						course: el.evenWeekScheduleBoardCourse,
						classroom: el.classroom
					})),
					...sessionLecturers.map(el => ({
						time: el.time,
						text: el.text,
						date: el.sessionDate,
						course: el.sessionBoardCourse,
						classroom: el.classroom
					}))
				]

				for (const dataElement of data) {
					const { course, date, time } = dataElement

					try {
						this.prisma.lecturersSchedule.upsert({
							where: { lecturer },
							create: {
								lecturer,
								row: { create: dataElement }
							},
							update: {
								row: {
									upsert: {
										where: { time_date_course: { time, date, course } },
										create: dataElement,
										update: dataElement
									}
								}
							}
						})
					} catch {
						console.log(`error with ${course} ${date} ${time}`)
					}
				}
			}
		}

		console.log('lecturers completed')
	}

	private getIndexSchedule(index: number) {
		return 8 * Math.floor(index / 4) + (index % 4)
	}

	private async parseFromScheduleArray(links: string[]): Promise<IInfo> {
		const dataToReturn: IInfo = {
			courses: [],
			lecturers: []
		}

		for (let f = 0; this.getIndexSchedule(f) < links?.length; f++) {
			const i = this.getIndexSchedule(f)

			const scheduleOdd = await parseLink(links[i])
			const scheduleEven = await parseLink(links[i + 4])

			dataToReturn.courses.push(
				...union(
					scheduleOdd?.coursesNames || [],
					scheduleEven?.coursesNames || []
				)
			)

			await this.prisma.$transaction(
				dataToReturn.courses.map(course =>
					this.prisma.board.upsert({
						where: { course },
						create: { course },
						update: {}
					})
				)
			)

			if (scheduleOdd?.coursesNames?.length) {
				const { coursesNames: oddCourses, dataTable: oddTable } = scheduleOdd

				for (const [m, course] of Object.entries(oddCourses)) {
					const col = 1 + +m * 2

					await this.prisma.$transaction(
						oddTable
							.filter(
								row =>
									row[col] && row[col + 1] && !dayLib.includes(row[col + 1])
							)
							.map(row => {
								const rowDate = findDateInText(row[0])
								const info = parseTextToInfo(row[col], row[col + 1])

								dataToReturn.lecturers.push(info.lecturer)

								return this.prisma.oddWeekSchedule.upsert({
									where: {
										date_boardCourse: { date: rowDate, boardCourse: course }
									},
									create: {
										date: rowDate,
										daySchedule: { create: info },
										boardCourse: course
									},
									update: {
										daySchedule: {
											upsert: {
												where: {
													time_oddWeekScheduleDate_oddWeekScheduleBoardCourse: {
														time: info.time,
														oddWeekScheduleDate: rowDate,
														oddWeekScheduleBoardCourse: course
													}
												},
												create: info,
												update: info
											}
										}
									}
								})
							})
					)
				}
			}

			if (scheduleEven?.coursesNames?.length) {
				const { coursesNames: evenCourses, dataTable: evenTable } = scheduleEven

				for (const [m, course] of Object.entries(evenCourses)) {
					const col = 1 + +m * 2

					await this.prisma.$transaction(
						evenTable
							.filter(
								row =>
									row[col] && row[col + 1] && !dayLib.includes(row[col + 1])
							)
							.map(row => {
								const rowDate = findDateInText(row[0])
								const info = parseTextToInfo(row[col], row[col + 1])

								dataToReturn.lecturers.push(info.lecturer)

								return this.prisma.evenWeekSchedule.upsert({
									where: {
										date_boardCourse: { date: rowDate, boardCourse: course }
									},
									create: {
										date: rowDate,
										daySchedule: { create: info },
										boardCourse: course
									},
									update: {
										daySchedule: {
											upsert: {
												where: {
													time_evenWeekScheduleDate_evenWeekScheduleBoardCourse:
														{
															time: info.time,
															evenWeekScheduleDate: rowDate,
															evenWeekScheduleBoardCourse: course
														}
												},
												create: info,
												update: info
											}
										}
									}
								})
							})
					)
				}
			}
		}

		return {
			courses: dataToReturn.courses,
			lecturers: uniq(dataToReturn.lecturers).filter(Boolean)
		}
	}

	private async parseFromSessionArray(links: string[]): Promise<IInfo> {
		const dataToReturn: IInfo = {
			courses: [],
			lecturers: []
		}

		for (const link of links) {
			const session = await parseLink(link)

			dataToReturn.courses.push(...(session?.coursesNames || []))

			await this.prisma.$transaction(
				dataToReturn.courses.map(course =>
					this.prisma.board.upsert({
						where: { course },
						create: { course },
						update: {}
					})
				)
			)

			if (session?.coursesNames?.length) {
				const { coursesNames, dataTable } = session

				for (const [m, course] of Object.entries(coursesNames)) {
					const col = 1 + +m * 2

					await this.prisma.$transaction(
						dataTable
							.filter(
								row =>
									row[col] && row[col + 1] && !dayLib.includes(row[col + 1])
							)
							.map(row => {
								const rowDate = findDateInText(row[0])
								const info = parseTextToInfo(row[col], row[col + 1])

								dataToReturn.lecturers.push(info.lecturer)

								return this.prisma.session.upsert({
									where: {
										date_boardCourse: { date: rowDate, boardCourse: course }
									},
									create: {
										date: rowDate,
										daySchedule: { create: info },
										boardCourse: course
									},
									update: {
										daySchedule: {
											upsert: {
												where: {
													time_sessionDate_sessionBoardCourse: {
														time: info.time,
														sessionDate: rowDate,
														sessionBoardCourse: course
													}
												},
												create: info,
												update: info
											}
										}
									}
								})
							})
					)
				}
			}
		}

		return {
			courses: dataToReturn.courses,
			lecturers: uniq(dataToReturn.lecturers).filter(Boolean)
		}
	}
}
