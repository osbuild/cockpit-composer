import React from 'react';
import PropTypes from 'prop-types';
import ListView from '../../components/ListView/ListView';
import ListItemComponents from '../../components/ListView/ListItemComponents';


class DependencyListView extends React.PureComponent {

  render() {
    return (
      <div>
        <div className="row toolbar-pf">
          <div className="col-sm-12">
            <form className="toolbar-pf-actions">
              <div className="form-group">
                <span className="text-muted">Show: </span>
                First Level ({this.props.listItems.length})
                <span className="text-muted"> | </span>
                <a>Total (---)</a>
              </div>
            </form>
          </div>
        </div>
        <div className="alert alert-warning alert-dismissable hidden">
          <span className="pficon pficon-warning-triangle-o"></span>
          One or more dependencies have multiple variations that could be used.
          A default variation was automatically selected.
          Click a flagged dependency to see other options available.
        </div>
        <ListView id={this.props.id} >
          {this.props.listItems.map((listItem, i) =>
            <ListItemComponents
              listItemParent={this.props.id}
              isDependency
              listItem={listItem}
              key={i}
              noEditComponent={this.props.noEditComponent}
              handleRemoveComponent={this.props.handleRemoveComponent}
              handleComponentDetails={this.props.handleComponentDetails}
              componentDetailsParent={this.props.componentDetailsParent}
            />
          )}
        </ListView>
      </div>

    );
  }

}

DependencyListView.propTypes = {
  id: PropTypes.string,
  listItems: PropTypes.array,
  noEditComponent: PropTypes.bool,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  componentDetailsParent: PropTypes.object,
};

export default DependencyListView;
