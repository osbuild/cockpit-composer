import React from "react";
import { Modal } from "patternfly-react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { creatingBlueprint } from "../../core/actions/blueprints";
import history from "../../core/history";

class CreateBlueprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <>
        <button
          className="btn btn-default"
          id="cmpsr-btn-crt-blueprint"
          type="button"
          onClick={this.open}
          disabled={this.props.disabled}
        >
          <FormattedMessage defaultMessage="Create Blueprint" />
        </button>
        {this.state.showModal && (
          <CreateBlueprintModal
            blueprintNames={this.props.blueprintNames}
            creatingBlueprint={this.props.creatingBlueprint}
            close={this.close}
          />
        )}
      </>
    );
  }
}

class CreateBlueprintModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkErrors: true,
      errorNameEmpty: false,
      errorNameDuplicate: false,
      errorNameSpace: false,
      errorNameInvalid: false,
      errorNameInvalidChar: [],
      errorInline: false,
      name: "",
      description: "",
      modules: [],
      packages: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, prop) {
    this.setState({ [prop]: e.target.value });
    if (prop === "name") {
      this.dismissErrors();
      this.handleErrorNameInvalid(e.target.value);
    }
  }

  handleEnterKey(event) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleErrorNameInvalid(this.state.name);
      setTimeout(() => {
        if (this.nameContainsError()) {
          this.setState({ errorInline: true });
        } else {
          const blueprint = {
            name: this.state.name,
            description: this.state.description,
            modules: this.state.modules,
            packages: this.state.packages,
          };
          this.handleCreateBlueprint(blueprint);
        }
      }, 300);
    }
  }

  handleCreateBlueprint() {
    this.props.close();
    const updatedBlueprint = {
      name: this.state.name,
      description: this.state.description,
      modules: this.state.modules,
      packages: this.state.packages,
      id: this.state.name.replace(/\s/g, "-"),
    };
    this.props.creatingBlueprint(updatedBlueprint);
    window.location.hash = history.createHref(`/edit/${this.state.name}`);
  }

  dismissErrors() {
    this.setState({
      errorNameEmpty: false,
      errorNameDuplicate: false,
      errorNameSpace: false,
      errorInline: false,
      errorNameInvalid: false,
      errorNameInvalidChar: [],
    });
  }

  handleErrorNameInvalid(blueprintName) {
    if (blueprintName.length === 0 && this.state.checkErrors) {
      this.setState({ errorNameEmpty: true });
    } else {
      // Creates array of unique invalid chars in blueprint name
      const invalidCharsRegex = /[^a-zA-Z0-9._-\s]/g;
      const nameInvalidChars = Array.from(new Set(blueprintName.match(invalidCharsRegex)));
      const nameContainsSpace = /\s/.test(blueprintName);

      if (nameInvalidChars.length !== 0) {
        this.setState({ errorNameInvalid: true });
        this.setState({ errorNameInvalidChar: nameInvalidChars });
      }
      if (nameContainsSpace) {
        this.setState({ errorNameSpace: true });
      }
      if (this.props.blueprintNames.includes(blueprintName)) {
        this.setState({ errorNameDuplicate: true });
      }
    }
  }

  nameContainsError() {
    return (
      this.state.errorNameEmpty ||
      this.state.errorNameDuplicate ||
      this.state.errorNameSpace ||
      this.state.errorNameInvalid
    );
  }

  render() {
    return (
      <Modal show onHide={this.props.close} id="cmpsr-modal-crt-blueprint">
        <Modal.Header>
          <Modal.CloseButton onClick={this.props.close} />
          <Modal.Title>
            <FormattedMessage defaultMessage="Create Blueprint" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.errorInline &&
            ((this.state.errorNameEmpty && (
              <div className="alert alert-danger">
                <span className="pficon pficon-error-circle-o" />
                <strong>
                  <FormattedMessage defaultMessage="Required information is missing." />
                </strong>
              </div>
            )) || (
              <div className="alert alert-danger">
                <span className="pficon pficon-error-circle-o" />
                <strong>
                  <FormattedMessage defaultMessage="Specify a new blueprint name." />
                </strong>
              </div>
            ))}
          <form className="form-horizontal">
            <p className="fields-status-pf">
              <FormattedMessage
                defaultMessage="The fields marked with {val} are required."
                values={{
                  val: <span className="required-pf">*</span>,
                }}
              />
            </p>
            <div className={`form-group ${this.nameContainsError() ? "has-error" : ""}`}>
              <label className="col-sm-3 control-label required-pf" htmlFor="textInput-modal-markup">
                <FormattedMessage defaultMessage="Name" />
              </label>
              <div className="col-sm-9">
                <input
                  autoFocus
                  type="text"
                  id="textInput-modal-markup"
                  className="form-control"
                  value={this.state.name}
                  onChange={(e) => this.handleChange(e, "name")}
                  onBlur={(e) => this.handleErrorNameInvalid(e.target.value)}
                  onKeyPress={(e) => this.handleEnterKey(e)}
                />
                <span className="help-block">
                  {this.state.errorNameEmpty && <FormattedMessage defaultMessage="A blueprint name is required." />}
                  {this.state.errorNameDuplicate && (
                    <FormattedMessage
                      defaultMessage="The name {name} already exists."
                      values={{
                        name: this.state.name,
                      }}
                    />
                  )}
                  {this.state.errorNameSpace && !this.state.errorNameInvalid && (
                    <FormattedMessage defaultMessage="Blueprint names cannot contain spaces." />
                  )}
                  {!this.state.errorNameSpace &&
                    this.state.errorNameInvalid &&
                    (this.state.errorNameInvalidChar.length === 1 ? (
                      <FormattedMessage
                        defaultMessage="Blueprint names cannot contain the character: {invalidChar}"
                        values={{
                          invalidChar: this.state.errorNameInvalidChar,
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        defaultMessage="Blueprint names cannot contain the characters: {invalidChar}"
                        values={{
                          invalidChar: this.state.errorNameInvalidChar.join(" "),
                        }}
                      />
                    ))}
                  {this.state.errorNameSpace &&
                    this.state.errorNameInvalid &&
                    (this.state.errorNameInvalidChar.length === 1 ? (
                      <FormattedMessage
                        defaultMessage="Blueprint names cannot contain spaces or the character: {invalidChar}"
                        values={{
                          invalidChar: this.state.errorNameInvalidChar,
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        defaultMessage="Blueprint names cannot contain spaces or the characters: {invalidChar}"
                        values={{
                          invalidChar: this.state.errorNameInvalidChar.join(" "),
                        }}
                      />
                    ))}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="textInput2-modal-markup">
                <FormattedMessage defaultMessage="Description" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  id="textInput2-modal-markup"
                  className="form-control"
                  value={this.state.description}
                  onChange={(e) => this.handleChange(e, "description")}
                  onKeyPress={(e) => this.handleEnterKey(e)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-default"
            onMouseEnter={() => this.setState({ checkErrors: false })}
            onMouseLeave={() => this.setState({ checkErrors: true })}
            onClick={this.props.close}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </button>
          <button
            id="create-blueprint-modal-create-button"
            type="button"
            className="btn btn-primary"
            disabled={this.nameContainsError()}
            onClick={() => this.handleCreateBlueprint()}
          >
            <FormattedMessage defaultMessage="Create" />
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CreateBlueprintModal.propTypes = {
  close: PropTypes.func.isRequired,
  blueprintNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  creatingBlueprint: PropTypes.func.isRequired,
};

CreateBlueprint.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  creatingBlueprint: PropTypes.func,
};

CreateBlueprint.defaultProps = {
  blueprintNames: [],
  disabled: false,
  creatingBlueprint() {},
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  creatingBlueprint: (blueprint) => {
    dispatch(creatingBlueprint(blueprint));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBlueprint);
