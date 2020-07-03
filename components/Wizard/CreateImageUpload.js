import React from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Checkbox,
  Popover,
  TextContent,
  Text,
  TextInput,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Title,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from "@patternfly/react-core";
import {
  OutlinedQuestionCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ExternalLinkSquareAltIcon,
} from "@patternfly/react-icons";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose, fetchingComposeTypes } from "../../core/actions/composes";
import AWSAuthStep from "./AWSAuthStep";
import AWSDestinationStep from "./AWSDestinationStep";
import AzureAuthStep from "./AzureAuthStep";

const messages = defineMessages({
  blobService: {
    defaultMessage: "Blob service",
  },
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
  warningReview: {
    defaultMessage: "There are one or more fields that require your attention.",
  },
  selectOne: {
    defaultMessage: "Select one",
  },
  storageAccounts: {
    defaultMessage: "Storage accounts",
  },
  title: {
    defaultMessage: "Create image",
  },
  review: {
    defaultMessage:
      "Review the information below and click Finish to create the image and complete the tasks that were selected. ",
  },
  warningSizeSmall: {
    defaultMessage: "Minimum size is {size} GB.",
  },
  warningSizeLarge: {
    defaultMessage:
      "The size specified is large. We recommend that you check whether your target destination has any restrictions on image size.",
  },
  warningSizeEmpty: {
    defaultMessage: "A value is required.",
  },
  uploadAWS: {
    defaultMessage: "Upload to AWS",
  },
  uploadAzure: {
    defaultMessage: "Upload to Azure",
  },
});

const ariaLabels = defineMessages({
  uploadImage: {
    id: "upload-image-help",
    defaultMessage: "Upload image help",
  },
  processLength: {
    id: "provess-length-help",
    defaultMessage: "Process length help",
  },
  imageSize: {
    id: "image-size-help",
    defaultMessage: "Image size help",
  },
  imageName: {
    defaultMessage: "Image name help",
  },
  aws: {
    id: "aws-help",
    defaultMessage: "AWS help",
  },
  storageContainer: {
    id: "storage-container-help",
    defaultMessage: "storage container help",
  },
  azure: {
    id: "azure-help",
    defaultMessage: "Azure help",
  },
  ostreeParent: {
    id: "ostree-parent-help",
    defaultMessage: "OSTree parent help",
  },
  ostreeRef: {
    id: "ostree-ref-help",
    defaultMessage: "OSTree ref help",
  },
});

class CreateImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ isOpen: true });
  }

  close() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <>
        <Button id="create-image-button" variant="secondary" onClick={this.open}>
          <FormattedMessage defaultMessage="Create image" />
        </Button>
        {this.state.isOpen && <CreateImageUploadModal {...this.props} close={this.close} isOpen={this.state.isOpen} />}
      </>
    );
  }
}

class CreateImageUploadModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageType: "",
      imageName: "",
      imageSize: "",
      minImageSize: 0,
      maxImageSize: 2000,
      ostreeSettings: {
        parent: undefined,
        ref: undefined,
      },
      showUploadAwsStep: false,
      showUploadAzureStep: false,
      showReviewStep: false,
      uploadService: "",
      uploadSettings: {},
    };
    this.disableCreateButton = this.disableCreateButton.bind(this);
    this.getDefaultImageSize = this.getDefaultImageSize.bind(this);
    this.isPendingChange = this.isPendingChange.bind(this);
    this.isValidImageSize = this.isValidImageSize.bind(this);
    this.requiresImageSize = this.requiresImageSize.bind(this);
    this.missingRequiredFields = this.missingRequiredFields.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.setImageSize = this.setImageSize.bind(this);
    this.setImageName = this.setImageName.bind(this);
    this.setImageType = this.setImageType.bind(this);
    this.setOstreeParent = this.setOstreeParent.bind(this);
    this.setOstreeRef = this.setOstreeRef.bind(this);
    this.setUploadSettings = this.setUploadSettings.bind(this);
    this.handleUploadService = this.handleUploadService.bind(this);
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
  }

  componentWillMount() {
    if (this.props.imageTypes.length === 0) {
      this.props.fetchingComposeTypes();
    }
    if (this.props.composeQueueFetched === false) {
      this.props.fetchingQueue();
    }
  }

  componentWillUnmount() {
    this.props.clearQueue();
  }

  getDefaultImageSize(imageType) {
    if (imageType === "ami") {
      return 6;
    }
    if (imageType === undefined) {
      return null;
    }
    return 2;
  }

  setNotifications() {
    this.props.layout.setNotifications();
  }

  setUploadSettings(_, event) {
    const key = event.target.name;
    const { value } = event.target;
    this.setState((prevState) => ({ uploadSettings: { ...prevState.uploadSettings, [key]: value } }));
  }

  setImageSize(value) {
    this.setState({
      imageSize: value,
    });
  }

  setImageName(value) {
    this.setState({
      imageName: value,
    });
  }

  setOstreeParent(value) {
    this.setState((prevState) => ({ ostreeSettings: { ...prevState.ostreeSettings, parent: value } }));
  }

  setOstreeRef(value) {
    this.setState((prevState) => ({ ostreeSettings: { ...prevState.ostreeSettings, ref: value } }));
  }

  setImageType(imageType) {
    const defaultImageSize = this.getDefaultImageSize(imageType);
    this.setState({
      imageType,
      imageName: "",
      imageSize: defaultImageSize,
      minImageSize: defaultImageSize,
      ostreeSettings: {
        parent: undefined,
        ref: undefined,
      },
      uploadService: "",
      uploadSettings: {},
      showUploadAwsStep: false,
      showUploadAzureStep: false,
      showReviewStep: false,
    });
  }

  isPendingChange() {
    return (
      this.props.blueprint.workspacePendingChanges.length > 0 || this.props.blueprint.localPendingChanges.length > 0
    );
  }

  isValidImageSize() {
    if (this.state.imageSize < this.state.minImageSize && this.state.imageSize !== "") {
      return false;
    }
    return true;
  }

  requiresImageSize(imageType) {
    if (imageType === "fedora-iot-commit" || imageType === "rhel-edge-commit") {
      return false;
    }
    return true;
  }

  disableCreateButton(activeStep) {
    if (this.state.imageType === "") {
      return true;
    }
    if (
      this.requiresImageSize(this.state.imageType) &&
      (this.state.imageSize === "" || (!this.isValidImageSize() && this.state.uploadService === ""))
    ) {
      return true;
    }
    if (this.missingRequiredFields() && activeStep.name === "Review") {
      return true;
    }
    return false;
  }

  missingRequiredFields() {
    if (this.state.uploadService.length === 0) return true;
    if (this.state.imageName.length === 0) return true;
    if (Object.values(this.state.uploadSettings).some((setting) => setting === "")) return true;
    for (const setting in this.state.uploadSettings) {
      if (this.state.uploadSettings[setting].length === 0) return true;
    }
    if (this.state.imageSize < this.state.minImageSize || this.state.imageSize === "") return true;
    return false;
  }

  handleUploadService(_, event) {
    const uploadService = event.target.value;
    const { checked } = event.target;
    if (!checked) {
      this.setState({
        uploadService: "",
        showUploadAwsStep: false,
        showUploadAzureStep: false,
        showReviewStep: false,
      });
    } else {
      switch (uploadService) {
        case "aws":
          this.setState({
            uploadService,
            uploadSettings: {
              accessKeyID: "",
              secretAccessKey: "",
              bucket: "",
              region: "",
            },
            showUploadAwsStep: true,
            showReviewStep: true,
          });
          break;
        case "azure":
          this.setState({
            uploadService,
            uploadSettings: {
              storageAccount: "",
              storageAccessKey: "",
              container: "",
            },
            showUploadAzureStep: true,
            showReviewStep: true,
          });
          break;
        default:
          break;
      }
    }
  }

  handleCommit() {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, "committed");
    NotificationsApi.closeNotification(undefined, "committing");
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, "committing");
    this.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        // and call create image
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then((data) => {
            const blueprintToSet = { ...this.props.blueprint, version: data[0].version };
            this.props.setBlueprint(blueprintToSet);
            this.handleCreateImage();
          })
          .catch((e) => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch((e) => console.log(`Error in blueprint commit: ${e}`));
  }

  handleCreateImage() {
    NotificationsApi.displayNotification(this.props.blueprint.name, "imageWaiting");
    if (this.setNotifications) this.setNotifications();
    if (this.handleStartCompose)
      this.handleStartCompose(
        this.props.blueprint.name,
        this.state.imageType,
        this.state.imageName,
        this.state.imageSize,
        this.state.ostreeSettings,
        this.state.uploadService,
        this.state.uploadSettings
      );
    this.props.close();
  }

  handleStartCompose(blueprintName, composeType, imageName, imageSize, ostreeSettings, uploadService, uploadSettings) {
    const upload = {
      image_name: imageName,
      provider: uploadService,
      settings: uploadSettings,
    };

    let ostree;
    if (ostreeSettings.parent !== undefined || ostreeSettings.ref !== undefined) {
      ostree = ostreeSettings;
    }

    if (uploadService === "") {
      this.props.startCompose(blueprintName, composeType, imageSize, ostree);
    } else {
      this.props.startCompose(blueprintName, composeType, imageSize, ostree, upload);
    }
  }

  handleNextStep(activeStep, toNextStep) {
    if (activeStep.name === "Review" || (activeStep.name === "Image type" && this.state.uploadService.length === 0)) {
      if (this.isPendingChange()) this.handleCommit();
      else this.handleCreateImage();
    } else toNextStep();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { blueprint, imageTypes } = this.props;
    const {
      showUploadAwsStep,
      showUploadAzureStep,
      showReviewStep,
      imageName,
      imageType,
      imageSize,
      ostreeSettings,
      minImageSize,
      maxImageSize,
      uploadService,
    } = this.state;

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
            onChange={this.setOstreeParent}
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
            onChange={this.setOstreeRef}
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
            isChecked={this.state.uploadService === "aws"}
            onChange={this.handleUploadService}
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
            isChecked={this.state.uploadService === "azure"}
            onChange={this.handleUploadService}
            label={formatMessage(messages.uploadAzure)}
            id="azure-checkbox"
          />
        </div>
      </div>
    );

    const imageStep = {
      name: "Image type",
      component: (
        <>
          {this.isPendingChange() && (
            <Alert
              id="pending-changes-alert"
              variant="warning"
              isInline
              title={formatMessage(messages.warningUnsaved)}
            />
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
              <FormSelect value={imageType} id="image-type" onChange={this.setImageType}>
                <FormSelectOption isDisabled key="default" value="" label={formatMessage(messages.selectOne)} />
                {imageTypes.map((type) => (
                  <FormSelectOption isDisabled={!type.enabled} key={type.name} value={type.name} label={type.label} />
                ))}
              </FormSelect>
            </FormGroup>
            {(imageType === "fedora-iot-commit" || imageType === "rhel-edge-commit") && ostreeFields}
            {imageType === "ami" && awsProviderCheckbox}
            {imageType === "vhd" && azureProviderCheckbox}
            {this.requiresImageSize(imageType) && (
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
                        value={imageSize}
                        isValid={this.isValidImageSize()}
                        onChange={this.setImageSize}
                        aria-describedby="create-image-size-help"
                      />
                    </div>
                    <div className="pf-l-split__item cc-c-form__static-text pf-u-mr-md" aria-hidden="true">
                      GB
                    </div>
                  </div>
                  {imageSize < maxImageSize && imageType !== "" && (
                    <div
                      className={
                        !this.isValidImageSize() ? "pf-c-form__helper-text pf-m-error" : "pf-c-form__helper-text"
                      }
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
      ),
    };

    const awsUploadAuth = {
      name: "Authentication",
      component: <AWSAuthStep uploadSettings={this.state.uploadSettings} setUploadSettings={this.setUploadSettings} />,
    };

    const awsUploadDest = {
      name: "Destination",
      component: (
        <AWSDestinationStep
          imageName={this.state.imageName}
          uploadSettings={this.state.uploadSettings}
          setImageName={this.setImageName}
          setUploadSettings={this.setUploadSettings}
        />
      ),
    };

    const awsReviewStep = uploadService === "aws" && (
      <TextContent>
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
            {"*".repeat(this.state.uploadSettings.accessKeyID.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Secret access key" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(this.state.uploadSettings.secretAccessKey.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Image name" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Amazon S3 bucket</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings.bucket}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="AWS region" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings.region}</TextListItem>
        </TextList>
      </TextContent>
    );

    const azureUploadAuth = {
      name: "Authentication",
      component: (
        <AzureAuthStep uploadSettings={this.state.uploadSettings} setUploadSettings={this.setUploadSettings} />
      ),
    };

    const azureUploadSettings = {
      name: "Destination",
      component: (
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
                onChange={this.setImageName}
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
                value={this.state.uploadSettings.container}
                type="text"
                id="storage-container-input"
                name="container"
                onChange={this.setUploadSettings}
              />
            </div>
          </Form>
        </>
      ),
    };

    const azureReviewStep = uploadService === "azure" && (
      <TextContent>
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
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings.storageAccount}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Storage access key" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(this.state.uploadSettings.storageAccessKey.length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Image name" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Storage container" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings.container}</TextListItem>
        </TextList>
      </TextContent>
    );

    const reviewStep = {
      name: "Review",
      component: (
        <>
          {this.missingRequiredFields() && (
            <Alert id="required-fields-alert" variant="danger" isInline title={formatMessage(messages.warningReview)} />
          )}
          <TextContent>
            <Title className="cc-c-popover__horizontal-group" headingLevel="h3" size="2xl">
              <FormattedMessage defaultMessage="Create and upload image" />
              <Popover
                bodyContent={formatMessage(messages.infotip)}
                aria-label={formatMessage(ariaLabels.processLength)}
              >
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
                {imageSize === "" && (
                  <div>
                    <ExclamationCircleIcon className="cc-c-text__danger-icon" />{" "}
                    {formatMessage(messages.warningSizeEmpty)}
                  </div>
                )}
                {imageSize !== "" && <div>{imageSize} GB</div>}
                {imageSize < minImageSize && imageSize !== "" && (
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
              <TextListItem component={TextListItemVariants.dd}>{imageType}</TextListItem>
            </TextList>
          </TextContent>
          {awsReviewStep}
          {azureReviewStep}
        </>
      ),
    };

    const awsUploadStep = {
      name: "Upload to AWS",
      steps: [awsUploadAuth, awsUploadDest],
    };

    const azureUploadStep = {
      name: "Upload to Azure",
      steps: [azureUploadAuth, azureUploadSettings],
    };

    const steps = [
      imageStep,
      ...(showUploadAwsStep ? [awsUploadStep] : []),
      ...(showUploadAzureStep ? [azureUploadStep] : []),
      ...(showReviewStep ? [reviewStep] : []),
    ];

    const createImageUploadFooter = (
      <WizardFooter>
        <WizardContextConsumer>
          {({ activeStep, onNext, onBack, onClose }) => {
            return (
              <>
                <Button
                  id="continue-button"
                  variant="primary"
                  isDisabled={this.disableCreateButton(activeStep)}
                  onClick={() => this.handleNextStep(activeStep, onNext)}
                >
                  {activeStep.name === "Image type" ? (
                    uploadService.length > 0 ? (
                      this.isPendingChange() ? (
                        <FormattedMessage defaultMessage="Commit and next" />
                      ) : (
                        <FormattedMessage defaultMessage="Next" />
                      )
                    ) : this.isPendingChange() ? (
                      <FormattedMessage defaultMessage="Commit and create" />
                    ) : (
                      <FormattedMessage defaultMessage="Create" />
                    )
                  ) : activeStep.name === "Review" ? (
                    <FormattedMessage defaultMessage="Finish" />
                  ) : (
                    <FormattedMessage defaultMessage="Next" />
                  )}
                </Button>
                <Button variant="secondary" onClick={onBack} isDisabled={activeStep.name === "Image type"}>
                  <FormattedMessage defaultMessage="Back" />
                </Button>
                <Button id="cancel-button" variant="danger" onClick={onClose}>
                  <FormattedMessage defaultMessage="Cancel" />
                </Button>
              </>
            );
          }}
        </WizardContextConsumer>
      </WizardFooter>
    );

    return (
      <>
        <Wizard
          id="create-image-upload-wizard"
          isOpen={this.props.isOpen}
          isCompactNav
          onClose={this.props.close}
          footer={createImageUploadFooter}
          title={formatMessage(messages.title)}
          steps={steps}
        />
      </>
    );
  }
}

CreateImageUpload.propTypes = {
  blueprint: PropTypes.shape({
    changed: PropTypes.bool,
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.array,
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object),
  }),
  intl: intlShape.isRequired,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func,
  }),
};

CreateImageUpload.defaultProps = {
  blueprint: {},
  layout: {},
};

CreateImageUploadModal.propTypes = {
  blueprint: PropTypes.shape({
    changed: PropTypes.bool,
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.array,
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object),
  }),
  composeQueueFetched: PropTypes.bool,
  fetchingQueue: PropTypes.func,
  clearQueue: PropTypes.func,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  fetchingComposeTypes: PropTypes.func,
  setBlueprint: PropTypes.func,
  intl: intlShape.isRequired,
  startCompose: PropTypes.func,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func,
  }),
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

CreateImageUploadModal.defaultProps = {
  blueprint: {},
  composeQueueFetched: true,
  fetchingQueue() {},
  clearQueue() {},
  imageTypes: [],
  fetchingComposeTypes() {},
  setBlueprint() {},
  startCompose() {},
  layout: {},
  isOpen: false,
};

const mapStateToProps = (state) => ({
  composeQueue: state.composes.queue,
  composeQueueFetched: state.composes.queueFetched,
  imageTypes: state.composes.composeTypes,
});

const mapDispatchToProps = (dispatch) => ({
  setBlueprint: (blueprint) => {
    dispatch(setBlueprint(blueprint));
  },
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  fetchingQueue: () => {
    dispatch(fetchingQueue());
  },
  clearQueue: () => {
    dispatch(clearQueue());
  },
  startCompose: (blueprintName, composeType, imageSize, ostree, upload) => {
    dispatch(startCompose(blueprintName, composeType, imageSize, ostree, upload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateImageUpload));
