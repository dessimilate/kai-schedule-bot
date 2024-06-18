import type { IParsedScheduleArray } from '@/types/schedule.type'
import { parseFromLink } from '@/utils/schedule-utils/parse-from-link/parse-from-link'

export const parseLinks = async (
	link: string
): Promise<IParsedScheduleArray[]> => {
	return (await parseFromLink(link, true)) as IParsedScheduleArray[]
}
