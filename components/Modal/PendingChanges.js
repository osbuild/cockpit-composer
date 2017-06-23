import React from 'react';
import PropTypes from 'prop-types';

class PendingChanges extends React.Component {

  // dummy data
  state = {
    componentUpdates: [
      { componentOld: null, componentNew: 'rsync-3.0-17.317' },
      { componentOld: 'httpd-2.3-45.el7', componentNew: 'httpd-2.4-45.el7' },
      { componentOld: 'basesystem-10.0-7.el7', componentNew: null },
    ],
  };

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }

  handleSaveChanges() {
    $('#cmpsr-modal-pending-changes').modal('hide');
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-pending-changes"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Changes Pending Save</h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                  >Recipe</label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.recipe}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput-modal-markup"
                  >Comment</label>
                  <div className="col-sm-9">
                    <textarea
                      id="textInput-modal-markup"
                      className="form-control"
                      rows="1"
                      value={this.props.recipe.comment}
                    />
                  </div>
                </div>
                <div className="alert alert-info">
                  <span className="pficon pficon-info"></span>
                  Only changes to selected components are shown. <a href="#" className="alert-link">View all changes.</a>
                </div>
                <strong>Pending Changes</strong>
                <ul className="list-group">
                  {this.state.componentUpdates.map((componentUpdated) => (
                    <li className="list-group-item">
                      {componentUpdated.componentNew && componentUpdated.componentOld &&
                        <div className="row">
                          <div className="col-sm-3">Updated<span className="text-muted"> (most recent first)</span></div>
                          <div className="col-sm-9">from <strong>{componentUpdated.componentOld}</strong> to <strong>
                            {componentUpdated.componentNew}</strong></div>
                        </div>
                      } {componentUpdated.componentNew && !componentUpdated.componentOld &&
                        <div className="row">
                          <div className="col-sm-3">Added</div>
                          <div className="col-sm-9"><strong>{componentUpdated.componentNew}</strong></div>
                        </div>
                      } {componentUpdated.componentOld && !componentUpdated.componentNew &&
                        <div className="row">
                          <div className="col-sm-3">Removed</div>
                          <div className="col-sm-9"><strong>{componentUpdated.componentOld}</strong></div>
                        </div>
                      }
                    </li>
                  ))}
                </ul>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >Close</button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleSaveChanges()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PendingChanges.propTypes = {
  comment: PropTypes.string,
  recipe: PropTypes.string,
  contents: PropTypes.array,
  handleHideModal: PropTypes.func,
};

export default PendingChanges;
