import React, { forwardRef, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './Checkbox.css';
import { ReactIcon } from 'src/components';

/**
 * Styled checkbox that can be toggled on/off 
 *
 * @param {boolean} props.defaultChecked    Default state of the checkbox
 * @param {Object} ref                      React Ref for accessing the checkbox
 */
export const Checkbox = forwardRef((props, ref) => {
	const defaultChecked = props.defaultChecked || false;
	const [isChecked, setChecked] = useState(defaultChecked);
	return (
		<div 
			className="checkbox-wrapper"
			onClick={() => {setChecked(!isChecked)}}>
			<span className="p-1">
				<span style={{opacity: isChecked ? 0 : 1}}>
					<ReactIcon icon={FaTimes} />
				</span>
			</span>
			<span className="p-1">
				<span style={{opacity: isChecked ? 1 : 0}}>
					<ReactIcon icon={FaCheck} />
				</span>
			</span>
			<input
				ref={ref}
				type="checkbox"
				checked={isChecked}
				readOnly />
		</div>
	);
});
