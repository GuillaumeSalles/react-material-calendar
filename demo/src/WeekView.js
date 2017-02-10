// @flow

import React from 'react';
import verticalHours from './verticalHours';
import DayView from './DayView';
import { addDays } from './dateUtils';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

type Props = {
  date: Date,
	scrollPosition: number;
	onScrollChange: (number) => void;
  isScrollDisable: boolean
}

class WeekView extends React.Component {
  scrollViewer: any;
  props: Props;

  render() {
    var dates = [];
    for(var i = 0; i < 7; i++) {
      dates.push(addDays(this.props.date, i - this.props.date.getDay()));
    }

    return (
      <div style={{ height: '100%', position: 'relative', overflowY: 'hidden' }}>
        <div style={{ height: '70px', position: 'absolute', right: '0', left: '50px', top: '0' }}>
          {
            this.renderDaysHeader(dates)
          }
        </div>
        <div 
					ref={elem => {
						if(elem != null) {
							this.scrollViewer = elem;
							elem.scrollTop = this.props.scrollPosition;
						}
					}}
					onTouchStart={(e) => setTimeout(() => this.props.onScrollChange(this.scrollViewer.scrollTop),100)}
          style={{ height: '100%', position: 'absolute', left: '0', right: '0', top: '70px', overflowY: this.props.isScrollDisable ? 'hidden' : 'auto' }}>
          {
            verticalHours()
          }
          <div style={{ height: '1700px', position: 'absolute', right: '0', left: '50px', top: '0' }}>
            {
              this.renderDays(dates)
            }
          </div>
        </div>
      </div>
    )
  }

  renderDaysHeader(dates: Date[]) {
    return dates.map((date,i) => (
      <DayHeader 
        key={i}
        style={{ 
          position: 'absolute',
          left: `${(100 / 7) * i}%`,
          width: `${100 / 7}%`,
          height: '70px',
          borderLeft: 'solid 1px #E0E0E0',
          borderBottom: 'solid 1px #E0E0E0',
          paddingLeft: '5px'
        }} 
        date={date}/>
    ));
  }

  renderDays(dates: Date[]) {
    return dates.map((date,i) => (
      <div 
        key={i}
        style={{ 
          position: 'absolute',
          height: '100%', 
          left: `${(100 / 7) * i}%`,
          width: `${100 / 7}%`,
          borderLeft: 'solid 1px #E0E0E0'
        }}>
        {
          renderDayEvents(this.props.children, date)
        }
      </div>
    ));
  }
}

export default WeekView;