import React from 'react';


class EmptyState extends React.PureComponent {

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

EmptyState.propTypes = {
  icon: React.PropTypes.string,
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default EmptyState;
