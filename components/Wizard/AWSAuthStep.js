import React from "react";
import { Button, Form, Popover, Text, TextInput } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  accessKeyID: {
    id: "access-key-id-help",
    defaultMessage: "Access key ID help",
  },
  secretAccessKey: {
    id: "secret-access-key-help",
    defaultMessage: "Secret access key help",
  },
});

class AWSAuthStep extends React.PureComponent {
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
              <label htmlFor="access-key-id-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Access key ID" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="access-key-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="You can create and find existing Access key IDs on the {iam} page in the AWS console."
                    values={{
                      iam: <strong>Identity and Access Management (IAM)</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.accessKeyID)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.accessKeyID)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.accessKeyID}
              type="password"
              id="access-key-id-input"
              name="accessKeyID"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="secret-access-key-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Secret access key" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="secret-key-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="You can view the Secret access key only when you create a new Access key ID on the {iam} page in the AWS console."
                    values={{
                      iam: <strong>Identity and Access Management (IAM)</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.secretAccessKey)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.secretAccessKey)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.secretAccessKey}
              type="password"
              id="secret-access-key-input"
              name="secretAccessKey"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

AWSAuthStep.propTypes = {
  intl: intlShape.isRequired,
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.object,
};

AWSAuthStep.defaultProps = {
  uploadSettings: {},
  setUploadSettings() {},
};

export default injectIntl(AWSAuthStep);
