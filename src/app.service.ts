import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { ISchedule } from './types/main.type'
import { telegrafSessions } from '@prisma/client'
import { sessionType } from './types/context.interface'

@Injectable()
export class AppService {
	constructor(private prisma: PrismaService) {}

	async getSchedule(): Promise<ISchedule[]> {
		const data = await this.prisma.schedule.findUnique({
			where: { key: 'schedule' }
		})

		return data?.value ? JSON.parse(data?.value) : null
	}

	async getLecturers(): Promise<string[]> {
		const data = await this.prisma.schedule.findUnique({
			where: { key: 'lecturers' }
		})

		return data?.value ? JSON.parse(data?.value) : null
	}

	async getTelegrafSession(id: number | string) {
		const data = (await this.prisma.telegrafSessions.findMany())
			.map(
				el => ((el.session = JSON.parse(el?.session ? el?.session : '{}')), el)
			)
			.find(el => +el.key.slice(0, el.key.indexOf(':')) === +id)

		data.key = data.key.slice(0, data.key.indexOf(':'))

		return data
	}

	async getTelegrafSessions() {
		const data = await this.prisma.telegrafSessions.findMany()

		const sessions: {
			key: string
			session: sessionType
		}[] = []

		data.forEach((el, i) => {
			sessions.push({
				key: el?.key?.slice(0, el?.key?.indexOf(':')),
				session: JSON.parse(el?.session ? el?.session : '{}')
			})
		})

		return sessions
	}
}
