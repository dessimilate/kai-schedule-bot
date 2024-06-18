import { sessionType } from './../types/context.interface'
import { AppService } from '@/app.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'
import { closeButton } from '@/buttons/close.button'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { ISchedule } from '@/types/main.type'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { weekNumber } from '@/utils/dayinfo-utils/week-number'
import { returnDaySchedule } from '@/utils/display-utils/day-schedule'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { addDays, format } from 'date-fns'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'

interface ISession extends Partial<sessionType> {
	id: string
}

@Injectable()
export class NotificationService {
	constructor(
		private prisma: PrismaService,
		@InjectBot() private readonly bot: Telegraf<Context>
	) {}

	private async tomorrowSchedule(course: string) {
		const { day, isOdd } = weekNumber()

		const isNeedOdd = !day ? !isOdd : isOdd

		const daySchedule = isNeedOdd
			? await this.prisma.oddWeekSchedule.findUnique({
					where: {
						date_boardCourse: {
							boardCourse: course,
							date: format(addDays(new Date(), 1), 'dd.MM')
						}
					},
					select: { date: true, daySchedule: true }
				})
			: await this.prisma.evenWeekSchedule.findUnique({
					where: {
						date_boardCourse: {
							boardCourse: course,
							date: format(addDays(new Date(), 1), 'dd.MM')
						}
					},
					select: { date: true, daySchedule: true }
				})

		if (!daySchedule) {
			return
		}

		if (!daySchedule.daySchedule.length) return

		return (
			'🔔🔔🔔 Расписание на завтра 🔔🔔🔔\n\n' +
			returnDaySchedule(daySchedule.daySchedule)
		)
	}

	private async sendMessage(key: string, course: string) {
		const text = await this.tomorrowSchedule(course)

		if (!text) return

		try {
			this.bot.telegram.sendMessage(key, text, closeButton())
		} catch {}
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async notifications() {
		const sessions: ISession[] = (
			await this.prisma.telegrafSessions.findMany()
		).map(el => {
			const session: Partial<sessionType> = JSON.parse(el.session)

			return {
				id: el.key.split(':')[1],
				...session
			}
		})

		for (const session of sessions) {
			const { id, notification_type, notification_time, group } = session

			const date = new Date()

			if (notification_type === 'off') continue

			if (notification_type === 'atTheCertainTime') {
				if (notification_time) {
					const [hour, minute] = notification_time.split(':')

					if (+hour === date.getHours() && +minute === date.getMinutes()) {
						this.sendMessage(id, group)
					}
				} else {
					if (17 === date.getHours() && 0 === date.getMinutes()) {
						this.sendMessage(id, group)
					}
				}
			} else if (notification_type === 'default') {
				if (17 === date.getHours() && 0 === date.getMinutes()) {
					this.sendMessage(id, group)
				}
			} else if (notification_type === 'duringTheLesson') {
			}
		}
	}
}
