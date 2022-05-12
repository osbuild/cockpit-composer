import React from "react";
import { Button, Form, Popover, Text, TextInput, FileUpload } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  user: {
    id: "user-help",
    defaultMessage: "User OCID",
  },
  private_key: {
    id: "key-help",
    defaultMessage: "Private key",
  },
  fingerprint: {
    id: "fingerprint-help",
    defaultMessage: "API private key's fingerprint",
  },
  filename_placeholder: {
    id: "filename-placeholder",
    defaultMessage: "Drag and drop a file or upload one",
  },
});

class OCIAuthStep extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: "", filename: this.props.uploadSettings.filename ?? "", isLoading: false };
    this.handleFileInputChange = (event, file) => {
      this.setState({ filename: file.name });
      this.props.uploadSettings.filename = file.name;
    };
    this.handleTextOrDataChange = (value) => (this.props.uploadSettings.private_key = value);
    this.handleClear = () => {
      this.setState({ filename: "", value: "" });
      this.props.uploadSettings.private_key = "";
      this.props.uploadSettings.filename = "";
    };
    this.handleFileReadStarted = () => this.setState({ isLoading: true });
    this.handleFileReadFinished = () => this.setState({ isLoading: false });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { uploadSettings, setUploadSettings } = this.props;
    return (
      <>
        <Text className="help-block cc-c-form__required-text">
          <FormattedMessage defaultMessage="All fields are required." />
        </Text>
        <Form isHorizontal className="cc-m-wide-label">
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="user-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="User OCID" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="user-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="You can find your user OCID {iam} page in the OCI console."
                    values={{
                      iam: <strong>Identity and Access Management (IAM)</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.user)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.user)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.user}
              id="user-input"
              name="user"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="private_key-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Private key" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="private_key-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="You can view your deployed RSA keys in the API Keys section on the {iam} page in the OCI console."
                    values={{
                      iam: <strong>Identity and Access Management (IAM)</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.private_key)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.private_key)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <FileUpload
              id="private_key-input"
              type="text"
              name="private_key"
              value={this.state.value}
              filename={this.state.filename}
              hideDefaultPreview="true"
              filenamePlaceholder={formatMessage(ariaLabels.filename_placeholder)}
              onFileInputChange={this.handleFileInputChange}
              onDataChange={this.handleTextOrDataChange}
              onTextChange={this.handleTextOrDataChange}
              onReadStarted={this.handleFileReadStarted}
              onReadFinished={this.handleFileReadFinished}
              onClearClick={this.handleClear}
              isLoading={this.state.isLoading}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="fingerprint-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Fingerprint" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="fingerprint-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="You can view your deployed RSA keys fingerprint in the API Keys section on the {iam} page in the OCI console."
                    values={{
                      iam: <strong>Identity and Access Management (IAM)</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.fingerprint)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.fingerprint)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.fingerprint}
              id="fingerprint-input"
              name="fingerprint"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

OCIAuthStep.propTypes = {
  intl: PropTypes.object.isRequired,
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.object,
};

OCIAuthStep.defaultProps = {
  uploadSettings: {},
  setUploadSettings() {},
};

export default injectIntl(OCIAuthStep);
