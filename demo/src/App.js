// @flow

import React, { Component } from 'react';
import { Scheduler, Event } from '../../src/';

const itemStyle = {
  color: 'white',
  background: '#049BE5',
  padding: '0 2.5px',
  cursor: 'pointer',
  borderRadius: '2px',
  fontSize: '12px'
}

const itemStyle2 = {
  color: 'white',
  background: '#33B679',
  padding: '0 2.5px',
  cursor: 'pointer',
  borderRadius: '2px',
  fontSize: '12px'
}

const itemStyle3 = {
  color: 'white',
  background: '#E67B73',
  padding: '0 2.5px',
  cursor: 'pointer',
  borderRadius: '2px',
  fontSize: '12px'
}

class App extends Component {
  state: {
    date: Date
  }

  constructor(props: any) {
    super(props);

    this.state = {
      date: new Date(2017,1,10,10)
    };
  }

  render() {
    return (
      <Scheduler
        date={this.state.date}
        onDateChange={this.setDate}
        onCreateEvent={(start,end) => console.log(start.toISOString() + end.toISOString())}
        mode={'day'}>
        <Event 
          key={0}
          start={new Date(2017,1,10,10,0,0)}
          end={new Date(2017,1,10,11,0,0)}
          style={itemStyle}>
          Meeting
        </Event>
        <Event 
          key={1}
          start={new Date(2017,1,10,11,0,0)}
          end={new Date(2017,1,10,11,30,0)}
          style={itemStyle}>
          Lunch
        </Event>
        <Event 
          key={2}
          start={new Date(2017,1,12,10,0,0)}
          end={new Date(2017,1,12,14,30,0)}
          style={itemStyle2}>
          Photo
        </Event>
        <Event 
          key={3}
          start={new Date(2017,1,11,12,0,0)}
          end={new Date(2017,1,11,13,30,0)}
          style={itemStyle3}>
          Picnic with Marion
        </Event>
      </Scheduler>
    );
  }

  setDate = (date: Date) => {
    this.setState({ date: date });
  }
}

export default App;
