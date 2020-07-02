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
    defaultMessage: "S3 Bucket help",
  },
  region: {
    defaultMessage: "AWS region help",
  },
});

class AWSDestinationStep extends React.PureComponent {
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
                <span className="pf-c-form__label-text">Amazon S3 bucket</span>
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
                        Provide the S3 {bucket} name to which the image file will be uploaded before being imported into EC2. 
                        The {bucket} must already exist in the Region where you want to import your image. You can find a list of {buckets} on the
                        {bucketsPage} page in the {amazon} S3 storage service in the AWS console.
                      "
                      values={{
                        bucket: "bucket",
                        buckets: "buckets",
                        bucketsPage: <strong>S3 buckets</strong>,
                        amazon: "Amazon",
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
              <label htmlFor="region-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="AWS region" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="region-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the AWS Region where you want to import your image. This must be the same region where the {bucket} exists."
                    values={{
                      bucket: "S3 bucket",
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
        </Form>
      </>
    );
  }
}

AWSDestinationStep.propTypes = {
  intl: intlShape.isRequired,
  imageName: PropTypes.string,
  setUploadSettings: PropTypes.func,
  setImageName: PropTypes.func,
  uploadSettings: PropTypes.object,
};

AWSDestinationStep.defaultProps = {
  imageName: "",
  uploadSettings: {},
  setImageName() {},
  setUploadSettings() {},
};

export default injectIntl(AWSDestinationStep);
