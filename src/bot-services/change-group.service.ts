import { closeButton } from '@/buttons/close.button'
import { mainButtons } from '@/buttons/main.buttons'
import { groupsKey } from '@/constants/scheduleKeys.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { getMenuOptions } from '@/utils/bot-utils/getMenuOptions'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { jsonParser } from '@/utils/jsonParser'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeGroupService {
	constructor(private prisma: PrismaService) {}

	async onChangeGroup(ctx: Context) {
		const groupList: string[] = jsonParser(
			await this.prisma.schedule.findUnique({
				where: { key: groupsKey }
			})
		)

		const group = ctx.match[1]

		if (typeof +group !== 'number') {
			await ctx.reply('Проблемы с вводом', closeButton())
			return
		}

		if (!groupList.includes(group)) {
			await ctx.reply('Такой группы не существует', closeButton())
			return
		}

		ctx.session.group = group

		try {
			await ctx.deleteMessage(ctx.session.start_message_id)
		} catch {}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		const message = await ctx.reply(
			getDayInfo('info', getMenuOptions(ctx)),
			mainButtons()
		)

		ctx.session.start_message_id = message.message_id
	}
}
