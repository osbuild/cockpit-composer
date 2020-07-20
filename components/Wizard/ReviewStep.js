import React from "react";
import {
  Alert,
  Button,
  Popover,
  Text,
  TextList,
  TextContent,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Title,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  ExternalLinkSquareAltIcon,
  ExclamationTriangleIcon,
  OutlinedQuestionCircleIcon,
} from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  aws: {
    defaultMessage: "AWS help",
  },
  azure: {
    defaultMessage: "Azure help",
  },
  processLength: {
    defaultMessage: "Process length help",
  },
});

const messages = defineMessages({
  infotip: {
    defaultMessage: "This process can take a while. " + "Images are built in the order they are started.",
  },
  review: {
    defaultMessage:
      "Review the information below and click Finish to create the image and complete the tasks that were selected. ",
  },
  warningReview: {
    defaultMessage: "There are one or more fields that require your attention.",
  },
  warningSizeEmpty: {
    defaultMessage: "A value is required.",
  },
  warningSizeSmall: {
    defaultMessage: "Minimum size is {size} GB.",
  },
  warningSizeLarge: {
    defaultMessage:
      "The size specified is large. We recommend that you check whether your target destination has any restrictions on image size.",
  },
});

class ReviewStep extends React.PureComponent {
  render() {
    const { formatMessage } = this.props.intl;
    const {
      imageName,
      imageSize,
      imageType,
      imageTypes,
      minImageSize,
      maxImageSize,
      missingRequiredFields,
      uploadService,
      uploadSettings,
    } = this.props;

    const awsReviewStep = uploadService === "aws" && (
      <TextContent id="aws-content">
        <div className="pf-l-flex pf-u-display-flex">
          <h3 className="pf-l-flex__item pf-u-mt-2xl pf-u-mb-md">
            <FormattedMessage defaultMessage="Upload to Amazon" />
          </h3>
          <Popover
            className="pf-l-flex__item"
            id="aws-review-popover"
            bodyContent={
              <TextContent>
                <p>
                  <FormattedMessage
                    defaultMessage="
                        Image Builder can upload images you create to an {bucket} in AWS and then import them into EC2. When the image build is complete
                        and the upload action is successful, the image file is available in the AMI section of EC2. Most of the values required to upload
                        the image can be found in the {console}.
                      "
                    values={{
                      bucket: "S3 bucket",
                      console: (
                        <Button
                          component="a"
                          className="pf-icon"
                          target="_blank"
                          variant="link"
                          icon={<ExternalLinkSquareAltIcon />}
                          iconPosition="right"
                          isInline
                          href="https://console.aws.amazon.com/console/home"
                        >
                          AWS Management Console
                        </Button>
                      ),
                    }}
                  />
                </p>
                <p>
                  <FormattedMessage
                    defaultMessage="
                        This upload process requires that you have an {iam} role named {vmimport} to ensure that the image can
                        be imported from the S3 {bucket} into EC2. For more details, refer to the {role}.
                      "
                    values={{
                      bucket: "bucket",
                      vmimport: <code>vmimport</code>,
                      iam: "Identity and Access Management (IAM)",
                      role: (
                        <Button
                          component="a"
                          className="pf-icon"
                          target="_blank"
                          variant="link"
                          icon={<ExternalLinkSquareAltIcon />}
                          iconPosition="right"
                          isInline
                          href="https://docs.aws.amazon.com/vm-import/latest/userguide/vmie_prereqs.html#vmimport-role"
                        >
                          AWS Required Service Role
                        </Button>
                      ),
                    }}
                  />
                </p>
              </TextContent>
            }
            aria-label={formatMessage(ariaLabels.aws)}
          >
            <Button variant="plain" aria-label={formatMessage(ariaLabels.aws)}>
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <TextList className="cc-m-column__fixed-width" component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Access key ID" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(uploadSettings.accessKeyID.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Secret access key" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(uploadSettings.secretAccessKey.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Image name" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Amazon S3 bucket</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{uploadSettings.bucket}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="AWS region" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{uploadSettings.region}</TextListItem>
        </TextList>
      </TextContent>
    );

    const azureReviewStep = uploadService === "azure" && (
      <TextContent id="azure-content">
        <div className="pf-l-flex pf-u-display-flex">
          <h3 className="pf-l-flex__item pf-u-mt-2xl pf-u-mb-md">
            <FormattedMessage defaultMessage="Upload to Azure" />
          </h3>
          <Popover
            className="pf-l-flex__item"
            id="azure-review-popover"
            bodyContent={
              <FormattedMessage
                defaultMessage="
                      Image Builder can upload images you create to a Blob container in {azure}. When the image build is complete 
                      and the upload action is successful, the image file is available in the Storage account and Blob container that you specified.
                      "
                values={{
                  azure: (
                    <Button
                      component="a"
                      className="pf-icon"
                      target="_blank"
                      variant="link"
                      icon={<ExternalLinkSquareAltIcon />}
                      iconPosition="right"
                      isInline
                      href="https://portal.azure.com/"
                    >
                      Microsoft Azure
                    </Button>
                  ),
                }}
              />
            }
            aria-label={formatMessage(ariaLabels.azure)}
          >
            <Button variant="plain" aria-label={formatMessage(ariaLabels.azure)}>
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <TextList className="cc-m-column__fixed-width" component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Storage account" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{uploadSettings.storageAccount}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Storage access key" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(uploadSettings.storageAccessKey.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Image name" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Storage container" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{uploadSettings.container}</TextListItem>
        </TextList>
      </TextContent>
    );

    return (
      <>
        {missingRequiredFields() && (
          <Alert id="required-fields-alert" variant="danger" isInline title={formatMessage(messages.warningReview)} />
        )}
        <TextContent>
          <Title className="cc-c-popover__horizontal-group" headingLevel="h3" size="2xl">
            <FormattedMessage defaultMessage="Create and upload image" />
            <Popover bodyContent={formatMessage(messages.infotip)} aria-label={formatMessage(ariaLabels.processLength)}>
              <Button variant="plain" aria-label={formatMessage(ariaLabels.processLength)}>
                <OutlinedQuestionCircleIcon id="popover-icon" />
              </Button>
            </Popover>
          </Title>
          <Text>{formatMessage(messages.review)}</Text>
          <h3 className="pf-u-mt-2xl pf-u-mb-md">
            <FormattedMessage defaultMessage="Image output" />
          </h3>
          <TextList className="cc-m-column__fixed-width" component={TextListVariants.dl}>
            <dt>
              <FormattedMessage defaultMessage="Image size" />
            </dt>
            <dd>
              {imageSize === undefined && (
                <div>
                  <ExclamationCircleIcon className="cc-c-text__danger-icon" />{" "}
                  {formatMessage(messages.warningSizeEmpty)}
                </div>
              )}
              {imageSize !== undefined && <div>{imageSize} GB</div>}
              {imageSize < minImageSize && (
                <div>
                  <ExclamationCircleIcon className="cc-c-text__danger-icon" />{" "}
                  {formatMessage(messages.warningSizeSmall, {
                    size: minImageSize,
                  })}
                </div>
              )}
              {imageSize > maxImageSize && (
                <div>
                  <ExclamationTriangleIcon className="cc-c-text__warning-icon" />{" "}
                  {formatMessage(messages.warningSizeLarge)}
                </div>
              )}
            </dd>
            <TextListItem component={TextListItemVariants.dt}>
              <FormattedMessage defaultMessage="Image type" />
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {imageTypes.find((type) => type.name === imageType).label}
            </TextListItem>
          </TextList>
        </TextContent>
        {awsReviewStep}
        {azureReviewStep}
      </>
    );
  }
}

ReviewStep.propTypes = {
  intl: intlShape.isRequired,
  imageName: PropTypes.string,
  imageType: PropTypes.string,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  imageSize: PropTypes.number,
  minImageSize: PropTypes.number,
  maxImageSize: PropTypes.number,
  missingRequiredFields: PropTypes.func,
  uploadService: PropTypes.string,
  uploadSettings: PropTypes.object,
};

ReviewStep.defaultProps = {
  imageName: "",
  imageType: "",
  imageTypes: [],
  imageSize: undefined,
  minImageSize: 0,
  maxImageSize: 2000,
  missingRequiredFields() {},
  uploadService: "",
  uploadSettings: {},
};

export default injectIntl(ReviewStep);
