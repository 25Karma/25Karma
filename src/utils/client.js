/**
 * Makes an HTTP GET request to a given resource
 */
export async function httpGet(resource, options) {
	return fetch(resource, options);
}

/**
 * Builds a Headers object that the client can include with its HTTP requests
 * 
 * @returns {Object} A Headers object containing key-value pairs of headers
 */
export async function getClientHeaders() {
	return new Headers();
}
