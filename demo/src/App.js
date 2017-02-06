// @flow

import React, { Component } from 'react';
import Scheduler from './Scheduler';
import Event from './Event';

const itemStyle = {
  color: 'white',
  background: '#049BE5',
  padding: '0 2.5px',
  cursor: 'pointer',
  borderRadius: '2px'
}

class App extends Component {
  state: {
    date: Date
  }

  constructor(props: any) {
    super(props);

    this.state = {
      date: new Date(2017,1,1)
    };
  }

  render() {
    return (
      <Scheduler
        date={this.state.date}
        onDateChange={this.setDate}>
        <Event 
          key={0}
          start={new Date(2017,1,1,10,0,0)}
          end={new Date(2017,1,1,11,0,0)}
          style={itemStyle}>
          Meeting
        </Event>
        <Event 
          key={1}
          start={new Date(2017,1,1,11,0,0)}
          end={new Date(2017,1,1,11,30,0)}
          style={itemStyle}>
          Lunch
        </Event>
      </Scheduler>
    );
  }

  setDate = (date: Date) => {
    this.setState({ date: date });
  }
}

export default App;
