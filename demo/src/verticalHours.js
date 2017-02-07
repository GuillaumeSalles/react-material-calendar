// @flow

import React from 'react';

const height = 1700;

function getHourStyle(i) {
	return {
		height: (height / 24) + 'px',
		top: (i * (height / 24) - 10) + 'px',
		left: '15px',
		position: 'absolute',
		color: '#525252'
	};
}

export default function verticalHours() {
	var hours = [];
	for(var i = 1; i < 24; i++) {
		hours.push(<span key={i + 'h'} style={getHourStyle(i) }>{i + 'h'}</span>);
	}
	return hours;
}