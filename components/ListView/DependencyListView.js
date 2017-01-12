import React, { PropTypes } from 'react';
import ListViewExpand from '../../components/ListView/ListViewExpand';

class DependencyListView extends React.Component {

  render() {

    return (
      <div>
        <div className="row toolbar-pf">
          <div className="col-sm-12">
            <form className="toolbar-pf-actions">
              <div className="form-group">
                <span className="text-muted">Show:</span> First Level Dependencies ({this.props.listItems.length}) <span className="text-muted">|</span> <a>All Dependencies (28)</a>
              </div>
            </form>
          </div>
        </div>
        <div className="alert alert-warning alert-dismissable">
          <span className="pficon pficon-warning-triangle-o"></span>
          One or more dependencies have multiple variations that could be used. A default variation was automatically selected. Click a flagged dependency to see other options available.
        </div>
        <ListViewExpand id={ this.props.id } listItems={ this.props.listItems } handleRemoveComponent={this.props.handleRemoveComponent} handleComponentDetails={this.props.handleComponentDetails} isDependency />
      </div>

    )
  }

}

export default DependencyListView;
