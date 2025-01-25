import { csvData } from "./csvData"
import { articles_list } from "./articles"
import Papa from "papaparse"

type Record = {
	[key: string]: string | null
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
