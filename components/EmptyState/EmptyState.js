import React from 'react';


class EmptyState extends React.Component {

  render() {
    return (
      <div className="blank-slate-pf">
        {this.props.icon}
        <h1>{this.props.title}</h1>
        <p>{this.props.message}</p>
        {this.props.children}
      </div>
    );
  }

}

export default EmptyState;
