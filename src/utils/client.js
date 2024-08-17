/*
 * Returns a key-value pair of the header the client should include with its HTTP requests.
 * 
 * @return {JSON} JS object containing a key and a value.
 */
export function getClientHeaders() {
	const clientHeader = getHeader();
	const headers = new Headers();
	headers.append(clientHeader.key, clientHeader.values[0]);
	return headers;
}

function getHeader() {
	return { key: null, values: [] };
}