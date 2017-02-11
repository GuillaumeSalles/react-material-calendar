// @flow

import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays, diffDays, startOfDay } from './dateUtils';

const referenceDate = new Date(2017,1,1);

type Props = {
	date: Date,
	onDateChange: (date: Date) => void,
	mode: 'day' | 'week' | '3days',
	onCreateEvent?: (start: Date, end: Date) => void
}

type State = {
	scrollPosition: number,
	isSwiping: boolean,
	newEvent: ?{
		start: Date,
		end: Date
	}
}

var modeNbOfDaysMap = {
	day: 1,
	'3days': 3,
	week: 7
}

class Scheduler extends Component {
	props: Props;
	state: State;

	constructor(props: Props) {
		super(props);

		this.state = {
			scrollPosition: 500,
			isSwiping: false,
			newEvent: null
		};
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return nextProps.date.getTime() !== this.props.date.getTime()
			|| nextProps.mode !== this.props.mode
			|| nextState.scrollPosition !== this.state.scrollPosition 
			|| nextState.isSwiping !== this.state.isSwiping
			|| nextState.newEvent !== this.state.newEvent;
	}

	render() {
		return (
			<VirtualizeSwipeableViews
				style={{ position: 'relative', height: '100%', width: '100%' }}
				slideStyle={{ height: '100%' }}
				containerStyle={{ height: '100%', willChange: 'transform' }}
				index={this.getIndex()}
				overscanSlideCount={1}
				slideRenderer={this.slideRenderer}
				onChangeIndex={this.onChangeIndex}
				onSwitching={this.onSwitching}/>
		)
	}

	onSwitching = (event: any, mode: 'move' | 'end') => {
		this.setState({
			isSwiping: mode === 'move'
		});
	}

	getIndex = () => diffDays(startOfDay(this.props.date), referenceDate) / modeNbOfDaysMap[this.props.mode];

	onChangeIndex = (index: number, indexLatest: number) => {
		return this.props.onDateChange(addDays(referenceDate, index * modeNbOfDaysMap[this.props.mode]));
	}

	slideRenderer = (slide: { key: number, index: number }) => {
		if(this.props.mode === 'day') {
			return (
				<div key={slide.key} style={{ position: 'relative', height: '100%', width: '100%' }}>
					<DayView 
						onScrollChange={this.onScrollChange} 
						scrollPosition={this.state.scrollPosition}
						date={addDays(referenceDate, slide.index)}
						isScrollDisable={this.state.isSwiping}
						onHourDividerClick={this.onSchedulerClick}
						newEvent={this.state.newEvent}
						onCreateEvent={this.onCreateEvent}>
						{
							this.props.children
						}
					</DayView>
				</div>
			);
		}

		return (
			<div key={slide.key} style={{ position: 'relative', height: '100%', width: '100%' }}>
				<MultipleDaysView 
					onScrollChange={this.onScrollChange} 
					scrollPosition={this.state.scrollPosition}
					dates={this.props.mode === 'week' ? this.getWeekDates(slide.index) : this.getThreeDaysDates(slide.index)}
					isScrollDisable={this.state.isSwiping}
					onHourDividerClick={this.onSchedulerClick}
					newEvent={this.state.newEvent}
					onCreateEvent={this.onCreateEvent}>
					{
						this.props.children
					}
				</MultipleDaysView>
			</div>
		);
	}

	getWeekDates = (index: number) => {
		var currentDay = addDays(referenceDate, index * 7);
		var dates = [];
    for(var i = 0; i < 7; i++) {
      dates.push(addDays(currentDay, i - currentDay.getDay()));
    }
		return dates;
	}

	getThreeDaysDates = (index: number) => {
		var currentDay = addDays(referenceDate, index * 3);
		var dates = [];
    for(var i = 0; i < 3; i++) {
      dates.push(addDays(currentDay, i));
    }
		return dates;
	}

	onScrollChange = (scrollPosition: number) => {
		this.setState({ scrollPosition: scrollPosition });
	}

	onSchedulerClick = (start: Date, end: Date) => {
		if(this.props.onCreateEvent != null) {
			this.setState({ newEvent : { start: start, end: end }});
		}
	}

	onCreateEvent = () => {
		if(this.props.onCreateEvent != null && this.state.newEvent != null) {
			this.props.onCreateEvent(this.state.newEvent.start, this.state.newEvent.end);
			this.setState({ 
				newEvent: null
			});
		}
	}
}

export default Scheduler;
