import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common'
import { closeButton } from '@/buttons/close.button'
import { getDayOfTheWeek } from '@/utils/dayinfo-utils/day-of-the-week'
import { weekNumber } from '@/utils/dayinfo-utils/week-number'
import { format, addDays } from 'date-fns'
import { returnDaySchedule } from '@/utils/display-utils/day-schedule'
import { returnWeekSchedule } from '@/utils/display-utils/week-schedule'

@Injectable()
export class ScheduleMenuService {
	constructor(private prisma: PrismaService) {}

	private async todayOrTomorrowSchedule(ctx: Context, isToday = true) {
		const course = ctx.session.group

		const { day, isOdd } = weekNumber()

		const isNeedOdd = isToday ? isOdd : !day ? !isOdd : isOdd

		const daySchedule = isNeedOdd
			? await this.prisma.oddWeekSchedule.findUnique({
					where: {
						date_boardCourse: {
							boardCourse: course,
							date: format(addDays(new Date(), +!isToday), 'dd.MM')
						}
					},
					select: { date: true, daySchedule: true }
				})
			: await this.prisma.evenWeekSchedule.findUnique({
					where: {
						date_boardCourse: {
							boardCourse: course,
							date: format(addDays(new Date(), +!isToday), 'dd.MM')
						}
					},
					select: { date: true, daySchedule: true }
				})

		const dayOfWeek = isToday
			? getDayOfTheWeek(day)
			: getDayOfTheWeek(day === 6 ? 0 : day + 1)

		if (!daySchedule) {
			await ctx.reply(`${dayOfWeek} - выходной`, closeButton())
			return
		}

		const text = returnDaySchedule(daySchedule.daySchedule)

		await ctx.reply(text, closeButton())
	}

	private async oddEvenSessionSchedule(
		ctx: Context,
		type: 'odd' | 'even' | 'session'
	) {
		const course = ctx.session.group

		const weekSchedule =
			type === 'odd'
				? await this.prisma.oddWeekSchedule.findMany({
						where: { boardCourse: course },
						select: { date: true, daySchedule: true }
					})
				: type === 'even'
					? await this.prisma.evenWeekSchedule.findMany({
							where: { boardCourse: course },
							select: { date: true, daySchedule: true }
						})
					: await this.prisma.session.findMany({
							where: { boardCourse: course },
							select: { date: true, daySchedule: true }
						})

		if (!weekSchedule) {
			await ctx.reply('Расписание отсутствует', closeButton())
			return
		}

		const text = returnWeekSchedule(weekSchedule)

		await ctx.replyWithHTML(text, closeButton())
	}

	async getTodaySchedule(ctx: Context) {
		await this.todayOrTomorrowSchedule(ctx)
	}

	async getTomorrowSchedule(ctx: Context) {
		await this.todayOrTomorrowSchedule(ctx, false)
	}

	async getTodayScheduleCommand(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await this.todayOrTomorrowSchedule(ctx)
	}

	async getTomorrowScheduleCommand(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await this.todayOrTomorrowSchedule(ctx, false)
	}

	async getOddSchedule(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'odd')
	}

	async getEvenSchedule(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'even')
	}

	async getSession(ctx: Context) {
		await this.oddEvenSessionSchedule(ctx, 'session')
	}

	// async getReSession(ctx: Context) {
	// 	const data: ISchedule[] = jsonParser(
	// 		await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
	// 	)

	// 	const group = ctx.session.group

	// 	const currentWeekSchedule = data.find(
	// 		el => el.course === group
	// 	)?.sessionRepeat

	// 	if (!data || !currentWeekSchedule) {
	// 		await ctx.reply('Расписание отсутствует', closeButton())
	// 		return
	// 	}

	// 	await ctx.replyWithHTML(
	// 		returnReSessionSchedule(currentWeekSchedule),
	// 		closeButton()
	// 	)
	// }
}
