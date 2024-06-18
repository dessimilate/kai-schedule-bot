import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { AppService } from '@/app.service'
import { PrismaService } from '@/prisma.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'

@Module({
	controllers: [NotificationController],
	providers: [
		NotificationService,
		PrismaService,
		AppService,
		ScheduleMenuService
	],
	exports: [NotificationModule]
})
export class NotificationModule {}
