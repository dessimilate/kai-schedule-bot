import { dayLib } from '@/constants/dayoffs-phrases.constant'
import { coursesKey, lecturersKey } from '@/constants/info-db.constant'
import { PrismaService } from '@/prisma.service'
import { findDateInText } from '@/utils/find-date-in-text'
import { filterRows } from '@/utils/schedule-utils/filter-rows'
import { getLinks } from '@/utils/schedule-utils/get-links'
import { parseLink } from '@/utils/schedule-utils/parse-from-link/parse-link'
import { parseLinks } from '@/utils/schedule-utils/parse-from-link/parse-links'
import { parseTextToInfo } from '@/utils/schedule-utils/parse-text-to-info'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { union, uniq } from 'lodash'

export interface IInfo {
	courses: string[]
	lecturers: string[]
}

@Injectable()
export class ScheduleService {
	constructor(private prisma: PrismaService) {}

	@Cron(CronExpression.EVERY_MINUTE)
	private async setSchedules() {
		Logger.log('schedule update', 'SCHEDULE')

		const { schedule, session, sessionRepeat } = await getLinks()

		const { courses: c1, lecturers: l1 } =
			await this.parseFromScheduleArray(schedule)

		const { courses: c2, lecturers: l2 } =
			await this.parseFromSessionArray(session)

		// const {} = await this.parseFromResessionArrays(sessionRepeat)

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

		Logger.log('schedule update completed', 'SCHEDULE')
	}

	@Cron(CronExpression.EVERY_MINUTE)
	private async setLecturersSchedule() {
		Logger.log('lecturers schedule update', 'SCHEDULE')

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
						await this.prisma.lecturersSchedule.upsert({
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
						// Logger.error(dataElement, 'LECTURERS')
					}
				}
			}
		}

		Logger.log('lecturers schedule update completed', 'SCHEDULE')
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

					const filteredOddTable = filterRows(oddTable, col)

					for (const { rowDate, info } of filteredOddTable) {
						await this.prisma.oddScheduleRow.deleteMany({
							where: {
								oddWeekScheduleDate: rowDate,
								oddWeekScheduleBoardCourse: course
							}
						})

						for (const infoElement of info) {
							dataToReturn.lecturers.push(infoElement.lecturer)

							await this.prisma.oddWeekSchedule.upsert({
								where: {
									date_boardCourse: { date: rowDate, boardCourse: course }
								},
								create: {
									date: rowDate,
									daySchedule: { create: infoElement },
									boardCourse: course
								},
								update: {
									daySchedule: {
										upsert: {
											where: {
												time_oddWeekScheduleDate_oddWeekScheduleBoardCourse: {
													time: infoElement.time,
													oddWeekScheduleDate: rowDate,
													oddWeekScheduleBoardCourse: course
												}
											},
											create: infoElement,
											update: infoElement
										}
									}
								}
							})
						}
					}
				}
			}

			if (scheduleEven?.coursesNames?.length) {
				const { coursesNames: evenCourses, dataTable: evenTable } = scheduleEven

				for (const [m, course] of Object.entries(evenCourses)) {
					const col = 1 + +m * 2

					const filteredEvenTable = filterRows(evenTable, col)

					for (const { rowDate, info } of filteredEvenTable) {
						await this.prisma.evenScheduleRow.deleteMany({
							where: {
								evenWeekScheduleDate: rowDate,
								evenWeekScheduleBoardCourse: course
							}
						})

						for (const infoElement of info) {
							dataToReturn.lecturers.push(infoElement.lecturer)

							await this.prisma.evenWeekSchedule.upsert({
								where: {
									date_boardCourse: { date: rowDate, boardCourse: course }
								},
								create: {
									date: rowDate,
									daySchedule: { create: infoElement },
									boardCourse: course
								},
								update: {
									daySchedule: {
										upsert: {
											where: {
												time_evenWeekScheduleDate_evenWeekScheduleBoardCourse: {
													time: infoElement.time,
													evenWeekScheduleDate: rowDate,
													evenWeekScheduleBoardCourse: course
												}
											},
											create: infoElement,
											update: infoElement
										}
									}
								}
							})
						}
					}
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

					const filteredSessionTable = filterRows(dataTable, col)

					for (const { rowDate, info } of filteredSessionTable) {
						await this.prisma.sessionRow.deleteMany({
							where: {
								sessionDate: rowDate,
								sessionBoardCourse: course
							}
						})

						for (const infoElement of info) {
							dataToReturn.lecturers.push(infoElement.lecturer)

							await this.prisma.session.upsert({
								where: {
									date_boardCourse: { date: rowDate, boardCourse: course }
								},
								create: {
									date: rowDate,
									daySchedule: { create: infoElement },
									boardCourse: course
								},
								update: {
									daySchedule: {
										upsert: {
											where: {
												time_sessionDate_sessionBoardCourse: {
													time: infoElement.time,
													sessionDate: rowDate,
													sessionBoardCourse: course
												}
											},
											create: infoElement,
											update: infoElement
										}
									}
								}
							})
						}
					}
				}
			}
		}

		return {
			courses: dataToReturn.courses,
			lecturers: uniq(dataToReturn.lecturers).filter(Boolean)
		}
	}

	private async parseFromResessionArrays(link: string): Promise<IInfo> {
		const dataToReturn: IInfo = {
			courses: [],
			lecturers: []
		}

		const resession = await parseLinks(link)

		for (const element of resession) {
			const { coursesNames, dataTable } = element

			dataToReturn.courses.push(...coursesNames)

			await this.prisma.$transaction(
				coursesNames.map(course =>
					this.prisma.board.upsert({
						where: { course },
						create: { course },
						update: {}
					})
				)
			)

			dataTable.splice(0, 1)

			for (const [m, course] of Object.entries(coursesNames)) {
				const col = +m * 3

				await this.prisma.$transaction(
					dataTable
						.filter(row => row[col + 2])
						.map(row => {
							const rowDate = row[col]
							const info = parseTextToInfo(row[col + 1], row[col + 2])

							dataToReturn.lecturers.push(info.lecturer)

							return this.prisma.resession.upsert({
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
												time_resessionDate_resessionBoardCourse: {
													time: info.time,
													resessionDate: rowDate,
													resessionBoardCourse: course
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

		return {
			courses: dataToReturn.courses,
			lecturers: uniq(dataToReturn.lecturers).filter(Boolean)
		}
	}
}
