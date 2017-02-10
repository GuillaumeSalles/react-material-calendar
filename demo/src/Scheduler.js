// @flow

import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays, diffDays, addWeeks, diffWeeks } from './dateUtils';

const referenceDate = new Date(2017,1,1);

type Props = {
	date: Date,
	onDateChange: (date: Date) => void,
	mode: 'day' | 'week' | '3days'
}

type State = {
	scrollPosition: number,
	isSwiping: boolean
}

class Scheduler extends Component {
	props: Props;
	state: State;

	constructor(props: Props) {
		super(props);

		this.state = {
			scrollPosition: 500,
			isSwiping: false
		};
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return nextProps.date.getTime() !== this.props.date.getTime()
			|| nextProps.mode !== this.props.mode
			|| nextState.scrollPosition !== this.state.scrollPosition 
			|| nextState.isSwiping !== this.state.isSwiping;
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
					slideRenderer={this.slideRenderer}
					onChangeIndex={this.onChangeIndex}
					onSwitching={this.onSwitching}/>
			</div>
		)
	}

	onSwitching = (event, mode) => {
		this.setState({
			isSwiping: mode === 'move'
		});
	}

	getIndex = () => {
		if(this.props.mode === 'day') {
			return diffDays(this.props.date, referenceDate);
		} else if (this.props.mode === 'week') {
			return diffWeeks(this.props.date, referenceDate);
		} else if (this.props.mode === '3days') {
			return diffDays(this.props.date, referenceDate) / 3;
		}
	}

	onChangeIndex = (index: number, indexLatest: number): void => {
		if(this.props.mode === 'day') {
			this.props.onDateChange(addDays(referenceDate, index));
		} else if (this.props.mode === 'week') {
			this.props.onDateChange(addWeeks(referenceDate, index));
		} else if (this.props.mode === '3days') {
			this.props.onDateChange(addDays(referenceDate, index * 3));
		}
	};

	slideRenderer = (slide: { key: number, index: number }) => {
		if(this.props.mode === 'day') {
			return (
				<div key={slide.key} style={{ position: 'relative', height: '100%', width: '100%' }}>
					<DayView 
						onScrollChange={this.onScrollChange} 
						scrollPosition={this.state.scrollPosition}
						date={addDays(referenceDate, slide.index)}
						isScrollDisable={this.state.isSwiping}>
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
					isScrollDisable={this.state.isSwiping}>
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
}

export default Scheduler;
