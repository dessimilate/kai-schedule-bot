export interface ISchedule {
	course: string
	schedule?: {
		odd: { [key: string]: [string, string][] }
		even: { [key: string]: [string, string][] }
	}
	session?: { [key: string]: [string, string][] }
	sessionRepeat?: [string, string, string][]
}
