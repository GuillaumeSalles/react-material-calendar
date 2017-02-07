// @flow
import React from 'react';

function isToday(date) {
	var diff = new Date().getTime() - date.getTime();
	return diff > 0 && diff < (3600 * 1000 * 24);
}

var weekDayFormatter = new Intl.DateTimeFormat(window.navigator.language, { weekday: 'short' });
var dayFormatter = new Intl.DateTimeFormat(window.navigator.language, { day: 'numeric' });

type Props = {
  style: any,
  date: Date
}

const DayHeader = (props: Props) => {
  return (
    <div style={Object.assign(props.style, { color: isToday(props.date) ? '#4285F4' : '#8D8D8D'})}>
      <div style={{ fontSize: '30px' }}>
        {
          dayFormatter.format(props.date)
        }
      </div>
      <div>
        {
          weekDayFormatter.format(props.date)
        }
      </div>
    </div>
  )
}

export default DayHeader;