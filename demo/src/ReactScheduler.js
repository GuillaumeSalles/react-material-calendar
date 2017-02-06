// @flow

import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import { addDays, diffDays } from './dateUtils';

const referenceDate = new Date(2017,1,1);

type Props = {
	date: Date,
	appointments: [{
		start: Date,
		end: Date
	}],
	onDateChange: (date: Date) => void
}

type State = {
	scrollPosition: number
}

class Scheduler extends Component {
	props: Props;
	state: State;

	constructor(props: Props) {
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

	onChangeIndex = (index: number, indexLatest: number) => {
		this.props.onDateChange(addDays(referenceDate, index));
	};

	slideRenderer = (slide: { key: number, index: number }) => {
		var date = addDays(referenceDate, slide.index);
		return (
			<div key={slide.key} style={{ position: 'relative', height: '100%' }}>
				<DayView 
					appointments={this.props.appointments}
					onScrollChange={this.onScrollChange} 
					scrollPosition={this.state.scrollPosition}
					date={date}/>
			</div>
		);
	}

	onScrollChange = (scrollPosition: number) => {
		this.setState({ scrollPosition: scrollPosition });
	}
}

export default Scheduler;
