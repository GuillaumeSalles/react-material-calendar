// @flow

import React from 'react';
import verticalHours from './verticalHours';
import DayView from './DayView';
import { addDays } from './dateUtils';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

type Props = {
  dates: Date[],
	scrollPosition: number;
	onScrollChange: (number) => void;
  isScrollDisable: boolean
}

class MultipleDaysView extends React.Component {
  scrollViewer: any;
  props: Props;

  render() {
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '70px', position: 'absolute', right: '0', left: '50px', top: '0' }}>
          {
            this.renderDaysHeader(this.props.dates)
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
          style={{ 
            height: 'calc(100% - 70px)',
            position: 'absolute', 
            left: '0', 
            right: '0', 
            top: '70px', 
            bottom: '0',
            overflowY: this.props.isScrollDisable ? 'hidden' : 'auto',
            overflowX: 'hidden'
          }}>
          <div style={{ height: '1700px', position: 'absolute', left: '0', top: '0' }}>
            {
              verticalHours()
            }
          </div>
          <div style={{ height: '1700px', position: 'absolute', right: '0', left: '50px', top: '0' }}>
            {
              this.renderDays(this.props.dates)
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
          left: `${(100 / this.props.dates.length) * i}%`,
          width: `${100 / this.props.dates.length}%`,
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
          left: `${(100 / this.props.dates.length) * i}%`,
          width: `${100 / this.props.dates.length}%`,
          borderLeft: 'solid 1px #E0E0E0'
        }}>
        {
          renderDayEvents(this.props.children, date)
        }
      </div>
    ));
  }
}

export default MultipleDaysView;