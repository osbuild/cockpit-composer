import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const messages = defineMessages({
  save: {
    defaultMessage: "Save",
  },
  cancel: {
    defaultMessage: "Cancel",
  },
});

class TextInlineEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editValue: "" };
    this.textInput = React.createRef();
    this.textButton = React.createRef();
    this.setEditValue = this.setEditValue.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentDidUpdate(prevProps) {
    this.setEditValue(prevProps);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  setEditValue(prevProps) {
    if (prevProps.editVisible === false && this.props.editVisible === true && this.textInput.current) {
      this.setState({ editValue: this.props.value });
      this.textInput.current.select();
    }
    if (prevProps.editVisible === true && this.props.editVisible === false && this.textButton.current) {
      this.textButton.current.focus();
      this.setState({ editValue: this.props.value });
    }
  }

  handleChange(event) {
    this.setState({ editValue: event.target.value });
    if (this.props.validateValue) {
      this.props.validateValue(event.target.value);
    }
  }

  handleEdit(action) {
    this.props.handleEdit(action, this.textInput.current.value);
  }

  escFunction(event) {
    if (event.keyCode === 27 && this.textInput.current === document.activeElement) {
      this.props.validateValue(this.props.value);
      this.props.handleEdit("cancel");
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const inputAttributes = {
      value: this.state.editValue,
      onChange: this.handleChange,
      "aria-label": this.props.inputLabel,
      "aria-invalid": this.props.invalid,
      ref: this.textInput,
      maxLength: "253",
    };
    if (this.props.helpblock) {
      inputAttributes["aria-describedby"] = `${this.props.inputLabel}-help`;
    }
    const buttonAttributes = {
      onClick: () => this.props.handleEdit(),
      ref: this.textButton,
    };
    if (this.props.helpblockNoValue && this.props.value === "") {
      buttonAttributes["aria-describedby"] = `${this.props.inputLabel}-help2`;
    }
    return (
      <div className={this.props.className}>
        {(this.props.editVisible && (
          <div>
            <div className="form-control-pf-editable form-control-pf-edit">
              <span className="form-control-pf-value" />
              <div className="form-control-pf-textbox">
                <input type="text" className="form-control" {...inputAttributes} />
              </div>
              {(this.props.invalid && (
                <button
                  type="button"
                  className="btn btn-primary form-control-pf-save"
                  disabled
                  aria-label={formatMessage(messages.save)}
                >
                  <span className="fa fa-check" aria-hidden="true" />
                </button>
              )) || (
                <button
                  type="submit"
                  className="btn btn-primary form-control-pf-save"
                  aria-label={formatMessage(messages.save)}
                  onClick={() => this.handleEdit("commit")}
                >
                  <span className="fa fa-check" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className="btn btn-default form-control-pf-cancel"
                aria-label={formatMessage(messages.cancel)}
                onClick={() => this.handleEdit("cancel")}
              >
                <span className="fa fa-times" aria-hidden="true" />
              </button>
            </div>
            {this.props.helpblock && (
              <span className="help-block" id={`${this.props.inputLabel}-help`}>
                {this.props.helpblock}
              </span>
            )}
            {this.props.helpblockNoValue && this.state.editValue === "" && (
              <span className="help-block" id={`${this.props.inputLabel}-help2`}>
                {this.props.helpblockNoValue}
              </span>
            )}
          </div>
        )) || (
          <div>
            <div className="form-control-pf-editable">
              <button type="button" className="form-control-pf-value" {...buttonAttributes}>
                <span className="sr-only">{this.props.buttonLabel}: </span>
                {this.props.value !== "" && <span>{this.props.value}</span>}
                <i className="pficon pficon-edit" aria-hidden="true" />
              </button>
            </div>
            {this.props.helpblockNoValue && this.props.value === "" && (
              <span className="help-block" id={`${this.props.inputLabel}-help2`}>
                {this.props.helpblockNoValue}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}

TextInlineEdit.propTypes = {
  className: PropTypes.string,
  editVisible: PropTypes.bool,
  handleEdit: PropTypes.func,
  validateValue: PropTypes.func,
  invalid: PropTypes.bool,
  buttonLabel: PropTypes.string,
  inputLabel: PropTypes.string,
  value: PropTypes.string,
  helpblock: PropTypes.string,
  helpblockNoValue: PropTypes.string,
  intl: intlShape.isRequired,
};

TextInlineEdit.defaultProps = {
  className: "",
  editVisible: false,
  handleEdit() {},
  validateValue() {},
  invalid: false,
  buttonLabel: "",
  inputLabel: "",
  value: "",
  helpblock: "",
  helpblockNoValue: "",
};

export default injectIntl(TextInlineEdit);
