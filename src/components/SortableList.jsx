import React, { useState, memo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ReactIcon } from 'src/components';
import './SortableList.css';

/**
 * A table formatted to look like a vertical list
 *
 * @param {Array<Object>} props.headers    Headers - each Object should contain `title` and `sortHandler` keys.
 *                                         `sortHandler` is a function that takes 2 parameters `items` and `polarity`
 *                                         Optionally pass an `initial` key to one Object to use it as the initial sort type
 * @param {Array<any>} props.items         Array of unsorted list items
 * @param {Function} props.children        Function that returns a component for an item from 
 *                                         the `items` array - should include the components wrapped
 *                                         inside a <tr key={something}></tr>
 */
export const SortableList = memo((props) => {
	const { headers, items } = props;
	const renderItem = props.children;

	// The index of the sort handler to use
	// Use the first available sort type passed into `headers` as the default
	let initialSortIndex = headers.findIndex(header => header.initial);
	if (initialSortIndex === -1) {
		initialSortIndex = headers.findIndex(header => header.sortHandler);
	}
	const [sortIndex, setSortIndex] = useState(initialSortIndex);

	// The polarity with which to sort
	const defaultSortPolarity = 1;
	const [sortPolarity, setSortPolarity] = useState(defaultSortPolarity);

	// Only render the polarity icon if the corresponding header is the one that is selected
	function renderPolarityIcon(headerIndex) {
		if (sortIndex === headerIndex) {
			if (sortPolarity === 1) {
				return <ReactIcon icon={FaSortUp} />;
			}
			else {
				return <ReactIcon icon={FaSortDown} />;
			}
		}
		else {
			return <ReactIcon icon={FaSort} />;
		}
	}

	function toggleSortIndex(index) {
		if (sortIndex === index) {
			setSortPolarity(sortPolarity * -1);
		}
		else {
			setSortIndex(index);
			setSortPolarity(defaultSortPolarity);
		}
	}

	function renderItems() {
		const sortHandler = headers[sortIndex].sortHandler;
		const sortedItems = sortHandler(items, sortPolarity);
		return sortedItems.map(renderItem);
	}

	return (
		<div className="overflow-x v-flex">
			<table className="sortablelist">
				<thead>
					<tr>
						{headers.map( (header, index) => (
							header.sortHandler ?
							<th key={index} 
								onClick={() => {toggleSortIndex(index)}}
								className="cursor-pointer">
								<div className="h-flex align-items-center">
									<span>{header.title}</span>
									<span className="pl-1 ml-auto">
										{renderPolarityIcon(index)}
									</span>
								</div>
							</th>
							:
							<th key={index}>{header.title}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{renderItems()}
				</tbody>
			</table>
		</div>
		);
});