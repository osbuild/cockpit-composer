/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SourcesList from '../../components/Sources/SourcesList';
import EmptyState from '../../components/EmptyState/EmptyState';


class ManageSources extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }


  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-manage-sources"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
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
              <h4 className="modal-title" id="myModalLabel">Sources</h4>
            </div>
            <div className="modal-body">
              {this.props.sources.length === 0 &&
                <EmptyState
                  title="An Error Occurred"
                  message="An error occurred while trying to get sources."
                />
              ||
                <SourcesList sources={this.props.sources} />
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageSources.propTypes = {
  sources: PropTypes.array,
  handleHideModal: PropTypes.func,
};
const mapStateToProps = state => ({
  modals: state.modals,
});

export default connect(mapStateToProps)(ManageSources);
