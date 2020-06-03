import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";

class Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordOne: "",
      passwordTwo: "",
      displayWarningMatch: false,
      passwordQuality: "",
      warningQuality: "",
      displayWarningQual: false
    };
    this.handleChangePasswordOne = this.handleChangePasswordOne.bind(this);
    this.handleChangePasswordTwo = this.handleChangePasswordTwo.bind(this);
    this.handleWarnings = this.handleWarnings.bind(this);
  }


  // password match is checked when entering a value in either field
  // messages only display during handleWarnings on blur
  // but will be removed during handleChange... when warnings are no longer true

  handleChangePasswordOne(event) {
    this.setState({
      passwordOne: event.target.value
    });
    if (event.target.value === this.state.passwordTwo) {
      this.setState({ displayWarningMatch: false });
      if (event.target.value === "") {
        this.props.setValidPassword(event.target.value);
      }
    }
  }

  handleChangePasswordTwo(event) {
    this.setState({ passwordTwo: event.target.value });
    if (this.state.passwordOne === event.target.value) {
      this.setState({ displayWarningMatch: false });
    }
    if (this.state.passwordOne === event.target.value) {
      this.props.setValidPassword(event.target.value);
    } else {
      this.props.setValidPassword();
    }
  }

  handleWarnings() {
    setTimeout(() => {
      if (
        this.state.passwordOne !== this.state.passwordTwo &&
        this.state.passwordOne !== "" &&
        this.state.passwordTwo !== ""
      ) {
        this.setState({ displayWarningMatch: true });
      } else {
        this.setState({ displayWarningMatch: false });
      }
    }, 300);
  }

  render() {
    const passwordOneInvalid =
      this.state.displayWarningMatch || (this.state.warningQuality !== "" && this.state.displayWarningQual);
    return (
      <div>
        <div className={`form-group ${passwordOneInvalid ? "has-error" : ""}`}>
          <label className="col-sm-3 control-label" htmlFor="textInput1-modal-password">
            {this.props.labelOne}
          </label>
          <div className="col-sm-9">
            <input
              type="password"
              id="textInput1-modal-password"
              className="form-control"
              aria-describedby="textInput2-modal-password-help textInput2-modal-password-help2"
              aria-invalid={this.state.displayWarningMatch}
              value={this.state.passwordOne}
              onChange={e => this.handleChangePasswordOne(e)}
              onBlur={this.handleWarnings}
            />
          </div>
        </div>
        <div className={`form-group ${this.state.displayWarningMatch ? "has-error" : ""}`}>
          <label className="col-sm-3 control-label" htmlFor="textInput2-modal-password">
            {this.props.labelTwo}
          </label>
          <div className="col-sm-9">
            <input
              type="password"
              id="textInput2-modal-password"
              className="form-control"
              aria-describedby="textInput2-modal-password-help textInput2-modal-password-help2"
              aria-invalid={this.state.displayWarningMatch}
              value={this.state.passwordTwo}
              onChange={e => this.handleChangePasswordTwo(e)}
              onBlur={this.handleWarnings}
            />
            <div
              id="accounts-create-password-meter"
              className={`progress password-strength-meter ${this.state.passwordQuality}`}
            >
              <div className="progress-bar" />
              <div className="progress-bar" />
              <div className="progress-bar" />
              <div className="progress-bar" />
            </div>
            {this.state.warningQuality !== "" && this.state.displayWarningQual && (
              <span className="help-block" id="textInput2-modal-password-help">
                {this.state.warningQuality}
              </span>
            )}
            {this.state.displayWarningMatch && (
              <span className="help-block" id="textInput2-modal-password-help2">
                <FormattedMessage defaultMessage="The values entered for password do not match." />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Password.propTypes = {
  setValidPassword: PropTypes.func,
  labelOne: PropTypes.string,
  labelTwo: PropTypes.string
};

Password.defaultProps = {
  setValidPassword: function() {},
  labelOne: "",
  labelTwo: ""
};

export default injectIntl(Password);
