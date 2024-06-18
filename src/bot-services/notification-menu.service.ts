import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { Injectable } from '@nestjs/common'
import { notificationsButtons } from '@/buttons/notification.buttons'
import { getMenuOptions } from '@/utils/bot-utils/get-menu-options'
import { setNotificationTime } from '@/constants/buttons-names.constant'
import { closeButton } from '@/buttons/close.button'
import {
	editNotificationMenu,
	sendNotificationMenu
} from '@/utils/bot-utils/notification-menu'

@Injectable()
export class NotificationMenuService {
	constructor(private prisma: PrismaService) {}

	async offNotifications(ctx: Context) {
		ctx.session.notification_type = 'off'

		try {
			await editNotificationMenu(ctx)
		} catch {
			try {
				await ctx.deleteMessage(ctx.session.start_message_id)
			} catch {}

			await sendNotificationMenu(ctx)
		}
	}

	async beforeLastLesson(ctx: Context) {
		ctx.session.notification_type = 'duringTheLesson'

		try {
			await editNotificationMenu(ctx)
		} catch {
			try {
				await ctx.deleteMessage(ctx.session.start_message_id)
			} catch {}

			await sendNotificationMenu(ctx)
		}
	}

	async defaultNotifications(ctx: Context) {
		ctx.session.notification_type = 'default'

		try {
			await editNotificationMenu(ctx)
		} catch {
			try {
				await ctx.deleteMessage(ctx.session.start_message_id)
			} catch {}

			await sendNotificationMenu(ctx)
		}
	}

	async changeNotificationTime(ctx: Context) {
		const searchParam = ctx.inlineQuery.query.slice(setNotificationTime.length)
		const isCorrectInput = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(searchParam)

		if (searchParam === '14:88') {
			await ctx.answerInlineQuery([
				{
					id: '0',
					type: 'article',
					title: 'Иди нахуй',
					input_message_content: {
						message_text: 'Иди нахуй'
					}
				}
			])

			return
		}

		await ctx.answerInlineQuery([
			{
				id: '0',
				type: 'article',
				title: `${isCorrectInput ? '✅ - Нажмите сюда' : '❌ - Например 17:30'}`,
				input_message_content: {
					message_text: isCorrectInput ? searchParam : '17:00'
				}
			}
		])
	}

	async setNotificationTime(ctx: Context) {
		const time = ctx.match[0]

		if (!time) {
			await ctx.reply('Проблемы с вводом', closeButton())
			return
		}

		if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
			ctx.session.notification_time = time

			ctx.session.notification_type = 'atTheCertainTime'

			try {
				await ctx.deleteMessage(ctx.update.message.message_id)
			} catch {}

			try {
				await editNotificationMenu(ctx)
			} catch {
				try {
					await ctx.deleteMessage(ctx.session.start_message_id)
				} catch {}

				await sendNotificationMenu(ctx)
			}
		}
	}
}
