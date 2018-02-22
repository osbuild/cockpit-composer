/* global $ */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DiscardChanges extends React.Component {
  constructor() {
    super();
    this.handleDiscard = this.handleDiscard.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }

  handleDiscard() {
    $('#cmpsr-modal-discard-changes').modal('hide');
    this.props.handleDiscardChanges();
  }

  handleShowModal(e, modalType) {
    $(this.modal).off('hidden.bs.modal', this.props.handleHideModal);
    $('#cmpsr-modal-discard-changes').modal('hide');
    this.props.handleShowModal(e, modalType)
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-discard-changes"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h4 className="modal-title" id="myModalLabel">Are you sure you want to discard pending changes?</h4>
            </div>
            <div className="modal-footer">
              <ul className="list-inline">
                <li>
                  <a href="#" onClick={e => this.handleShowModal(e, 'modalPendingChanges')}>View Pending Changes</a>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                  >Cancel</button>
                </li>
                <li>
                  <button type="button" className="btn btn-danger" onClick={() => this.handleDiscard()}>Discard Changes</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DiscardChanges.propTypes = {
  modals: PropTypes.object,
  handleShowModal: PropTypes.func,
  handleHideModal: PropTypes.func,
  handleDiscardChanges: PropTypes.func,
};

const mapStateToProps = state => ({
  modals: state.modals,
});

export default connect(mapStateToProps)(DiscardChanges);
