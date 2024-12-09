import { dateRegExp } from '@/constants/regexp/date.regexp'

export const findDateInText = (text: string) => {
	const arr = text.match(dateRegExp)

	if (Array.isArray(arr)) {
		return arr[0]
	} else {
		return 'no date'
	}
}

// else if (daysOfWeek.includes(text.toLowerCase())) {

// }
