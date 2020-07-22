import React from "react";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Popover,
  Text,
  TextContent,
  TextInput,
} from "@patternfly/react-core";
import {
  ExternalLinkSquareAltIcon,
  ExclamationTriangleIcon,
  OutlinedQuestionCircleIcon,
} from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  uploadImage: {
    defaultMessage: "Upload image help",
  },
  processLength: {
    defaultMessage: "Process length help",
  },
  imageSize: {
    defaultMessage: "Image size help",
  },
  ostreeParent: {
    defaultMessage: "OSTree parent help",
  },
  ostreeRef: {
    defaultMessage: "OSTree ref help",
  },
});

const messages = defineMessages({
  imageSizePopover: {
    defaultMessage:
      "Set the size that you want the image to be when instantiated. " +
      "The total package size and target destination of your image should be considered when setting the image size.",
  },
  infotip: {
    defaultMessage: "This process can take a while. " + "Images are built in the order they are started.",
  },
  warningUnsaved: {
    defaultMessage:
      "This blueprint has changes that are not committed. " +
      "These changes will be committed before the image is created.",
  },
  warningEmptyBlueprint: {
    id: "empty-blueprint-alert",
    defaultMessage: "This blueprint is empty.",
  },
  warningEmptyBlueprintDesc: {
    defaultMessage: "A minimal image will be created with only the packages needed to support the selected image type.",
  },
  selectOne: {
    defaultMessage: "Select one",
  },
  warningSizeSmall: {
    defaultMessage: "Minimum size is {size} GB.",
  },
  warningSizeLarge: {
    defaultMessage:
      "The size specified is large. We recommend that you check whether your target destination has any restrictions on image size.",
  },
  uploadAWS: {
    defaultMessage: "Upload to AWS",
  },
  uploadAzure: {
    defaultMessage: "Upload to Azure",
  },
});

class ImageStep extends React.PureComponent {
  render() {
    const { formatMessage } = this.props.intl;
    const {
      blueprint,
      handleUploadService,
      imageSize,
      imageType,
      imageTypes,
      isPendingChange,
      isValidImageSize,
      minImageSize,
      maxImageSize,
      ostreeSettings,
      requiresImageSize,
      setImageSize,
      setImageType,
      setOstreeParent,
      setOstreeRef,
      uploadService,
    } = this.props;

    const ostreeFields = (
      <>
        <div className="pf-c-form__group">
          <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
            <label htmlFor="ostree-parent-input" className="pf-l-flex__item">
              <span className="pf-c-form__label-text">
                <FormattedMessage defaultMessage="Parent commit" />
              </span>
            </label>
            <Popover
              id="ostree-parent-popover"
              bodyContent={
                <FormattedMessage defaultMessage="Provide the ID of the latest commit in the updates repository for which this commit provides an update." />
              }
              aria-label={formatMessage(ariaLabels.ostreeParent)}
            >
              <Button variant="plain" aria-label={formatMessage(ariaLabels.ostreeParent)}>
                <OutlinedQuestionCircleIcon id="popover-icon" />
              </Button>
            </Popover>
          </div>
          <TextInput
            className="pf-c-form-control"
            value={ostreeSettings.parent !== undefined ? ostreeSettings.parent : ""}
            type="text"
            id="ostree-parent-input"
            onChange={setOstreeParent}
          />
        </div>
        <div className="pf-c-form__group">
          <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
            <label htmlFor="ostree-ref-input" className="pf-l-flex__item">
              <span className="pf-c-form__label-text">
                <FormattedMessage defaultMessage="Ref" />
              </span>
            </label>
            <Popover
              id="ostree-ref-popover"
              bodyContent={
                <FormattedMessage defaultMessage="Provide the name of the branch for the content. If the ref does not already exist it will be created." />
              }
              aria-label={formatMessage(ariaLabels.ostreeRef)}
            >
              <Button variant="plain" aria-label={formatMessage(ariaLabels.ostreeRef)}>
                <OutlinedQuestionCircleIcon id="popover-icon" />
              </Button>
            </Popover>
          </div>
          <TextInput
            className="pf-c-form-control"
            value={ostreeSettings.ref !== undefined ? ostreeSettings.ref : ""}
            type="text"
            id="ostree-ref-input"
            onChange={setOstreeRef}
          />
        </div>
      </>
    );

    const awsProviderCheckbox = (
      <div className="pf-c-form__group">
        <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
          <span className="pf-l-flex__item pf-c-form__label-text">
            <FormattedMessage defaultMessage="Upload image" />
          </span>
          <Popover
            id="aws-provider-popover"
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
            aria-label={formatMessage(ariaLabels.uploadImage)}
          >
            <Button variant="plain" aria-label={formatMessage(ariaLabels.uploadImage)}>
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <div className="pf-c-form__horizontal-group">
          <Checkbox
            value="aws"
            isChecked={uploadService === "aws"}
            onChange={handleUploadService}
            label={formatMessage(messages.uploadAWS)}
            id="aws-checkbox"
          />
        </div>
      </div>
    );

    const azureProviderCheckbox = (
      <div className="pf-c-form__group">
        <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
          <span className="pf-l-flex__item pf-c-form__label-text">
            <FormattedMessage defaultMessage="Upload image" />
          </span>
          <Popover
            id="popover-help"
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
            aria-label={formatMessage(ariaLabels.uploadImage)}
          >
            <Button variant="plain" aria-label={formatMessage(ariaLabels.uploadImage)}>
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <div className="pf-c-form__horizontal-group">
          <Checkbox
            value="azure"
            isChecked={uploadService === "azure"}
            onChange={handleUploadService}
            label={formatMessage(messages.uploadAzure)}
            id="azure-checkbox"
          />
        </div>
      </div>
    );

    return (
      <>
        {isPendingChange() && (
          <Alert id="pending-changes-alert" variant="warning" isInline title={formatMessage(messages.warningUnsaved)} />
        )}
        {blueprint.packages.length === 0 && (
          <Alert
            id="empty-blueprint-alert"
            variant="info"
            isInline
            title={formatMessage(messages.warningEmptyBlueprint)}
          >
            {formatMessage(messages.warningEmptyBlueprintDesc)}
          </Alert>
        )}
        <Form isHorizontal className="cc-m-wide-label">
          <div className="pf-c-form__group cc-c-form__horizontal-align">
            <span className="pf-c-form__label-text">Blueprint</span>
            <div className="pf-c-form__horizontal-group cc-c-popover__horizontal-group">
              <Text id="blueprint-name">{blueprint.name}</Text>
              <Popover
                id="blueprint-name-popover"
                bodyContent={formatMessage(messages.infotip)}
                aria-label={formatMessage(ariaLabels.processLength)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.processLength)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
          </div>
          <FormGroup label={formatMessage({ id: "image-type", defaultMessage: "Type " })} fieldId="image-type">
            <FormSelect value={imageType} id="image-type" onChange={setImageType}>
              <FormSelectOption isDisabled key="default" value="" label={formatMessage(messages.selectOne)} />
              {imageTypes.map((type) => (
                <FormSelectOption isDisabled={!type.enabled} key={type.name} value={type.name} label={type.label} />
              ))}
            </FormSelect>
          </FormGroup>
          {(imageType === "fedora-iot-commit" || imageType === "rhel-edge-commit") && ostreeFields}
          {imageType === "ami" && awsProviderCheckbox}
          {imageType === "vhd" && azureProviderCheckbox}
          {requiresImageSize(imageType) && (
            <div className="pf-c-form__group">
              <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
                <label htmlFor="create-image-size" className="pf-l-flex__item">
                  <span className="pf-c-form__label-text">
                    <FormattedMessage defaultMessage="Image size" />
                  </span>
                  <span className="pf-c-form__label-required" aria-hidden="true">
                    &#42;
                  </span>
                </label>
                <Popover
                  id="size-popover"
                  bodyContent={formatMessage(messages.imageSizePopover)}
                  aria-label={formatMessage(ariaLabels.imageSize)}
                >
                  <Button variant="plain" aria-label={formatMessage(ariaLabels.imageSize)}>
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
              <div className="pf-c-form__horizontal-group">
                <div className="pf-l-split pf-m-gutter">
                  <div className="pf-l-split__item pf-m-fill">
                    <TextInput
                      className="pf-c-form-control"
                      id="create-image-size"
                      type="number"
                      min={minImageSize}
                      max={maxImageSize}
                      value={imageSize || ""}
                      validated={isValidImageSize() ? "default" : "error"}
                      onChange={setImageSize}
                      aria-describedby="create-image-size-help"
                    />
                  </div>
                  <div className="pf-l-split__item cc-c-form__static-text pf-u-mr-md" aria-hidden="true">
                    GB
                  </div>
                </div>
                {imageSize < maxImageSize && imageType !== "" && (
                  <div
                    className={!isValidImageSize() ? "pf-c-form__helper-text pf-m-error" : "pf-c-form__helper-text"}
                    id="help-text-simple-form-name-helper"
                    aria-live="polite"
                  >
                    {formatMessage(messages.warningSizeSmall, {
                      size: minImageSize,
                    })}
                  </div>
                )}
                {imageSize > maxImageSize && (
                  <div className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                    <ExclamationTriangleIcon className="cc-c-text__warning-icon" />{" "}
                    {formatMessage(messages.warningSizeLarge)}
                  </div>
                )}
              </div>
            </div>
          )}
        </Form>
      </>
    );
  }
}

ImageStep.propTypes = {
  blueprint: PropTypes.object,
  handleUploadService: PropTypes.func,
  intl: intlShape.isRequired,
  imageType: PropTypes.string,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  imageSize: PropTypes.number,
  isPendingChange: PropTypes.func,
  isValidImageSize: PropTypes.func,
  minImageSize: PropTypes.number,
  maxImageSize: PropTypes.number,
  ostreeSettings: PropTypes.object,
  requiresImageSize: PropTypes.func,
  setImageSize: PropTypes.func,
  setImageType: PropTypes.func,
  setOstreeParent: PropTypes.func,
  setOstreeRef: PropTypes.func,
  uploadService: PropTypes.string,
};

ImageStep.defaultProps = {
  blueprint: {},
  handleUploadService() {},
  imageType: "",
  imageTypes: [],
  imageSize: undefined,
  isPendingChange() {},
  isValidImageSize() {},
  minImageSize: 0,
  maxImageSize: 2000,
  ostreeSettings: {},
  requiresImageSize() {},
  setImageSize() {},
  setImageType() {},
  setOstreeParent() {},
  setOstreeRef() {},
  uploadService: "",
};

export default injectIntl(ImageStep);
