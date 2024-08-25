/*
 * Makes an HTTP GET request to a given resource.
*/
export async function httpGet(resource, options) {
	return fetch(resource, options);
}

/*
 * Returns a key-value pair of headers the client should include with its HTTP requests.
 * 
 * @return {JSON} A Headers object.
 */
export async function getClientHeaders() {
	return new Headers();
}
