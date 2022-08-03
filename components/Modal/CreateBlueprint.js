import React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { creatingBlueprint } from "../../core/actions/blueprints";
import history from "../../core/history";

class CreateBlueprint extends React.Component {
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
      isModalOpen: false,
      name: "",
      description: "",
      modules: [],
      packages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
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
    const updatedBlueprint = {
      name: this.state.name,
      description: this.state.description,
      modules: this.state.modules,
      packages: this.state.packages,
      id: this.state.name.replace(/\s/g, "-"),
    };
    this.props.creatingBlueprint(updatedBlueprint);
    this.handleModalToggle();
    window.location.hash = history.createHref(`/blueprint/${this.state.name}`);
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

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

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

  nameContainsError() {
    return (
      this.state.errorNameEmpty ||
      this.state.errorNameDuplicate ||
      this.state.errorNameSpace ||
      this.state.errorNameInvalid
    );
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <>
        <Button
          variant="secondary"
          disabled={this.props.disabled}
          onClick={this.handleModalToggle}
          id="cmpsr-btn-crt-blueprint"
        >
          <FormattedMessage defaultMessage="Create blueprint" />
        </Button>
        <Modal
          variant={ModalVariant.medium}
          title={<FormattedMessage defaultMessage="Create blueprint" />}
          isOpen={isModalOpen}
          onClose={this.handleModalToggle}
          id="cmpsr-modal-crt-blueprint"
          actions={[
            <Button
              key="cancel"
              variant="danger"
              onMouseEnter={() => this.setState({ checkErrors: false })}
              onMouseLeave={() => this.setState({ checkErrors: true })}
              onClick={this.handleModalToggle}
            >
              <FormattedMessage defaultMessage="Cancel" />
            </Button>,
            <Button
              key="create"
              variant="primary"
              id="create-blueprint-modal-create-button"
              disabled={this.nameContainsError()}
              onClick={() => this.handleCreateBlueprint()}
            >
              <FormattedMessage defaultMessage="Create" />
            </Button>,
          ]}
        >
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
        </Modal>
      </>
    );
  }
}

CreateBlueprint.propTypes = {
  disabled: PropTypes.bool,
  blueprintNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  creatingBlueprint: PropTypes.func.isRequired,
};

CreateBlueprint.defaultProps = {
  disabled: false,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  creatingBlueprint: (blueprint) => {
    dispatch(creatingBlueprint(blueprint));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBlueprint);
