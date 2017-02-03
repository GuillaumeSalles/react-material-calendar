import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import { addDays, diffDays } from './dateUtils';

const referenceDate = new Date(2017,1,1);

class Scheduler extends Component {
	render() {
		return (
      <VirtualizeSwipeableViews
        index={diffDays(this.props.date, referenceDate)}
        overscanSlideCount={1}
        slideRenderer={this.slideRenderer}
        onChangeIndex={this.onChangeIndex} />
		)
	}

	onChangeIndex = (index, indexLatest) => {
		this.props.onDateChange(addDays(referenceDate, index));
	};

	slideRenderer = ({key, index}) => {
		var date = addDays(referenceDate, index);
		return (
			<div key={key}>
				<DayView 
					appointments={this.props.appointments} 
					date={date}/>
			</div>
		);
	}
}

export default Scheduler;
