import axios from 'axios'
import { parseToHtml } from '@/utils/schedule-utils/parse-to-html'
import { BadRequestException } from '@nestjs/common'

export const getLinks = async () => {
	const { data } = await axios.get<string>(process.env.SCHEDULE_LINK)

	if (!data) {
		throw new BadRequestException(
			`schedule page not found at link: ${process.env.SCHEDULE_LINK}`
		)
	}

	const tables = parseToHtml(data).querySelectorAll('table')

	const lessonsLinks = (table: HTMLTableElement): string[] => {
		return [...table.querySelectorAll('a')].map(el => el.href)
	}

	const linksArr1 = lessonsLinks(tables[0])
	const linksArr2 = lessonsLinks(tables[1])

	if (linksArr1.length !== 16 || linksArr2.length !== 13) {
		throw new BadRequestException(
			'schedule html tables changed or page wrong load'
		)
	}

	return {
		schedule: linksArr1,
		session: linksArr2.slice(0, 8),
		sessionRepeat: linksArr2[8]
	}
}
