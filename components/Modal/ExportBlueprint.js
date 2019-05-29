import React from "react";
import { connect } from "react-redux";
import { Modal } from "patternfly-react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { fetchingBlueprintExportContents } from "../../core/actions/blueprints";

class ExportBlueprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.fetchingBlueprintExportContents(this.props.blueprint.name);
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
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
      <React.Fragment>
        <a href="#" onClick={this.open}>
          <FormattedMessage defaultMessage="Export Blueprint" />
        </a>
        <Modal show={this.state.showModal} onHide={this.close} id="cmpsr-modal-export">
          <Modal.Header>
            <Modal.CloseButton onClick={this.close} />
            <Modal.Title>
              <FormattedMessage defaultMessage="Export Blueprint" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="blueprint-name">
                  <FormattedMessage defaultMessage="Blueprint" />
                </label>
                <div className="col-sm-9">
                  <p className="form-control-static" id="blueprint-name">
                    {this.props.blueprint.name}
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
                {(this.props.blueprint.exportContents && (
                  <div className="col-sm-9">
                    <textarea
                      readOnly
                      id="textInput2-modal-markup"
                      ref={c => {
                        this.blueprint_contents_text = c;
                      }}
                      className="form-control"
                      rows="10"
                      value={this.props.blueprint.exportContents
                        .map(comp => `${comp.name}-${comp.version}-${comp.release}`)
                        .join("\n")}
                      onKeyPress={e => this.handleEnterKey(e)}
                    />
                    <p>
                      <FormattedMessage
                        defaultMessage="{count} total components"
                        values={{
                          count: this.props.blueprint.exportContents.length
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
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-default" onClick={this.close}>
              <FormattedMessage defaultMessage="Close" />
            </button>
            <button type="button" className="btn btn-primary" onClick={() => this.handleCopy()}>
              <FormattedMessage defaultMessage="Copy" />
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

ExportBlueprint.propTypes = {
  fetchingBlueprintExportContents: PropTypes.func,
  blueprint: PropTypes.shape({
    name: PropTypes.string,
    exportContents: PropTypes.arrayOf(PropTypes.object)
  })
};

ExportBlueprint.defaultProps = {
  fetchingBlueprintExportContents: function() {},
  blueprint: {}
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  fetchingBlueprintExportContents: blueprint => {
    dispatch(fetchingBlueprintExportContents(blueprint));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportBlueprint);
