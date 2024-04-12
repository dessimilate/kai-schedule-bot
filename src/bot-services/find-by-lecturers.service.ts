import { closeButton } from '@/buttons/close.button'
import { lecturersKey, schedulesKey } from '@/constants/scheduleKeys.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { returnLecturers } from '@/utils/display-utils/returnLecturers'
import { jsonParser } from '@/utils/jsonParser'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByLecturersService {
	constructor(private prisma: PrismaService) {}

	async findByLecturers(ctx: Context) {
		const names: string[] = jsonParser(
			await this.prisma.schedule.findUnique({
				where: { key: lecturersKey }
			})
		)

		const name = ctx.match[1]

		if (!names.includes(name)) {
			await ctx.reply('Такого преподавателя не существует', closeButton())
			return
		}

		const text = returnLecturers(
			jsonParser(
				await this.prisma.schedule.findUnique({ where: { key: schedulesKey } })
			),
			name
		).reduce(
			(res: string[], el) => {
				const lastEL = res.pop()
				if (lastEL.length + el.length > 4000) {
					res.push(lastEL, el)
				} else {
					res.push(`${lastEL}\n\n${el}`)
				}

				return res
			},
			['']
		)

		for (let i = 0; i < text.length; i++) {
			await ctx.replyWithHTML(text[i], closeButton())
		}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}
	}
}
