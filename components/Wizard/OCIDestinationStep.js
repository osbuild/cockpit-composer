import React from "react";
import { Button, Form, Popover, Text, TextInput } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  imageName: {
    defaultMessage: "Image name help",
  },
  bucket: {
    defaultMessage: "Bucket help",
  },
  region: {
    defaultMessage: "OCI region help",
  },
  tenancy: {
    defaultMessage: "OCI tenancy help",
  },
  compartment: {
    defaultMessage: "OCI compartment help",
  },
  namespace: {
    defaultMessage: "Namespace help",
  },
});

class OCIDestinationStep extends React.PureComponent {
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
                id="image-name-popover"
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
              <label htmlFor="bucket-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">OCI bucket</span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <>
                    <FormattedMessage
                      defaultMessage="
                        Provide the {bucket} name to which the image file will be uploaded before being imported as a custom image. 
                        The {bucket} must already exist in the Region where you want to import your image. You can find a list of {buckets} on the
                        {bucketsPage} page in the OCI storage service in the OCI console.
                      "
                      values={{
                        bucket: "bucket",
                        buckets: "buckets",
                        bucketsPage: <strong>OCI buckets</strong>,
                      }}
                    />
                  </>
                }
                aria-label={formatMessage(ariaLabels.bucket)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.bucket)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.bucket}
              type="text"
              id="bucket-input"
              name="bucket"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="namespace-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Bucket namespace" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="namespace-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the namespace of the {bucket} your uploading to. You can find the namespace in the bucket details."
                    values={{
                      bucket: "OCI bucket",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.namespace)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.namespace)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.namespace}
              type="text"
              id="namespace-input"
              name="namespace"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="region-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Bucket region" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="region-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the region of the {bucket} your uploading to. You can find the region in the bucket details."
                    values={{
                      bucket: "Bucket region",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.region)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.region)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.region}
              type="text"
              id="region-input"
              name="region"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="compartment-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Bucket compartment" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="compartment-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the compartment of the {bucket} your uploading to. You can find the compartment in the bucket details."
                    values={{
                      bucket: "OCI bucket compartment",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.compartment)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.compartment)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.compartment}
              type="text"
              id="compartment-input"
              name="compartment"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="tenancy-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Bucket tenancy" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="tenancy-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the tenancy of the {bucket} your uploading to. You can find the tenancy in the bucket details."
                    values={{
                      bucket: "OCI bucket",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.tenancy)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.tenancy)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.tenancy}
              type="text"
              id="tenancy-input"
              name="tenancy"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

OCIDestinationStep.propTypes = {
  intl: intlShape.isRequired,
  imageName: PropTypes.string,
  setUploadSettings: PropTypes.func,
  setImageName: PropTypes.func,
  uploadSettings: PropTypes.object,
};

OCIDestinationStep.defaultProps = {
  imageName: "",
  uploadSettings: {},
  setImageName() {},
  setUploadSettings() {},
};

export default injectIntl(OCIDestinationStep);
