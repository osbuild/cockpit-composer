import React from "react";
import { Button, Form, Popover, Text, TextInput } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  storageAccount: {
    defaultMessage: "Storage account help",
  },
  storageAccessKey: {
    defaultMessage: "Storage access key help",
  },
});

const messages = defineMessages({
  accessKeys: {
    defaultMessage: "Access keys",
  },
  storageAccounts: {
    defaultMessage: "Storage accounts",
  },
});

class AzureAuthStep extends React.PureComponent {
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
              <label htmlFor="storage-account-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Storage account" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="popover-help"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the name of a storage account. You can find storage accounts on the {storageAccounts} page in the {azure} portal."
                    values={{
                      storageAccounts: <strong>{formatMessage(messages.storageAccounts)}</strong>,
                      azure: "Azure",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.storageAccount)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.storageAccount)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.storageAccount}
              id="storage-account-input"
              name="storageAccount"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="storage-access-key-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Storage access key" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="popover-help"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="
                        Provide the access key for the desired storage account. You can find the access key on the {accessKeys} 
                        page of the storage account. You can find storage accounts on the {storageAccounts} page in the {azure} portal.
                      "
                    values={{
                      azure: "Azure",
                      accessKeys: <strong>{formatMessage(messages.accessKeys)}</strong>,
                      storageAccounts: <strong>{formatMessage(messages.storageAccounts)}</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.storageAccessKey)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.storageAccessKey)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.storageAccessKey}
              type="password"
              id="storage-access-key-input"
              name="storageAccessKey"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

AzureAuthStep.propTypes = {
  intl: PropTypes.object.isRequired,
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.object,
};

AzureAuthStep.defaultProps = {
  uploadSettings: {},
  setUploadSettings() {},
};

export default injectIntl(AzureAuthStep);
