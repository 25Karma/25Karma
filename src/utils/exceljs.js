import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { APP } from 'src/constants/app';
import { dateFormat } from './dateformat';

/**
 * Creates an Excel workbook, populates it, and initiates a client-side download of the .xlsx file
 *
 * @param {string} filename      The name of the .xlsx file (Note that the actual file name will also have a timestamp 
 *                               appended to the end)
 * @param {Object} worksheets    Data for each worksheet to be included in the workbook
 *                               Each Object should contain a `title` key, a `rows` key, and a `columns` key
 *                               `rows` is an array of rows of unorganized data
 *                               `columns` is an array of Objects each containing a `title` key and a `from` key
 *                               `from` is the function used to pick the desired data out of each given row
 */
export function exportXLSX(filename, ...worksheets) {

	// Create a workbook
	const workbook = new ExcelJS.Workbook();
	workbook.creator = APP.appName;
	workbook.lastModifiedBy = APP.appName;
	worksheets.forEach((ws) => {createWorksheet(ws)})

	function createWorksheet(worksheetData) {
		const { title, rows, columns } = worksheetData;
		const worksheet = workbook.addWorksheet(title);

		// Column titles
		worksheet.columns = columns.map((c) => ({header: c.title, key: c.title}));
		worksheet.getRow(1).font = {bold: true};

		// Populate each row with data corresponding to the column
		for (const row of rows) {
			let rowValues = [];
			for (const {from} of columns) {
				rowValues.push(from(row));
			}
			worksheet.addRow(rowValues);
		}

		// Adjust column widths so that they fit the data
		worksheet.columns.forEach((column) => {
			const longestEntryLength = column.values
				.map((v) => v.toString().length)
				.reduce((a,b) => 
				a > b ? a : b);
			if (longestEntryLength > 12) {
				// (plus 2 for padding)
				column.width = longestEntryLength+2;
			}
			else {
				column.width = 12;
			}
		})
	}

	// Initiate a client-side download of the .xlsx file
	// https://github.com/exceljs/exceljs/issues/354#issuecomment-325764873
	workbook.xlsx.writeBuffer().then(
		function(data) {
			const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
			saveAs(blob, `${filename} ${dateFormat(Date.now())}`);
		}
	)
}