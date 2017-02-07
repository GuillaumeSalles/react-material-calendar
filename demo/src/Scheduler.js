// @flow

import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import WeekView from './WeekView';
import { addDays, diffDays, addWeeks, diffWeeks } from './dateUtils';

const referenceDate = new Date(2017,1,1);

type Props = {
	date: Date,
	onDateChange: (date: Date) => void,
	mode: 'DAY' | 'WEEK'
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
					index={this.getIndex()}
					overscanSlideCount={1}
					slideRenderer={this.getSlideRenderer()}
					onChangeIndex={this.onChangeIndex}/>
			</div>
		)
	}

	getIndex = () => {
		if(this.props.mode === 'DAY') {
			return diffDays(this.props.date, referenceDate);
		} else if (this.props.mode === 'WEEK') {
			return diffWeeks(this.props.date, referenceDate);
		}
	}

	getSlideRenderer = () => {
		if(this.props.mode === 'DAY') {
			return this.slideRenderer;
		} else if (this.props.mode === 'WEEK') {
			return this.weekRenderer;
		}
	}

	onChangeIndex = (index: number, indexLatest: number): void => {
		if(this.props.mode === 'DAY') {
			this.props.onDateChange(addDays(referenceDate, index));
		} else if (this.props.mode === 'WEEK') {
			this.props.onDateChange(addWeeks(referenceDate, index));
		}
	};

	slideRenderer = (slide: { key: number, index: number }) => {
		var date = addDays(referenceDate, slide.index);
		return (
			<div key={slide.key} style={{ position: 'relative', height: '100%' }}>
				<DayView 
					onScrollChange={this.onScrollChange} 
					scrollPosition={this.state.scrollPosition}
					date={date}>
					{
						this.props.children
					}
				</DayView>
			</div>
		);
	}

	weekRenderer = (slide: { key: number, index: number }) => {
		var date = addWeeks(referenceDate, slide.index);
		return (
			<div key={slide.key} style={{ position: 'relative', height: '100%' }}>
				<WeekView 
					onScrollChange={this.onScrollChange} 
					scrollPosition={this.state.scrollPosition}
					date={date}>
					{
						this.props.children
					}
				</WeekView>
			</div>
		);
	}

	onScrollChange = (scrollPosition: number) => {
		this.setState({ scrollPosition: scrollPosition });
	}
}

export default Scheduler;
