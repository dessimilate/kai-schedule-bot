import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { Injectable } from '@nestjs/common'
import { notificationsButtons } from '@/buttons/notification.buttons'
import { getMenuOptions } from '@/utils/bot-utils/getMenuOptions'
import { setNotificationTime } from '@/constants/buttons-names.constant'
import { closeButton } from '@/buttons/close.button'

@Injectable()
export class NotificationMenuService {
	constructor(private prisma: PrismaService) {}

	async offNotifications(ctx: Context) {
		ctx.session.notification_type = 'off'

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

	async beforeLastLesson(ctx: Context) {
		ctx.session.notification_type = 'duringTheLesson'

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

	async defaultNotifications(ctx: Context) {
		ctx.session.notification_type = 'default'

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

	async changeNotificationTime(ctx: Context) {
		const searchParam = ctx.inlineQuery.query.slice(setNotificationTime.length)
		const isCorrectInput = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(searchParam)

		await ctx.answerInlineQuery([
			{
				id: '0',
				type: 'article',
				title: `${isCorrectInput ? '✅' : '❌'}Например 17:35`,
				input_message_content: {
					message_text: isCorrectInput ? searchParam || '17:00' : '17:00'
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
			ctx.session.notification_time = [+time.slice(0, 2), +time.slice(3)]

			ctx.session.notification_type = 'atTheCertainTime'

			try {
				await ctx.deleteMessage(ctx.update.message.message_id)
			} catch {}

			// try {
			// 	await ctx.editMessageText(
			// 		getDayInfo('info', getMenuOptions(ctx)),
			// 		notificationsButtons(ctx.session.notification_type || 'off')
			// 	)
			// } catch {
			// 	await ctx.replyWithHTML(
			// 		getDayInfo('info', getMenuOptions(ctx)),
			// 		notificationsButtons(ctx.session.notification_type || 'off')
			// 	)
			// }
		}
	}
}
