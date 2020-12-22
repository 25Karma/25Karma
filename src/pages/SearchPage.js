import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

/*
* Default destination for all searches
* Will redirect to the appropriate stats page based on the search slug
* Users can submit a tag after the player name to navigate to different pages (ex. "Technoblade#guild")
*/
export function SearchPage(props) {
	const { slug } = useParams();

	// Split input value into its arguments and trim whitespace
	const inputValues = slug
		.replace(/\s+/g, " ") // trim multiple consecutive spaces down to only one space
		.trim() // trim white space off ends of string
		.split(" ", 2); // split into 2 first parameters
	const player = inputValues[0];
	const tag = inputValues[1] && inputValues[1].toLowerCase();
	if (player !== '') {
		// Redirect page based on tag
		if (tag === 'guild' || tag === 'g') {
			return <Redirect to={`/guild/${player}`} />;
		}
		else if (tag === 'friends' || tag === 'f') {
			return <Redirect to={`/friends/${player}`} />;
		}
		else {
			return <Redirect to={`/player/${player}`} />;
		}
	}
	else {
		return <Redirect to={'/frontpage'} />
	}
}