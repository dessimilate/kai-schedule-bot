import { sessionType } from './../types/context.interface'
import { AppService } from '@/app.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'
import { closeButton } from '@/buttons/close.button'
import { schedulesKey } from '@/constants/scheduleKeys.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { ISchedule } from '@/types/main.type'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { returnDaySchedule } from '@/utils/display-utils/returnDaySchedule'
import { jsonParser } from '@/utils/jsonParser'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'

@Injectable()
export class NotificationService {
	constructor(
		private appService: AppService,
		private prisma: PrismaService,
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly scheduleMenuService: ScheduleMenuService
	) {}

	private async tomorrowSchedule(group: string) {
		const data: ISchedule[] = jsonParser(
			await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
		)

		const dayOfWeek = getDayInfo('tomorrowDay')

		const currentWeekSchedule = data.find(el => el.course === group)?.schedule[
			getDayInfo('week') % 2 ? 'odd' : 'even'
		]

		if (!data || !currentWeekSchedule) {
			return 'Расписание отсутствует'
		} else {
			const currentDaySchedule = Object.entries(currentWeekSchedule).find(el =>
				el[0].match(new RegExp(dayOfWeek, 'i'))
			)

			if (
				!currentDaySchedule ||
				!currentDaySchedule[1].filter(
					el => el[0] && el[1] && !el[1].match(/(празд)|(выходн)/gi)
				).length
			) {
				return `${dayOfWeek} - выходной`
			}

			return returnDaySchedule(currentDaySchedule).replace(
				/(<i>)|(<b>)|(<\/i>)|(<\/b>)|(<u>)|(<\/u>)/gi,
				''
			)
		}
	}

	private async sendMessage(key: string, group: string) {
		try {
			this.bot.telegram.sendMessage(
				key,
				await this.tomorrowSchedule(group),
				closeButton()
			)
		} catch {}
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async notifications() {
		const sessions = await this.appService.getTelegrafSessions()

		for (let i = 0; i < sessions.length; i++) {
			const session = sessions[i]
			const { key, session: props } = session

			const date = new Date()

			if (props.notification_type === 'off') continue

			if (props.notification_type === 'atTheCertainTime') {
				if (props.notification_time) {
					const [hour, minute] = props.notification_time

					if (hour === date.getHours() && minute === date.getMinutes()) {
						this.sendMessage(key, props.group)
					}
				} else {
					if (17 === date.getHours() && 0 === date.getMinutes()) {
						this.sendMessage(key, props.group)
					}
				}
			} else if (props.notification_type === 'default') {
				if (17 === date.getHours() && 0 === date.getMinutes()) {
					this.sendMessage(key, props.group)
				}
			} else if (props.notification_type === 'duringTheLesson') {
			}
		}
	}
}
