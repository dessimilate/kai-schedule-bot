import { Context } from '@/types/context.interface'
import { getMenuOptions } from '@/utils/bot-utils/getMenuOptions'
import { sendFirstEntryMenu } from '@/utils/bot-utils/sendFirstEntryMenu'
import { sendMainMenu } from '@/utils/bot-utils/sendMainMenu'
import { sendNotificationMenu } from '@/utils/bot-utils/sendNotificationMenu'
import { sendScheduleMenu } from '@/utils/bot-utils/sendScheduleMenu'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { Injectable } from '@nestjs/common'
import { schedulesButtons } from '@/buttons/schedules.buttons'
import { mainButtons } from '@/buttons/main.buttons'
import { notificationsButtons } from '@/buttons/notification.buttons'
import { PrismaService } from '@/prisma.service'
import { groupsKey, lecturersKey } from '@/constants/scheduleKeys.constant'
import { jsonParser } from '@/utils/jsonParser'
import {
	changeGroup,
	findByLecturers
} from '@/constants/buttons-names.constant'

@Injectable()
export class MainMenuService {
	constructor(private prisma: PrismaService) {}

	async start(ctx: Context) {
		if (!ctx.session.menu_button_type) ctx.session.menu_button_type = 'main'
		if (!ctx.session.notification_type) ctx.session.notification_type = 'off'
		ctx.session.first_name = ctx.chat.first_name || ''
		ctx.session.last_name = ctx.chat.last_name || ''

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

		ctx.session.start_message_id = message.message_id
	}

	async displayScheduleMenu(ctx: Context) {
		ctx.session.menu_button_type = 'schedules'

		try {
			await ctx.editMessageText(
				getDayInfo('info', getMenuOptions(ctx)),
				schedulesButtons()
			)
		} catch {
			await ctx.replyWithHTML(
				getDayInfo('info', getMenuOptions(ctx)),
				schedulesButtons()
			)
		}
	}

	async displayNotificationMenu(ctx: Context) {
		ctx.session.menu_button_type = 'notification'

		try {
			await ctx.editMessageText(
				getDayInfo('info', getMenuOptions(ctx)),
				notificationsButtons(ctx.session.notification_type || 'off')
			)
		} catch {
			await ctx.replyWithHTML(
				getDayInfo('info', getMenuOptions(ctx)),
				notificationsButtons(ctx.session.notification_type || 'off')
			)
		}
	}

	async getByGroup(ctx: Context) {
		const groupList: string[] = jsonParser(
			await this.prisma.schedule.findUnique({
				where: { key: groupsKey }
			})
		)

		if (!groupList) return

		const searchParams = ctx.inlineQuery.query.slice(changeGroup.length)

		await ctx.answerInlineQuery(
			groupList
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
		const namesList: string[] = jsonParser(
			await this.prisma.schedule.findUnique({ where: { key: lecturersKey } })
		)

		const searchParams = ctx.inlineQuery.query.slice(findByLecturers.length)

		await ctx.answerInlineQuery(
			namesList 
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
			await ctx.editMessageText(
				getDayInfo('info', getMenuOptions(ctx)),
				mainButtons()
			)
		} catch {
			await ctx.replyWithHTML(
				getDayInfo('info', getMenuOptions(ctx)),
				mainButtons()
			)
		}
	}
}
