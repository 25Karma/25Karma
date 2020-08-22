import React from 'react';
import './PageLayout.css';
import { Footer } from 'components';

/*
* Width-aware container to layout the page, contains a header and a body
* The body is separated into 4 parts: top, center, left, and right
*
* @param {JSX} props.header
* @param {JSX} props.top
* @param {JSX} props.center
* @param {JSX} props.left
* @param {JSX} props.right
*/
export function PageLayout(props) {
	return (
		<div className="h-100 v-flex">
			<div className="v-flex flex-1">
				{props.header}
				<div className="h-flex justify-content-center pt-4 pb-2">
					{props.top}
				</div>
				<div className="pagelayout pb-4 px-1">
					{props.left &&
						<div className="pagelayout-left px-1">
							{props.left}
						</div>
					}
					<div className="pagelayout-body px-1">
						{props.center}
					</div>
					{props.right &&
						<div className="pagelayout-left px-1">
							{props.right}
						</div>
					}
				</div>
				<Footer />
			</div>
		</div>
		);
}