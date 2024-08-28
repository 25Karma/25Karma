import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './PageLayout.css';
import { Banner, Footer, Navbar, Support } from 'src/components';

/**
 * Width-aware container to layout the page
 * The body is separated into 4 parts: top, center, left, and right
 *
 * @param {boolean} props.searchbar    Whether to include a searchbar in the Navbar
 * @param {JSX} props.top
 * @param {JSX} props.center
 * @param {JSX} props.left
 * @param {JSX} props.right
 */
export function PageLayout(props) {

	return (
		<React.Fragment>
			<Support />
			<Navbar searchbar={props.searchbar} />
			{props.top &&
				<div className="h-flex justify-content-center pt-4 pb-2">
					{props.top}
				</div>
			}
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
			<Banner />
			<ReactTooltip/>
		</React.Fragment>
		);
}