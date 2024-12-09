import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { PrismaService } from '@/prisma.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'

@Module({
	controllers: [NotificationController],
	providers: [NotificationService, PrismaService, ScheduleMenuService],
	exports: [NotificationModule]
})
export class NotificationModule {}
