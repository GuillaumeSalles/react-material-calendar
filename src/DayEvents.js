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
	const sortedEvents = events.sort((a, b) => a.props.start.getTime() - b.props.start.getTime());
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

function getHourDividerStyle(hour) {
	return {
		height: (100 / 24) + '%',
		top: (hour * (100 / 24)) + '%',
		right: '0px',
		left: '0px',
		position: 'absolute',
		borderBottomColor: '#F3F3F3',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		boxSizing: 'border-box'
	};
}

function handleHourDividerClick(date:Date, hour: number, onHourDividerClick) {
	return function() {
		var start = new Date(date.getTime());
		start.setHours(hour);
		var end = new Date(date.getTime());
		end.setHours(hour + 1);
		onHourDividerClick(start, end);
	}
}

function renderHoursDividers(date: Date, onHourDividerClick: (start: Date, end: Date) => void) {
  var dividers = [];
  for(var i = 0; i < 24; i++) {
    dividers.push(
      <div 
        key={i + 'divider'} 
				onClick={handleHourDividerClick(date,i,onHourDividerClick)}
        style={getHourDividerStyle(i)}>
      </div>
    );
  }
  return dividers;
}

function renderEventsItems(events: Event[], date:Date) {
  var items = eventsToDayViewItems(getEventsBetweenDates(events, date, addDays(date,1)), date);
  return items
    .map(item => {
      return React.cloneElement(item.event, { 
        style: Object.assign({}, item.event.props.style, getDayViewItemStyle(item))
      });
    });
}

function getDayViewItemStyle(item: DayViewItem) {
  return {
    height: `calc(${toPercent(item.height)} - 3px)`,
    width: `calc(${toPercent(item.width)} - 5px)`,
    top: toPercent(item.y),
    left: toPercent(item.x),
    position: 'absolute',
    boxSizing: 'border-box',
    minHeight: '10px'
  };
}

function renderNewEvent(date: Date, newEvent, onCreateEvent: () => void) {
	if(newEvent == null || newEvent.start >= addDays(date,1) || newEvent.end <= date) {
		return [];
	}

  return (
		<div 
			key={'newEvent'}
			style={{
				width: '100%',
				height: toPercent((newEvent.end.getTime() - newEvent.start.getTime()) / 60000 / 1440),
				top: toPercent((newEvent.start.getTime() - date.getTime()) / 60000 / 1440),
				left: '0',
				position: 'absolute',
				boxSizing: 'border-box',
				background: '#049BE5',
				color: 'white',
				fontSize: '20px',
				opacity: '0.6'
			}}
			onClick={onCreateEvent}>
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				+
			</div>
		</div>
	);
}

type Props = {
	events: Event[], 
	date: Date, 
	newEvent: ?{
		start: Date,
		end: Date	
	},
	onHourDividerClick: (start: Date, end: Date) => void,
	onCreateEvent: () => void,
}

var DayEvents = (props: Props) => {
	return renderHoursDividers(props.date, props.onHourDividerClick)
		.concat(renderEventsItems(props.events, props.date))
		.concat(renderNewEvent(props.date, props.newEvent, props.onCreateEvent));
}

export default DayEvents;