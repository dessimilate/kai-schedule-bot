import { closeButton } from '@/buttons/close.button'
import { coursesKey } from '@/constants/info-db.constant'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { returnLecturersSchedule } from '@/utils/display-utils/lecturers-schedule'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByLecturersService {
	constructor(private prisma: PrismaService) {}

	async findByLecturers(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		const lecturer = ctx.match[1]

		const lecturersSchedule = await this.prisma.lecturersSchedule.findUnique({
			where: { lecturer },
			select: { lecturer: true, row: true }
		})

		if (!lecturersSchedule.row.length) {
			await ctx.replyWithHTML('🔴 Нет расписания 🔴', closeButton())
			return
		}

		const messages = returnLecturersSchedule(lecturersSchedule.row, lecturer)

		if (!messages) {
			await ctx.replyWithHTML('🔴 Нет расписания 🔴', closeButton())
			return
		}

		for (const message of messages) {
			await ctx.replyWithHTML(message, closeButton())
		}
	}
}
