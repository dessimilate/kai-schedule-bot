import { Module } from '@nestjs/common'
import { ScheduleService } from '@/schedule/schedule.service'
import { ScheduleController } from '@/schedule/schedule.controller'
import { PrismaService } from '@/prisma.service'

@Module({
	controllers: [ScheduleController],
	providers: [ScheduleService, PrismaService]
})
export class ScheduleModule {}
