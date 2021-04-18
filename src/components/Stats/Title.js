import React from 'react';

export function Title(props) {
	const { children } = props;
	return (
		<div className="font-bold font-md text-center mt-3 mb-1">
			{children}
		</div>
		);	
}