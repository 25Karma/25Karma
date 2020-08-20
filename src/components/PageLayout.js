import React from 'react';
import './PageLayout.css';
import { Footer } from 'components';

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
				</div>
				<Footer />
			</div>
		</div>
		);
}