export const convertToTijuanaTime = (date: string | Date): string => {
	const d = new Date(date)
	return new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Tijuana",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	})
		.format(d)
		.replace(",", "")
}
