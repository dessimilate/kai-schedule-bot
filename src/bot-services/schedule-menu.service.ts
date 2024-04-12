import { schedulesKey } from '@/constants/scheduleKeys.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { jsonParser } from '@/utils/jsonParser'
import { Injectable } from '@nestjs/common'
import { closeButton } from '@/buttons/close.button'
import { ISchedule } from '@/types/main.type'
import { returnDaySchedule } from '@/utils/display-utils/returnDaySchedule'
import { returnWeekSchedule } from '@/utils/display-utils/returnWeekSchedule'
import { returnReSessionSchedule } from '@/utils/display-utils/returnReSessionSchedule'

@Injectable()
export class ScheduleMenuService {
	constructor(private prisma: PrismaService) {}

	private async todayOrTomorrowSchedule(
		ctx: Context,
		is: 'today' | 'tomorrow'
	) {
		const data: ISchedule[] = jsonParser(
			await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
		)

		const group = ctx.session.group
		const dayOfWeek =
			is === 'today' ? getDayInfo('dayOfWeek') : getDayInfo('tomorrowDay')

		const currentWeekSchedule = data.find(el => el.course === group)?.schedule[
			getDayInfo('week') % 2 ? 'odd' : 'even'
		]

		if (!data || !currentWeekSchedule) {
			await ctx.reply('Расписание отсутствует', closeButton())
			return
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
				await ctx.reply(`${dayOfWeek} - выходной`, closeButton())
				return
			}

			await ctx.replyWithHTML(
				returnDaySchedule(currentDaySchedule),
				closeButton()
			)
		}
	}

	private async oddEvenSessionSchedule(
		ctx: Context,
		is: 'odd' | 'even' | 'session'
	) {
		const data: ISchedule[] = jsonParser(
			await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
		)

		const group = ctx.session.group

		const currentWeekSchedule =
			is === 'session'
				? data.find(el => el.course === group)?.session
				: data.find(el => el.course === group)?.schedule[is]

		if (!data || !currentWeekSchedule) {
			await ctx.reply('Расписание отсутствует', closeButton())
			return
		}

		for (const [key, value] of Object.entries(currentWeekSchedule)) {
			if (value.some(el => el[1].match(/(празд)|(выходн)|(библ)/gi))) {
				currentWeekSchedule[key] = []
				continue
			}

			currentWeekSchedule[key] = value.filter(el => el[0] && el[1])
		}

		await ctx.replyWithHTML(
			returnWeekSchedule(currentWeekSchedule),
			closeButton()
		)
	}

	async getTodaySchedule(ctx: Context) {
		await this.todayOrTomorrowSchedule(ctx, 'today')
	}

	async getTomorrowSchedule(ctx: Context) {
		await this.todayOrTomorrowSchedule(ctx, 'tomorrow')
	}

	async getOddSchedule(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'even')
	}

	async getEvenSchedule(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'odd')
	}

	async getSession(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'session')
	}

	async getReSession(ctx: Context) {
		const data: ISchedule[] = jsonParser(
			await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
		)

		const group = ctx.session.group

		const currentWeekSchedule = data.find(
			el => el.course === group
		)?.sessionRepeat

		if (!data || !currentWeekSchedule) {
			await ctx.reply('Расписание отсутствует', closeButton())
			return
		}

		await ctx.replyWithHTML(
			returnReSessionSchedule(currentWeekSchedule),
			closeButton()
		)
	}
}
