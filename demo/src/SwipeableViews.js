import React from 'react';

class SwipeableViews extends React.Component {
  constructor(props) {
    super(props);
    this.lastTouches = null;
    this.onTouchMove = this.onTouchMove.bind(this);
    this.isSwiping = false;
    this.isScrolling = false;

    this.state = {
      horizontalOffset: -100,

    };
  }

  render() {
    return (
      <div style={{ overflowX: 'hidden', height: '100%' }}>
        <div 
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          style={{ 
            display: 'flex',
            height: '100%',
            transform: `translate3d(${this.state.horizontalOffset}%,0,0)`,
            transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
          }}>
          {
            this.renderViews()
          }
        </div>
      </div>
      
    )
  }

  onTouchStart = (a,b) => {
  }

  onTouchEnd = (a,b) => {
    if(this.state.horizontalOffset > -50) {
      this.setState({
        horizontalOffset: 0
      });
    } else if (this.state.horizontalOffset < -150) {
      this.setState({
        horizontalOffset: -200
      });
    } else {
      this.setState({
        horizontalOffset: -100
      });
    }
    this.lastTouches = null;
    this.setState({
      isSwiping: false
    });
    this.isScrolling = false;
  }
  
  onTouchMove = (event) => {
    if(this.state.isSwiping) {
      this.setState({
        horizontalOffset: (((event.touches[0].clientX - this.lastTouches[0].clientX) / 375) * 100) - 100,
      });
      event.stopPropagation();
      return;
    }

    if(this.isScrolling) {
      return;
    }

    if(this.lastTouches != null) {
      if(Math.abs(this.lastTouches[0].clientX - event.touches[0].clientX) > 
        Math.abs(this.lastTouches[0].clientY - event.touches[0].clientY)) {
        this.setState({
          isSwiping: true
        });
        this.isScrolling = false;
      }
      else {
        this.setState({
          isSwiping: false
        });
        this.isScrolling = true;
      }
    } else {
      this.lastTouches = event.touches;
    }
  }

  renderViews = () => {
    var views = [];
    for(var i = this.props.index - 1; i <= this.props.index + 1; i++) {
      views.push(this.props.viewFactory(i, this.state.isSwiping));
    }
    return views;
  }
}

export default SwipeableViews;