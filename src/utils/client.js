/*
 * Makes an HTTP GET request to a given resource.
*/
export async function httpGet(resource, options) {
	return fetch(resource, options);
}

/*
 * Returns a key-value pair of the header the client should include with its HTTP requests.
 * 
 * @return {JSON} JS object containing a key and a value.
 */
export async function getClientHeaders() {
	return new Headers();
}
