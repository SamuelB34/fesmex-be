export const getCurrentWeekRange = () => {
	const timeZone = "America/Tijuana"
	// Obtener la fecha actual ajustada a la zona horaria de Tijuana
	const now = new Date(new Date().toLocaleString("en-US", { timeZone }))

	// Calcular el día de la semana local (0 = domingo, 1 = lunes, etc.)
	const dayOfWeek = now.getDay()
	const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

	// Calcular el inicio de la semana (lunes) en hora local
	const startOfWeek = new Date(now)
	startOfWeek.setDate(now.getDate() + diffToMonday)
	startOfWeek.setHours(0, 0, 0, 0)

	// Calcular el fin de la semana (domingo) en hora local, con 23:59:59 exactos
	const endOfWeek = new Date(startOfWeek)
	endOfWeek.setDate(startOfWeek.getDate() + 6)
	endOfWeek.setHours(23, 59, 59, 0)

	// Reconstruir las fechas usando Date.UTC con los componentes locales, "fingiendo" que son UTC
	const startUTC = new Date(
		Date.UTC(
			startOfWeek.getFullYear(),
			startOfWeek.getMonth(),
			startOfWeek.getDate(),
			startOfWeek.getHours(),
			startOfWeek.getMinutes(),
			startOfWeek.getSeconds()
		)
	)
	const endUTC = new Date(
		Date.UTC(
			endOfWeek.getFullYear(),
			endOfWeek.getMonth(),
			endOfWeek.getDate(),
			endOfWeek.getHours(),
			endOfWeek.getMinutes(),
			endOfWeek.getSeconds()
		)
	)

	// Formatear a ISOString sin milisegundos
	const formatDate = (date: Date) =>
		date.toISOString().replace(/\.\d{3}Z$/, "Z")

	return {
		start: formatDate(startUTC),
		end: formatDate(endUTC),
	}
}

export const getCurrentDateTime = () => {
	const timeZone = "America/Tijuana"
	const now = new Date()

	// Convertir a la zona horaria de Tijuana
	const currentTijuanaTime = new Date(now.toLocaleString("en-US", { timeZone }))

	// Formatear la fecha sin milisegundos
	const formatDate = (date) => date.toISOString().replace(/\.000Z$/, "Z")

	return formatDate(currentTijuanaTime)
}

export const convertToTijuanaTime = (inputDate: string | Date): string => {
	const timeZone = "America/Tijuana"
	const date = new Date(inputDate)

	// Convertir la fecha a la zona horaria de Tijuana
	const tijuanaTime = new Date(date.toLocaleString("en-US", { timeZone }))

	// Función para formatear la fecha sin milisegundos
	const formatDate = (date: Date): string =>
		date.toISOString().replace(/\.000Z$/, "Z")

	return formatDate(tijuanaTime)
}
