export const jsonParser = (obj: { key: string; value: string }) => {
	const value = obj?.value

	if (typeof value !== 'string') return null

	return JSON.parse(value)
}
