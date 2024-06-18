import { closeButton } from '@/buttons/close.button'
import { coursesKey } from '@/constants/info-db.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { sendMainMenu } from '@/utils/bot-utils/main-menu'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeGroupService {
	constructor(private prisma: PrismaService) {}

	async onChangeGroup(ctx: Context) {
		const courses = (
			await this.prisma.info.findUnique({
				where: { key: coursesKey }
			})
		).value

		const course = ctx.match[1]

		if (typeof +course !== 'number') {
			await ctx.reply('Проблемы с вводом', closeButton())
			return
		}

		if (!courses.includes(course)) {
			await ctx.reply('Такой группы не существует', closeButton())
			return
		}

		ctx.session.group = course

		try {
			await ctx.deleteMessage(ctx.session.start_message_id)
		} catch {}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		const message = await sendMainMenu(ctx)
	}
}
