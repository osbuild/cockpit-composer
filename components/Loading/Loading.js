import React from 'react';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.enableLoadingState = this.enableLoadingState.bind(this);
    this.state = {
      displayLoadingState: false,
    };
    this.timer = setTimeout(this.enableLoadingState, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableLoadingState() {
    this.setState({displayLoadingState: true});
  }

  render() {
    const {displayLoadingState} = this.state;
    if (!displayLoadingState) {
      return null;
    }
    return (
      <div className="cmpsr-loading">
        <div className="spinner spinner-md"></div>
        <p className="lead">Loading</p>
      </div>
    );
  }
}

export default Loading;
