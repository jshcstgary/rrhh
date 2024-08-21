export function removeExtraSpaces(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}