import React from 'react';

class ListView extends React.Component {

  render() {
    return (
      <div id={this.props.id} className="list-group list-view-pf list-view-pf-view">
        {this.props.children}
      </div>
    );
  }
}

export default ListView;
