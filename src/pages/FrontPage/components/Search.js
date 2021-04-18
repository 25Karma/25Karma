import React, { useState } from 'react';
import { FaUser, FaUsers, FaShieldAlt, FaScroll } from 'react-icons/fa';
import { Button, MinecraftText, ReactIcon, Searchbar } from 'components';

/*
* Searchbar with buttons to select a specific search type
*
* @param {String} defaultValue    The initial value to put inside of the searchbar
*/
export function Search(props) {
	const searchTypes = [
		{id: 'stats', name: 'Player', icon: FaUser },
		{id: 'guild', name: 'Guild', icon: FaShieldAlt },
		{id: 'friends', name: 'Friends', icon: FaUsers },
		{id: 'quests', name: 'Quests', icon: FaScroll },
	];
	const [searchType, setSearchType] = useState(searchTypes[0].id);

	return (
		<React.Fragment>
			<div className="py-1">
				<p className="pb-1 pl-2">
					<MinecraftText size="md">
						{`Search for the ${searchType} of a Hypixel player`}
					</MinecraftText>
				</p>
				<Searchbar defaultValue={props.defaultValue || ''} tag={searchType} />
			</div>
			<div className="py-1 h-flex overflow-x">
				{searchTypes.map((type, index) =>
					<div key={type.id} 
						className={index ? (index+1 === searchTypes.length ? "pl-1 mr-auto" : "px-1") : "ml-auto pr-1"}> 
						<Button 
							active={searchType === type.id}
							onClick={() => {setSearchType(type.id)}}
						>
							<div className="overflow-hidden p-1" style={{width: "6rem"}}>
								<ReactIcon icon={type.icon} size="lg" />
								<div className="pt-1">{type.name}</div>
							</div>
						</Button>
					</div>
				)}
			</div>
		</React.Fragment>
		);
}