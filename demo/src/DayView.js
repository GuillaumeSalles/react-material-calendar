// @flow
import type { Appointment } from './types';

import React from 'react';
import { addDays } from './dateUtils';
import { every } from './utils';

type Column = {
	column: number,
	over: number
}

type DayViewItem = {
	x: number,
	y: number,
	height: number,
	width: number,
	appointment: Appointment		
}

const height = 1700;

function getAppointmentsBetweenDates(appointments, start, end) {
	return appointments
		.filter(appointment => appointment.start < end && appointment.end > start);
}

function getAppointmentColumn(appointment: Appointment, columnsLastDate: Date[]): number {
	for (let i = 0; i < columnsLastDate.length; i++) {
		if (appointment.start >= columnsLastDate[i]) {
			return i;
		}
	}
	return columnsLastDate.length;
}

function getAppointmentColumns(appointments: Appointment[]) : Column[] {
	let columnsLastDate = [];
	const results = [];
	let nextOverIndex = 0;

	function setOverColumnOnAppointmentGroup(end) {
		for (let j = nextOverIndex; j < end; j++) {
			results[j].over = columnsLastDate.length;
		}
		columnsLastDate = [];
		nextOverIndex = end;
	}

	for (let i = 0; i < appointments.length; i++) {
		const app = appointments[i];
		let column;

		if (columnsLastDate.length !== 0 && every(columnsLastDate, d => app.start >= d)) {
			setOverColumnOnAppointmentGroup(i);
		}

		column = getAppointmentColumn(app, columnsLastDate);
		columnsLastDate[column] = app.end;
		results.push({ column: column, over: -1 });
	}

	setOverColumnOnAppointmentGroup(appointments.length);

	return results;
}

function appointmentsToDayViewItems(appointments: Appointment[], date: Date) {
	const sortedAppointments = appointments;
    //.sort((a, b) => a.start.localeCompare(b.start));
	const appointmentsColumns = getAppointmentColumns(sortedAppointments);
	return sortedAppointments
		.map((app, i) => ({
			x: appointmentsColumns[i].column / appointmentsColumns[i].over,
			y: ((app.start.getTime() - date.getTime()) / 60000 / 1440),
			width: (1 / appointmentsColumns[i].over),
			height: ((app.end.getTime() - app.start.getTime()) / 60000 / 1440),
			appointment: app
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

class DayView extends React.Component {
	scrollViewer: any;

	render() {
		var apps = getAppointmentsBetweenDates(
			this.props.appointments, 
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
							.concat(this.renderAppointmentsContainer(apps, this.props.date))
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

	renderAppointmentsContainer(appointments: Appointment[], date: Date) {
		return (
			<div 
				key="appointmentsContainer" 
				style={{ height: height + 'px', position: 'absolute', right: '0px', left: '50px' }}>
				{ 
					this
						.renderHoursDividers()
						.concat(this.renderAppointementItems(appointments, date)) 
				}
			</div>
		);
	}

	renderAppointementItems = (appointments: Appointment[], date: Date) => {
		var items = appointmentsToDayViewItems(appointments, date);
		return items
			.map(item =>
				<div
					style={this.getDayViewItemStyle(item)}
					key={item.appointment.id}>
				</div>
			);
	}

	getDayViewItemStyle = (item: DayViewItem) => {
		return {
			height: `calc(${toPercent(item.height)} - 3px)`,
			width: `calc(${toPercent(item.width)} - 3px)`,
			top: toPercent(item.y),
			left: toPercent(item.x),
			color: 'white',
			background: '#049BE5',
			padding: '0 2.5px',
		 	position: 'absolute',
		 	cursor: 'pointer',
			borderRadius: '2px',
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
