import { Context } from '@/types/context.interface'
import { sendFirstEntryMenu } from '@/utils/bot-utils/first-entry-menu'
import { editMainMenu, sendMainMenu } from '@/utils/bot-utils/main-menu'
import {
	editNotificationMenu,
	sendNotificationMenu
} from '@/utils/bot-utils/notification-menu'
import {
	sendScheduleMenu,
	editScheduleMenu
} from '@/utils/bot-utils/schedule-menu'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import {
	changeGroup,
	findByLecturers
} from '@/constants/buttons-names.constant'
import { coursesKey, lecturersKey } from '@/constants/info-db.constant'

@Injectable()
export class MainMenuService {
	constructor(private prisma: PrismaService) {}

	async start(ctx: Context) {
		if (!ctx.session.menu_button_type) ctx.session.menu_button_type = 'main'
		if (!ctx.session.notification_type) ctx.session.notification_type = 'off'
		if (!ctx.session.notification_time) ctx.session.notification_time = '17:00'

		const { group, start_message_id, menu_button_type } = ctx.session

		const message =
			group === undefined
				? await sendFirstEntryMenu(ctx)
				: menu_button_type === 'main'
					? await sendMainMenu(ctx)
					: menu_button_type === 'schedules'
						? await sendScheduleMenu(ctx)
						: await sendNotificationMenu(ctx)

		if (start_message_id) {
			try {
				await ctx.deleteMessage(start_message_id)
			} catch {}

			try {
				await ctx.deleteMessage(ctx.update.message.message_id)
			} catch {}
		}
	}

	async displayScheduleMenu(ctx: Context) {
		ctx.session.menu_button_type = 'schedules'

		try {
			await editScheduleMenu(ctx)
		} catch {
			await sendScheduleMenu(ctx)
		}
	}

	async displayNotificationMenu(ctx: Context) {
		ctx.session.menu_button_type = 'notification'

		try {
			await editNotificationMenu(ctx)
		} catch {
			await sendNotificationMenu(ctx)
		}
	}

	async getByGroup(ctx: Context) {
		const courses = (
			await this.prisma.info.findUnique({
				where: { key: coursesKey }
			})
		).value

		if (!courses) return

		const searchParams = ctx.inlineQuery.query.slice(changeGroup.length)

		await ctx.answerInlineQuery(
			courses
				.sort()
				.filter(el => new RegExp(searchParams, 'gi').test(el))
				.map((name, i) => ({
					id: String(i),
					type: 'article',
					title: `${changeGroup}${name}`,
					input_message_content: { message_text: `${changeGroup}${name}` }
				}))
		)
	}

	async getByLecturers(ctx: Context) {
		const lecturers = (
			await this.prisma.info.findUnique({
				where: { key: lecturersKey }
			})
		).value

		const searchParams = ctx.inlineQuery.query.slice(findByLecturers.length)

		await ctx.answerInlineQuery(
			lecturers
				.sort()
				.filter(el => el.match(new RegExp(searchParams, 'gi')) !== null)
				.map((name, i) => ({
					id: String(i),
					type: 'article',
					title: `${findByLecturers}${name}`,
					input_message_content: { message_text: `${findByLecturers}${name}` }
				}))
		)
	}

	async backToMainMenu(ctx: Context) {
		ctx.session.menu_button_type = 'main'

		try {
			await editMainMenu(ctx)
		} catch {
			await sendMainMenu(ctx)
		}
	}
}
