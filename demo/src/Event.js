//@flow

import React from 'react';

type Props = {
  start: Date,
  end: Date
}

class Event extends React.Component {
  props: Props;

  render() {
    return (
      <div {...this.props}></div>
    )
  }  
}

export default Event;