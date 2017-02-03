import React, { Component } from 'react';
import Scheduler from './ReactScheduler';

var appointments = [{
  id: 0,
  start: new Date(2017,1,1,10,0,0),
  end: new Date(2017,1,1,11,0,0),
},{
  id: 1,
  start: new Date(2017,1,1,11,0,0),
  end: new Date(2017,1,1,11,30,0),
},{
  id: 2,
  start: new Date(2017,1,2,11,0,0),
  end: new Date(2017,1,2,11,30,0),
}];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(2017,1,1)
    };
  }

  render() {
    return (
      <Scheduler
        appointments={appointments}
        date={this.state.date}
        onDateChange={this.setDate}/>
    );
  }

  setDate = (date) => {
    console.log(date);
    this.setState({ date: date });
  }
}

export default App;
