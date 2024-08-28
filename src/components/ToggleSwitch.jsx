import React, { useState } from 'react';
import './ToggleSwitch.css';

/**
 * A basic toggle switch
 *
 * @param {Function} props.onChange    Function should take 1 parameter for the state
 * @param {boolean} props.checked      Whether the switch should be checked by default
 * @param {string} props.onColor       Color of switch when checked
 * @param {string} props.offColor      Color of switch when unchecked
 */
export function ToggleSwitch(props) {

	const offColor = props.offColor;
	const onColor = props.onColor;
	const [checked, setChecked] = useState(props.checked);

	function handleChange(event) {
		setChecked(event.target.checked);
		if (props.onChange) {
			props.onChange(event.target.checked);
		}
	}

	return (
		<label 
			className="toggleswitch"
			style={{ background : (checked ? onColor || '#2b2' : offColor || '#999') }}>
			<input onChange={handleChange} type="checkbox" defaultChecked={props.checked} />
			<div className={`toggleswitch-handle toggleswitch-handle-${checked ? 'on' : 'off'}`}></div>
		</label>
		);
}