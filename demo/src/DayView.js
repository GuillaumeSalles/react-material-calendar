// @flow
import React from 'react';
import { addDays } from './dateUtils';
import { every } from './utils';

type Event = {
	props: {
		start: Date,
		end: Date,
		style?: any
	}
}

type Column = {
	column: number,
	over: number
}

type DayViewItem = {
	x: number,
	y: number,
	height: number,
	width: number,
	event: Event		
}

const height = 1700;

function getEventsBetweenDates(events, start, end) {
	return events
		.filter(event => event.props.start < end && event.props.end > start);
}

function getEventColumn(event: Event, columnsLastDate: Date[]): number {
	for (let i = 0; i < columnsLastDate.length; i++) {
		if (event.props.start >= columnsLastDate[i]) {
			return i;
		}
	}
	return columnsLastDate.length;
}

function getEventsColumns(events: Event[]) : Column[] {
	let columnsLastDate = [];
	const results = [];
	let nextOverIndex = 0;

	function setOverColumnOnEventGroup(end) {
		for (let j = nextOverIndex; j < end; j++) {
			results[j].over = columnsLastDate.length;
		}
		columnsLastDate = [];
		nextOverIndex = end;
	}

	for (let i = 0; i < events.length; i++) {
		const app = events[i];
		let column;

		if (columnsLastDate.length !== 0 && every(columnsLastDate, d => app.props.start >= d)) {
			setOverColumnOnEventGroup(i);
		}

		column = getEventColumn(app, columnsLastDate);
		columnsLastDate[column] = app.props.end;
		results.push({ column: column, over: -1 });
	}

	setOverColumnOnEventGroup(events.length);

	return results;
}

function eventsToDayViewItems(events: Event[], date: Date) {
	const sortedEvents = events;
    //.sort((a, b) => a.start.localeCompare(b.start));
	const eventsColumn = getEventsColumns(sortedEvents);
	return sortedEvents
		.map((event, i) => ({
			x: eventsColumn[i].column / eventsColumn[i].over,
			y: ((event.props.start.getTime() - date.getTime()) / 60000 / 1440),
			width: (1 / eventsColumn[i].over),
			height: ((event.props.end.getTime() - event.props.start.getTime()) / 60000 / 1440),
			event: event
		}));
}

function toPercent(i) {
	return (i * 100) + '%';
}

function isToday(date) {
	var diff = new Date().getTime() - date.getTime();
	return diff > 0 && diff < (3600 * 1000 * 24);
}

var weekDayFormatter = new Intl.DateTimeFormat(window.navigator.language, { weekday: 'short' });
var dayFormatter = new Intl.DateTimeFormat(window.navigator.language, { day: 'numeric' });

type Props = {
	date: Date;
	scrollPosition: number;
	onScrollChange: (number) => void;
	children: Event[]
}

class DayView extends React.Component {
	scrollViewer: any;
	props: Props;

	render() {
		var events = getEventsBetweenDates(
			this.props.children, 
			this.props.date, 
			addDays(this.props.date,1));
		return (
			<div style={{ height: '100%', position: 'relative', overflowY: 'hidden' }}>
				<div 
					ref={elem => {
						if(elem != null) {
							this.scrollViewer = elem;
							elem.scrollTop = this.props.scrollPosition;
						}
					}}
					onTouchStart={(e) => setTimeout(() => this.props.onScrollChange(this.scrollViewer.scrollTop),100)}
					style={{ height: '100%', position: 'relative', overflowY: 'auto' }}>
					{
						renderHours()
							.concat(this.renderEventsContainer(events, this.props.date))
					}
				</div>
				{
					this.renderCurrentDay()
				}
			</div>
		);
	}

	renderHoursDividers() {
		var dividers = [];
		for(var i = 0; i < 24; i++) {
			dividers.push(
				<div 
					key={i + 'divider'} 
					style={getHourDividerStyle(i)}>
				</div>
			);
		}
		return dividers;
	}

	renderCurrentDay() {
		return (
			<div style={{ 
				position: 'absolute', 
				top: '0px', 
				left: '0px', 
				padding: '10px 0 10px 15px',
				background: 'white',
				color: isToday(this.props.date) ? '#4285F4' : '#8D8D8D',
				boxShadow: '0 14px 28px rgba(255,255,255,0.60), 0 10px 10px rgba(255,255,255,0.80)'
			}}>
				<div style={{ fontSize: '30px' }}>
					{
						dayFormatter.format(this.props.date)
					}
				</div>
				<div>
					{
						weekDayFormatter.format(this.props.date)
					}
				</div>
			</div>
		)
	}

	renderEventsContainer(events: Event[], date: Date) {
		return (
			<div 
				key="eventsContainer" 
				style={{ height: height + 'px', position: 'absolute', right: '15px', left: '50px' }}>
				{ 
					this
						.renderHoursDividers()
						.concat(this.renderEventsItems(events, date)) 
				}
			</div>
		);
	}

	renderEventsItems = (events: Event[], date: Date) => {
		var items = eventsToDayViewItems(events, date);
		return items
			.map(item => {
				return React.cloneElement(item.event, { 
					style: Object.assign({}, item.event.props.style, this.getDayViewItemStyle(item))
				});
			});
	}

	getDayViewItemStyle = (item: DayViewItem) => {
		return {
			height: `calc(${toPercent(item.height)} - 3px)`,
			width: `calc(${toPercent(item.width)} - 3px)`,
			top: toPercent(item.y),
			left: toPercent(item.x),
		 	position: 'absolute',
		 	boxSizing: 'border-box',
			minHeight: '10px'
		};
	}
}

function getHourDividerStyle(hour) {
	return {
		height: height / 24,
		top: hour * (height / 24),
		right: '0px',
		left: '0px',
		position: 'absolute',
		borderBottomColor: '#E0E0E0',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		boxSizing: 'border-box'
	};
}

function getHourStyle(i) {
	return {
		height: (height / 24) + 'px',
		top: (i * (height / 24) - 10) + 'px',
		left: '15px',
		position: 'absolute',
		color: '#525252'
	};
}

function renderHours() {
	var hours = [];
	for(var i = 1; i < 24; i++) {
		hours.push(<span key={i + 'h'} style={getHourStyle(i) }>{i + 'h'}</span>);
	}
	return hours;
}

export default DayView;
