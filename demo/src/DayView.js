import React from 'react';
import { addDays } from './dateUtils';

const height = 1700;

function getAppointmentsBetweenDates(appointments, start, end) {
	return appointments
		.filter(appointment => appointment.start < end && appointment.end > start);
}

function every(array, predicate) {
	for(var i = 0; i < array.length; i++) {
		if(!predicate(array[i])) {
			return false;
		}
	}
	return true;
}

function getAppointmentColumn(appointment, columnsLastDate) {
	for (let i = 0; i < columnsLastDate.length; i++) {
		if (appointment.start >= columnsLastDate[i]) {
			return i;
		}
	}
	return columnsLastDate.length;
}

function getAppointmentColumns(appointments) {
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
		results.push({ column: column });
	}

	setOverColumnOnAppointmentGroup(appointments.length);

	return results;
}

function appointmentsToDayViewItems(appointments, date, locale) {
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

class DayView extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.appointments !== nextProps.appointments
			|| this.props.date !== nextProps.date;
	}

	render() {
		var apps = getAppointmentsBetweenDates(
			this.props.appointments, 
			this.props.date, 
			addDays(this.props.date,1));
		return (
			<div style={{ height: height + 'px', position: 'relative' }}>
				{
					renderHours().concat(this.renderAppointmentsContainer(apps, this.props.date))
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

	renderAppointmentsContainer(appointments, date) {
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

	renderAppointementItems = (appointments, date) => {
		var items = appointmentsToDayViewItems(appointments, date);
		return items
			.map(item =>
				<div
					style={this.getDayViewItemStyle(item)}
					key={item.appointment.id}>
				</div>
			);
	}

	getDayViewItemStyle = (item) => {
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
		color: 'black'
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
