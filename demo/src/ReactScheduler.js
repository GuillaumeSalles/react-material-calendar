import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import { addDays, diffDays } from './dateUtils';

const referenceDate = new Date(2017,1,1);

class Scheduler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollPosition: 500
		};
	}

	render() {
		return (
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
				<VirtualizeSwipeableViews
					style={{ position: 'relative', height: '100%' }}
					slideStyle={{ height: '100%' }}
					containerStyle={{ height: '100%' }}
					index={diffDays(this.props.date, referenceDate)}
					overscanSlideCount={1}
					slideRenderer={this.slideRenderer}
					onChangeIndex={this.onChangeIndex}/>
			</div>
		)
	}

	onChangeIndex = (index, indexLatest) => {
		this.props.onDateChange(addDays(referenceDate, index));
	};

	slideRenderer = ({key, index}) => {
		var date = addDays(referenceDate, index);
		return (
			<div key={key} style={{ position: 'relative', height: '100%' }}>
				<DayView 
					appointments={this.props.appointments}
					onScrollChange={this.onScrollChange} 
					scrollPosition={this.state.scrollPosition}
					date={date}
					dayViewItemFactory={this.props.dayViewItemFactory}/>
			</div>
		);
	}

	onScrollChange = (scrollPosition) => {
		this.setState({ scrollPosition: scrollPosition });
	}
}

export default Scheduler;
