import { csvData } from "./csvData"
import { articles_list } from "./articles"
import Papa from "papaparse"
import { clients } from "./clients"

type Record = {
	[key: string]: any
}

export const orgLists = () => {
	const parseCSV = (csv: string): Record[] => {
		const [headerLine, ...lines] = csv.trim().split("\n")
		const headers = headerLine.split(",")

		return lines.map((line) => {
			const values = line.split(",")
			const record: Record = {}
			headers.forEach((header, index) => {
				record[header.trim()] = values[index]?.trim() || null
			})
			return record
		})
	}

	return parseCSV(csvData)
}

export const productsLists = () => {
	const parseCSV = (csv: string) => {
		const parsed = Papa.parse(csv, {
			header: true, // Usa la primera línea como encabezados
			skipEmptyLines: true, // Ignora líneas vacías
		})

		// Limpia las comillas escapadas de los valores
		const cleanedData = parsed.data.map((record: Record) => {
			const cleanedRecord: Record = {}
			for (const key in record) {
				if (record.hasOwnProperty(key)) {
					const originalValue = record[key]
					let cleanedValue: any = originalValue
						? originalValue.replace(/\\+"/g, '"').replace(/^"|"$/g, "") // Reemplaza \" por ", elimina comillas externas
						: null

					// Si la clave es 'price' o 'count', convierte el valor a un número
					if (key === "price" || key === "count") {
						cleanedValue = cleanedValue ? parseFloat(cleanedValue) : null
					}

					cleanedRecord[key] = cleanedValue
				}
			}
			return cleanedRecord
		})

		return cleanedData
	}

	return parseCSV(articles_list)
}

export const clientsLists = () => {
	const parseCSV = (csv: string) => {
		const parsed = Papa.parse(csv, {
			header: true, // Usa la primera línea como encabezados
			skipEmptyLines: true, // Ignora líneas vacías
		})

		const clientsMap = new Map() // Mapa para agrupar clientes por sn_code

		parsed.data.forEach((record: Record) => {
			const cleanedRecord: Record = {}
			for (const key in record) {
				if (record.hasOwnProperty(key)) {
					const originalValue = record[key]
					let cleanedValue: any = originalValue
						? originalValue.replace(/\\+"/g, '"').replace(/^"|"$/g, "") // Reemplaza \" por ", elimina comillas externas
						: null

					// Si la clave es 'price' o 'count', convierte el valor a un número
					if (key === "price" || key === "count") {
						cleanedValue = cleanedValue ? parseFloat(cleanedValue) : null
					}

					// Reemplaza "-Ningún empleado del departamento de ventas-" por null
					if (cleanedValue === "-Ning�n empleado del departamento de ventas-") {
						cleanedValue = null
					}

					cleanedRecord[key] = cleanedValue
				}
			}

			const sn_code = cleanedRecord.sn_code || null
			const contact_email = cleanedRecord.contact_email || null

			const contact = {
				contact_person_name: cleanedRecord.contact_person_name || null,
				first_name: cleanedRecord.first_name || null,
				last_name: cleanedRecord.last_name || null,
				contact_phone: cleanedRecord.contact_phone || null,
				contact_email: contact_email,
			}

			// Eliminamos los campos que ahora están en contacts
			delete cleanedRecord.contact_person_name
			delete cleanedRecord.first_name
			delete cleanedRecord.last_name
			delete cleanedRecord.contact_phone
			delete cleanedRecord.contact_email

			if (clientsMap.has(sn_code)) {
				const existingClient = clientsMap.get(sn_code)
				// Si el email de contacto no existe en el array de contactos, lo agregamos
				const emailExists = existingClient.contacts.some(
					(c: any) => c.contact_email === contact_email
				)

				if (!emailExists) {
					existingClient.contacts.push(contact)
				}
			} else {
				// Crear un nuevo cliente con el array de contactos
				cleanedRecord.contacts = contact_email ? [contact] : []
				clientsMap.set(sn_code, cleanedRecord)
			}
		})

		return Array.from(clientsMap.values())
	}

	return parseCSV(clients)
}
