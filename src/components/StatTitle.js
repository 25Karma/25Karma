import React from 'react';

export function StatTitle(props) {
	const { children } = props;
	return (
		<div className="font-bold font-md text-center mt-3 mb-2">
			{children}
		</div>
		);	
}