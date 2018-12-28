/* global $ */

import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

class ExportBlueprint extends React.Component {
  componentDidMount() {
    $(this.modal).modal("show");
    $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  handleCopy() {
    this.blueprint_contents_text.select();
    document.execCommand("copy");
  }

  handleEnterKey(event) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleCopy();
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-export"
        ref={c => {
          this.modal = c;
        }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                <span className="pficon pficon-close" />
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage defaultMessage="Export Blueprint" />
              </h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="blueprint-name">
                    <FormattedMessage defaultMessage="Blueprint" />
                  </label>
                  <div className="col-sm-9">
                    <p className="form-control-static" id="blueprint-name">
                      {this.props.blueprint}
                    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="textInput-modal-markup">
                    <FormattedMessage defaultMessage="Export as" />
                  </label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <FormattedMessage defaultMessage="Text" tagName="option" />
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="textInput2-modal-markup">
                    <FormattedMessage defaultMessage="Contents" />
                  </label>
                  {(this.props.contents && (
                    <div className="col-sm-9">
                      <textarea
                        readOnly
                        id="textInput2-modal-markup"
                        ref={c => {
                          this.blueprint_contents_text = c;
                        }}
                        className="form-control"
                        rows="10"
                        value={this.props.contents
                          .map(comp => `${comp.name}-${comp.version}-${comp.release}`)
                          .join("\n")}
                        onKeyPress={e => this.handleEnterKey(e)}
                      />
                      <p>
                        <FormattedMessage
                          defaultMessage="{count} total components"
                          values={{
                            count: this.props.contents.length
                          }}
                        />
                      </p>
                    </div>
                  )) || (
                    <div className="col-sm-1">
                      <div className="spinner" />
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Close" />
              </button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleCopy()}>
                <FormattedMessage defaultMessage="Copy" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExportBlueprint.propTypes = {
  blueprint: PropTypes.string,
  contents: PropTypes.arrayOf(PropTypes.object),
  handleHideModal: PropTypes.func
};

export default ExportBlueprint;
