export const findDateInText = (text: string) => {
	const arr = text.match(/\d{2}\.\d{2}/g)
	if (Array.isArray(arr)) {
		return arr[0]
	} else {
		return 'no date'
	}
}
