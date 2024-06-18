import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { ISchedule } from './types/main.type'
import { telegrafSessions } from '@prisma/client'
import { sessionType } from './types/context.interface'

@Injectable()
export class AppService {
	constructor(private prisma: PrismaService) {}
}
