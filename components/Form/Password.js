import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import cockpit from "cockpit";

const messages = defineMessages({
  weakPassword: {
    defaultMessage: "Password is too weak"
  },
  rejectedPassword: {
    defaultMessage: "Password is not acceptable"
  }
});

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
    this.validateQuality = this.validateQuality.bind(this);
    this.passwordQualityFail = this.passwordQualityFail.bind(this);
    this.passwordQualityPass = this.passwordQualityPass.bind(this);
  }

  // password quality is only checked for passwordOne
  // password match is checked on both
  // messages only display during handleWarnings on blur
  // but will be removed during handleChange... when warnings are no longer true

  handleChangePasswordOne(event) {
    this.setState({
      passwordOne: event.target.value,
      displayWarningQual: false
    });
    if (event.target.value !== "") {
      this.validateQuality(event.target.value);
      // if the password passes quality check, this function will also check
      // if both values match, and will pass the password to the parent component
    } else {
      this.setState({
        passwordQuality: "",
        warningQuality: ""
      });
    }
    if (event.target.value === this.state.passwordTwo) {
      this.setState({ displayWarningMatch: false });
    }
  }

  handleChangePasswordTwo(event) {
    this.setState({ passwordTwo: event.target.value });
    if (this.state.passwordOne === event.target.value) {
      this.setState({ displayWarningMatch: false });
    }
    // if the passwords match, and there's no quality warning message defined
    // then pass the password to the parent component, otherwise, the password values
    // are invalid and the submit button will be disabled
    if (this.state.passwordOne === event.target.value && this.state.warningQuality === "") {
      this.props.setValidPassword(event.target.value);
    } else {
      this.props.setValidPassword();
    }
  }

  handleWarnings(input) {
    setTimeout(() => {
      if (this.state.passwordOne !== "" && input === "one") {
        this.setState({ displayWarningQual: true });
      }
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

  validateQuality(password) {
    const dfd = cockpit.defer();
    cockpit
      .spawn("/usr/bin/pwscore", { err: "message" })
      .input(password)
      .done(content => {
        const quality = parseInt(content, 10);
        if (quality === 0) {
          this.passwordQualityFail(this.props.intl.formatMessage(messages.weakPassword));
          dfd.reject(new Error(this.props.intl.formatMessage(messages.weakPassword)));
        } else if (quality <= 33) {
          this.passwordQualityPass("weak", password);
          dfd.resolve("weak");
        } else if (quality <= 66) {
          this.passwordQualityPass("okay", password);
          dfd.resolve("okay");
        } else if (quality <= 99) {
          this.passwordQualityPass("good", password);
          dfd.resolve("good");
        } else {
          this.passwordQualityPass("excellent", password);
          dfd.resolve("excellent");
        }
      })
      .fail(ex => {
        this.passwordQualityFail(ex.message || this.props.intl.formatMessage(messages.rejectedPassword));
        dfd.reject(new Error(ex.message || this.props.intl.formatMessage(messages.rejectedPassword)));
      });
    return dfd.promise();
  }

  passwordQualityFail(message) {
    this.setState({ passwordQuality: "weak" });
    this.setState({ warningQuality: message });
    this.props.setValidPassword();
  }

  passwordQualityPass(quality, password) {
    this.setState({
      passwordQuality: quality,
      warningQuality: ""
    });
    // if the passwords match then pass the password to the modal state,
    // otherwise, the password values are invalid and the submit button will be disabled
    if (this.state.passwordTwo === password) {
      this.props.setValidPassword(password);
    } else {
      this.props.setValidPassword();
    }
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
              onBlur={() => this.handleWarnings("one")}
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
  labelTwo: PropTypes.string,
  intl: intlShape.isRequired
};

Password.defaultProps = {
  setValidPassword: function() {},
  labelOne: "",
  labelTwo: ""
};

export default injectIntl(Password);
