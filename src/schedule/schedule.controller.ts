import { Controller, Get } from '@nestjs/common'
import { ScheduleService } from '@/schedule/schedule.service'

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Get()
	async getSchedule() {
		return await this.scheduleService.getTelegrafSessions()
	}
}
