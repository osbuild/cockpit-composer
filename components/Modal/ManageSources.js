/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import SourcesList from '../../components/Sources/SourcesList';
import EmptyState from '../../components/EmptyState/EmptyState';

const messages = defineMessages({
  errorStateTitle: {
    defaultMessage: "An Error Occurred"
  },
  errorStateMessage: {
    defaultMessage: "An error occurred while trying to get sources."
  },
  closeButtonLabel: {
    defaultMessage: "Close"
  }
});

class ManageSources extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }


  render() {
    const { formatMessage } = this.props.intl;
    const systemSources = Object.values(this.props.sources).filter(source => source.system === true);
    const customSources = Object.values(this.props.sources).filter(source => source.system !== true);
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-manage-sources"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label={formatMessage(messages.closeButtonLabel)}
              >
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage
                  defaultMessage="Sources"
                  description="Sources provide the contents from which components are selected"
                />
              </h4>
            </div>
            <div className="modal-body">
              {this.props.sources.length === 0 &&
                <EmptyState
                  title={formatMessage(messages.errorStateTitle)}
                  message={formatMessage(messages.errorStateMessage)}
                />
              ||
                <div>
                  <h5>
                    <FormattedMessage
                      defaultMessage="System Sources"
                      description="System sources are configured repositories that were found on the host machine"
                    />
                  </h5>
                  <SourcesList sources={systemSources} />
                  {customSources.length > 0 &&
                    <h5>
                      <FormattedMessage
                        defaultMessage="Custom Sources"
                        description="Custom sources are additional repositories that were added by the user"
                      />
                    </h5>
                  }
                  {customSources.length > 0 &&
                    <SourcesList sources={customSources} />
                  }
                </div>
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              ><FormattedMessage defaultMessage="Close" /></button>
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
  intl: intlShape.isRequired,
};
const mapStateToProps = state => ({
  modals: state.modals,
});

export default connect(mapStateToProps)(injectIntl(ManageSources));
