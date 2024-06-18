import type { IParsedScheduleArray } from '@/types/schedule.type'
import { parseFromLink } from '@/utils/schedule-utils/parse-from-link/parse-from-link'

export const parseLink = async (
	link: string
): Promise<IParsedScheduleArray> => {
	return (await parseFromLink(link)) as IParsedScheduleArray
}
