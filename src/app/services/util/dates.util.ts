export function convertTimeZonedDate(date: Date): void {
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
}
