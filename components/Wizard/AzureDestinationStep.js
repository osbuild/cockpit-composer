import React from "react";
import { Button, Form, Popover, Text, TextInput } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  imageName: {
    defaultMessage: "Image name help",
  },
  storageContainer: {
    defaultMessage: "storage container help",
  },
});

const messages = defineMessages({
  blobService: {
    defaultMessage: "Blob service",
  },
  storageAccounts: {
    defaultMessage: "Storage accounts",
  },
});

class AzureDestinationStep extends React.PureComponent {
  render() {
    const { formatMessage } = this.props.intl;
    const { imageName, setImageName, uploadSettings, setUploadSettings } = this.props;

    return (
      <>
        <Text className="help-block cc-c-form__required-text">
          <FormattedMessage defaultMessage="All fields are required." />
        </Text>
        <Form isHorizontal className="cc-m-wide-label">
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="image-name-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Image name" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="popover-help"
                bodyContent={
                  <>
                    <FormattedMessage defaultMessage="Provide a file name to be used for the image file that will be uploaded." />
                  </>
                }
                aria-label={formatMessage(ariaLabels.imageName)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.imageName)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={imageName}
              type="text"
              id="image-name-input"
              onChange={setImageName}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="storage-container-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Storage container" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="
                    Provide the Blob container to which the image file will be uploaded. You can find containers under the {blobService} 
                    section of a storage account. You can find storage accounts on the {storageAccounts} page in the {azure} portal.
                    "
                    values={{
                      azure: "Azure",
                      blobService: <strong>{formatMessage(messages.blobService)}</strong>,
                      storageAccounts: <strong>{formatMessage(messages.storageAccounts)}</strong>,
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.storageContainer)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.storageContainer)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.container}
              type="text"
              id="storage-container-input"
              name="container"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

AzureDestinationStep.propTypes = {
  intl: intlShape.isRequired,
  imageName: PropTypes.string,
  setUploadSettings: PropTypes.func,
  setImageName: PropTypes.func,
  uploadSettings: PropTypes.object,
};

AzureDestinationStep.defaultProps = {
  imageName: "",
  uploadSettings: {},
  setImageName() {},
  setUploadSettings() {},
};

export default injectIntl(AzureDestinationStep);
