import React, { useState } from 'react';
import { Button, MinecraftText, ReactIcon, Searchbar } from 'src/components';
import { PAGES } from 'src/constants/app';

/**
 * Searchbar with buttons to select a specific search type
 *
 * @param {string} props.defaultValue    The initial value to put inside of the searchbar
 */
export function Search(props) {
	const [searchType, setSearchType] = useState(PAGES[0]);

	return (
		<React.Fragment>
			<div className="py-1">
				<div className="pb-1 pl-2">
					<h1><MinecraftText size="md">{searchType.about}</MinecraftText></h1>
				</div>
				<Searchbar defaultValue={props.defaultValue || ''} tag={searchType.tags[0]} />
			</div>
			<div className="py-1 h-flex overflow-x">
				{PAGES.map((type, index) =>
					<div key={type.path} 
						className={index ? (index+1 === PAGES.length ? "pl-1 mr-auto" : "px-1") : "ml-auto pr-1"}> 
						<Button 
							active={searchType.path === type.path}
							onClick={() => {setSearchType(type)}}
						>
							<div className="overflow-hidden p-1" style={{width: "7.5rem"}}>
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