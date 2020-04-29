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
  WizardFooter
} from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose, fetchingComposeTypes } from "../../core/actions/composes";

const messages = defineMessages({
  imageSizePopover: {
    defaultMessage:
      "Set the size that you want the image to be when instantiated. " +
      "The total package size and target destination of your image should be considered when setting the image size."
  },
  infotip: {
    defaultMessage: "This process can take a while. " + "Images are built in the order they are started."
  },
  warningUnsaved: {
    defaultMessage:
      "This blueprint has changes that are not committed. " +
      "These changes will be committed before the image is created."
  },
  warningEmptyBlueprint: {
    id: "empty-blueprint-alert",
    defaultMessage: "This blueprint is empty."
  },
  warningReview: {
    defaultMessage: "There are one or more fields that require your attention."
  },
  selectOne: {
    defaultMessage: "Select one"
  },
  title: {
    defaultMessage: "Create image"
  },
  review: {
    defaultMessage:
      "Review the information below and click Finish to create the image and complete the tasks that were selected. "
  },
  warningSizeSmall: {
    defaultMessage: "Minimum size is {size} GB."
  },
  warningSizeLarge: {
    defaultMessage:
      "The size specified is large. We recommend that you check whether your target destination has any restrictions on image size."
  },
  warningSizeEmpty: {
    defaultMessage: "A value is required."
  }
});

class CreateImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
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
      <React.Fragment>
        <Button id="create-image-button" variant="secondary" onClick={this.open}>
          <FormattedMessage defaultMessage="Create image" />
        </Button>
        {this.state.isOpen && <CreateImageUploadModal {...this.props} close={this.close} isOpen={this.state.isOpen} />}
      </React.Fragment>
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
      showUploadAwsStep: false,
      showReviewStep: false,
      uploadService: "",
      uploadSettings: {}
    };
    this.getDefaultImageSize = this.getDefaultImageSize.bind(this);
    this.isPendingChange = this.isPendingChange.bind(this);
    this.isValidImageSize = this.isValidImageSize.bind(this);
    this.missingRequiredFields = this.missingRequiredFields.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.setImageSize = this.setImageSize.bind(this);
    this.setImageName = this.setImageName.bind(this);
    this.setImageType = this.setImageType.bind(this);
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
    } else if (imageType === undefined) {
      return null;
    } else {
      return 2;
    }
  }

  setNotifications() {
    this.props.layout.setNotifications();
  }

  setUploadSettings(_, event) {
    const key = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({ uploadSettings: Object.assign({}, prevState.uploadSettings, { [key]: value }) }));
  }

  setImageSize(value) {
    this.setState({
      imageSize: value
    });
  }

  setImageName(value) {
    this.setState({
      imageName: value
    });
  }

  setImageType(imageType) {
    const defaultImageSize = this.getDefaultImageSize(imageType);
    this.setState({
      imageType,
      imageName: "",
      imageSize: defaultImageSize,
      minImageSize: defaultImageSize,
      uploadService: "",
      uploadSettings: {},
      showUploadAwsStep: false,
      showReviewStep: false
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
    } else {
      return true;
    }
  }

  missingRequiredFields() {
    if (this.state.uploadService.length == 0) return true;
    if (this.state.imageName.length == 0) return true;
    if (Object.values(this.state.uploadSettings).some(setting => setting === "")) return true;
    for (const setting in this.state.uploadSettings) {
      if (this.state.uploadSettings[setting].length == 0) return true;
    }
    if (this.state.imageSize < this.state.minImageSize || this.state.imageSize === "") return true;
    return false;
  }

  handleUploadService(_, event) {
    const uploadService = event.target.value;
    if (this.state.uploadService === uploadService) {
      this.setState({
        uploadService: "",
        showUploadAwsStep: true,
        showReviewStep: false
      });
    } else {
      switch (uploadService) {
        case "aws":
          this.setState({
            uploadService: uploadService,
            uploadSettings: {
              accessKeyID: "",
              secretAccessKey: "",
              bucket: "",
              region: ""
            },
            showUploadAwsStep: true,
            showReviewStep: true
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
          .then(data => {
            const blueprintToSet = Object.assign({}, this.props.blueprint, {
              version: data[0].version
            });
            this.props.setBlueprint(blueprintToSet);
            this.handleCreateImage();
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
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
        this.state.uploadService,
        this.state.uploadSettings
      );
    this.props.close();
  }

  handleStartCompose(blueprintName, composeType, imageName, imageSize, uploadService, uploadSettings) {
    const upload = {
      image_name: imageName,
      provider: uploadService,
      settings: uploadSettings
    };
    if (uploadService == "") {
      this.props.startCompose(blueprintName, composeType, imageSize);
    } else {
      this.props.startCompose(blueprintName, composeType, imageSize, upload);
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
      showReviewStep,
      imageName,
      imageType,
      imageSize,
      minImageSize,
      maxImageSize,
      uploadService
    } = this.state;

    const awsProviderCheckbox = (
      <div className="pf-c-form__group">
        <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
          <span className="pf-l-flex__item pf-c-form__label-text">
            <FormattedMessage defaultMessage="Upload image" />
          </span>
          <Popover
            id="popover-help"
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
                      console: <a href="https://console.aws.amazon.com/console/home">AWS Management Console</a>
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
                        <a href="https://docs.aws.amazon.com/vm-import/latest/userguide/vmie_prereqs.html#vmimport-role">
                          AWS Required Service Role
                        </a>
                      )
                    }}
                  />
                </p>
              </TextContent>
            }
            aria-label="Upload image help"
          >
            <Button variant="plain" aria-label="Upload image help">
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <div className="pf-c-form__horizontal-group">
          <Checkbox
            value="aws"
            isChecked={this.state.uploadService === "aws"}
            onChange={this.handleUploadService}
            label={this.props.intl.formatMessage({
              id: `aws-checkbox`,
              defaultMessage: `Upload to AWS`
            })}
            id="aws-checkbox"
            aria-labelledby="provider-checkbox"
          />
        </div>
      </div>
    );

    const imageStep = {
      name: "Image type",
      component: (
        <React.Fragment>
          {this.isPendingChange() && (
            <Alert
              id="pending-changes-alert"
              variant="warning"
              isInline
              title={formatMessage(messages.warningUnsaved)}
            />
          )}
          {blueprint.packages.length == 0 && (
            <Alert
              id="empty-blueprint-alert"
              variant="warning"
              isInline
              title={formatMessage(messages.warningEmptyBlueprint)}
            />
          )}
          <Form isHorizontal className="cc-m-wide-label">
            <div className="pf-c-form__group cc-c-form__horizontal-align">
              <span className="pf-c-form__label-text">Blueprint</span>
              <div className="pf-c-form__horizontal-group cc-c-popover__horizontal-group">
                <Text id="blueprint-name">{blueprint.name}</Text>
                <Popover
                  id="popover-help"
                  bodyContent={formatMessage(messages.infotip)}
                  aria-label="process length help"
                >
                  <Button variant="plain" aria-label="process length help">
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
            </div>
            <FormGroup label={formatMessage({ id: "image-type", defaultMessage: "Type " })} fieldId="image-type">
              <FormSelect value={imageType} id="image-type" onChange={this.setImageType}>
                <FormSelectOption isDisabled key="default" value="" label={formatMessage(messages.selectOne)} />
                {imageTypes.map(type => (
                  <FormSelectOption isDisabled={!type.enabled} key={type.name} value={type.name} label={type.label} />
                ))}
              </FormSelect>
            </FormGroup>
            {imageType === "ami" && awsProviderCheckbox}
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
                  id="popover-help"
                  bodyContent={formatMessage(messages.imageSizePopover)}
                  aria-label="image size help"
                >
                  <Button variant="plain" aria-label="image size help">
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
                      size: minImageSize
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
          </Form>
        </React.Fragment>
      )
    };

    const awsUploadAuth = {
      name: "Authentication",
      component: (
        <React.Fragment>
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
                  id="popover-help"
                  bodyContent={
                    <FormattedMessage
                      defaultMessage="You can create and find existing Access key IDs on the {iam} page in the AWS console."
                      values={{
                        iam: <strong>Identity and Access Management (IAM)</strong>
                      }}
                    />
                  }
                  aria-label="access key id help"
                >
                  <Button variant="plain" aria-label="access key id help">
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
              <TextInput
                className="pf-c-form-control"
                value={this.state.uploadSettings["accessKeyID"]}
                type="password"
                id="access-key-id-input"
                name="accessKeyID"
                onChange={this.setUploadSettings}
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
                  id="popover-help"
                  bodyContent={
                    <FormattedMessage
                      defaultMessage="You can view the Secret access key only when you create a new Access key ID on the {iam} page in the AWS console."
                      values={{
                        iam: <strong>Identity and Access Management (IAM)</strong>
                      }}
                    />
                  }
                  aria-label="secret access key help"
                >
                  <Button variant="plain" aria-label="secret access key help">
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
              <TextInput
                className="pf-c-form-control"
                value={this.state.uploadSettings["secretAccessKey"]}
                type="password"
                id="secret-access-key-input"
                name="secretAccessKey"
                onChange={this.setUploadSettings}
              />
            </div>
          </Form>
        </React.Fragment>
      )
    };

    const awsUploadSettings = {
      name: "Destination",
      component: (
        <React.Fragment>
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
                    <React.Fragment>
                      <FormattedMessage defaultMessage="Provide a file name to be used for the image file that will be uploaded." />
                    </React.Fragment>
                  }
                  aria-label="image name help"
                >
                  <Button variant="plain" aria-label="image name help">
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
                <label htmlFor="bucket-input" className="pf-l-flex__item">
                  <span className="pf-c-form__label-text">Amazon S3 bucket</span>
                  <span className="pf-c-form__label-required" aria-hidden="true">
                    &#42;
                  </span>
                </label>
                <Popover
                  id="bucket-popover"
                  bodyContent={
                    <React.Fragment>
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
                          amazon: "Amazon"
                        }}
                      />
                    </React.Fragment>
                  }
                  aria-label="bucket help"
                >
                  <Button variant="plain" aria-label="bucket help">
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
              <TextInput
                className="pf-c-form-control"
                value={this.state.uploadSettings["bucket"]}
                type="text"
                id="bucket-input"
                name="bucket"
                onChange={this.setUploadSettings}
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
                        bucket: "S3 bucket"
                      }}
                    />
                  }
                  aria-label="region help"
                >
                  <Button variant="plain" aria-label="region help">
                    <OutlinedQuestionCircleIcon id="popover-icon" />
                  </Button>
                </Popover>
              </div>
              <TextInput
                className="pf-c-form-control"
                value={this.state.uploadSettings["region"]}
                type="text"
                id="region-input"
                name="region"
                onChange={this.setUploadSettings}
              />
            </div>
          </Form>
        </React.Fragment>
      )
    };

    const uploadStep = {
      name: `Upload to AWS`,
      steps: [awsUploadAuth, awsUploadSettings]
    };

    const awsReviewStep = uploadService === "aws" && (
      <TextContent>
        <div className="pf-l-flex pf-u-display-flex">
          <h3 className="pf-l-flex__item pf-u-mt-2xl pf-u-mb-md">
            <FormattedMessage defaultMessage="Upload to Amazon" />
          </h3>
          <Popover
            className="pf-l-flex__item"
            id="popover-help"
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
                      console: <a href="https://console.aws.amazon.com/console/home">AWS Management Console</a>
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
                        <a href="https://docs.aws.amazon.com/vm-import/latest/userguide/vmie_prereqs.html#vmimport-role">
                          AWS Required Service Role
                        </a>
                      )
                    }}
                  />
                </p>
              </TextContent>
            }
            aria-label="aws help"
          >
            <Button variant="plain" aria-label="aws help">
              <OutlinedQuestionCircleIcon id="popover-icon" />
            </Button>
          </Popover>
        </div>
        <TextList className="cc-m-column__fixed-width" component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Access key ID" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(this.state.uploadSettings["accessKeyID"].length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Secret access key" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {"*".repeat(this.state.uploadSettings["secretAccessKey"].length)}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Image name" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Amazon S3 bucket</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings["bucket"]}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="AWS region" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.uploadSettings["region"]}</TextListItem>
        </TextList>
      </TextContent>
    );

    const reviewStep = {
      name: "Review",
      component: (
        <React.Fragment>
          {this.missingRequiredFields() && (
            <Alert id="required-fields-alert" variant="danger" isInline title={formatMessage(messages.warningReview)} />
          )}
          <TextContent>
            <Title className="cc-c-popover__horizontal-group" headingLevel="h3" size="2xl">
              <FormattedMessage defaultMessage="Create and upload image" />
              <Popover bodyContent={formatMessage(messages.infotip)} aria-label="process length help">
                <Button variant="plain" aria-label="process length help">
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
                      size: minImageSize
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
        </React.Fragment>
      )
    };

    const steps = [imageStep, ...(showUploadAwsStep ? [uploadStep] : []), ...(showReviewStep ? [reviewStep] : [])];

    const createImageUploadFooter = (
      <WizardFooter>
        <WizardContextConsumer>
          {({ activeStep, onNext, onBack, onClose }) => {
            return (
              <React.Fragment>
                <Button
                  id="continue-button"
                  variant="primary"
                  isDisabled={
                    imageType === "" ||
                    imageSize === "" ||
                    (!this.isValidImageSize() && uploadService.length === 0) ||
                    (this.missingRequiredFields() && activeStep.name === "Review")
                  }
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
              </React.Fragment>
            );
          }}
        </WizardContextConsumer>
      </WizardFooter>
    );

    return (
      <React.Fragment>
        <Wizard
          id="create-image-upload-wizard"
          isOpen={this.props.isOpen}
          isCompactNav
          onClose={this.props.close}
          footer={createImageUploadFooter}
          title={formatMessage(messages.title)}
          steps={steps}
        />
      </React.Fragment>
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
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
  }),
  intl: intlShape.isRequired,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func
  })
};

CreateImageUpload.defaultProps = {
  blueprint: {},
  layout: {}
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
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
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
    setNotifications: PropTypes.func
  }),
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

CreateImageUploadModal.defaultProps = {
  blueprint: {},
  composeQueueFetched: true,
  fetchingQueue: function() {},
  clearQueue: function() {},
  imageTypes: [],
  fetchingComposeTypes: function() {},
  setBlueprint: function() {},
  startCompose: function() {},
  layout: {},
  isOpen: false
};

const mapStateToProps = state => ({
  composeQueue: state.composes.queue,
  composeQueueFetched: state.composes.queueFetched,
  imageTypes: state.composes.composeTypes
});

const mapDispatchToProps = dispatch => ({
  setBlueprint: blueprint => {
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
  startCompose: (blueprintName, composeType, upload) => {
    dispatch(startCompose(blueprintName, composeType, upload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateImageUpload));
