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
import { fetchingUploadProviders } from "../../core/actions/uploads";

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
      minImageSize: null,
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
    this.setImageType = this.setImageType.bind(this);
    this.setUploadSettings = this.setUploadSettings.bind(this);
    this.handleUploadService = this.handleUploadService.bind(this);
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
  }

  componentWillMount() {
    this.props.fetchingUploadProviders();
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

  setUploadSettings(value, event) {
    const key = event.target.id;
    this.setState(prevState => ({ uploadSettings: Object.assign({}, prevState.uploadSettings, { [key]: value }) }));
  }

  setImageSize(value) {
    this.setState({
      imageSize: value
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
    const settingsLength =
      Object.keys(this.props.providerSettings[this.state.uploadService].auth).length +
      Object.keys(this.props.providerSettings[this.state.uploadService].settings).length;
    if (Object.keys(this.state.uploadSettings).length != settingsLength) return true;
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
    const { blueprint, imageTypes, providerSettings } = this.props;
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

    const providerCheckbox = (provider, displayName) => (
      <FormGroup
        label={this.props.intl.formatMessage({ id: `${provider}-form`, defaultMessage: "Upload image" })}
        fieldId="provider-checkbox"
      >
        <Checkbox
          value={provider}
          isChecked={this.state.uploadService === provider}
          onChange={this.handleUploadService}
          label={this.props.intl.formatMessage({
            id: `${provider}-checkbox`,
            defaultMessage: `Upload to ${displayName}`
          })}
          id={`${provider}-checkbox`}
          aria-labelledby="provider-checkbox"
        />
      </FormGroup>
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
          <Form isHorizontal>
            <div className="pf-c-form__group">
              <label className="pf-c-form__label" htmlFor="blueprint-name">
                <span className="pf-c-form__label-text">Blueprint</span>
              </label>
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
            {imageType === "ami" && providerCheckbox("aws", "AWS")}
            <div className="pf-c-form__group">
              <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
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

    const uploadAuth = provider => ({
      name: "Authentication",
      component: (
        <React.Fragment>
          <Text className="help-block cc-c-form__required-text">
            <FormattedMessage defaultMessage="All fields are required." />
          </Text>
          {providerSettings[provider] !== undefined && (
            <Form isHorizontal>
              {Object.keys(providerSettings[provider].auth).map(key => (
                <FormGroup
                  label={formatMessage({
                    id: `${provider}-auth`,
                    defaultMessage: providerSettings[provider].auth[key].displayText
                  })}
                  fieldId={key}
                  key={key}
                >
                  <TextInput
                    value={this.state.uploadSettings[key] || ""}
                    type={providerSettings[provider].auth[key].isPassword ? "password" : "text"}
                    id={key}
                    key={key}
                    onChange={this.setUploadSettings}
                    isRequired
                  />
                </FormGroup>
              ))}
            </Form>
          )}
        </React.Fragment>
      )
    });

    const uploadSettings = provider => ({
      name: "File upload",
      component: (
        <React.Fragment>
          <Text className="help-block cc-c-form__required-text">
            <FormattedMessage defaultMessage="All fields are required." />
          </Text>
          {providerSettings[provider] !== undefined && (
            <Form isHorizontal>
              <FormGroup label={formatMessage({ id: "image-name", defaultMessage: "Image name" })} fieldId="image-name">
                <TextInput
                  value={imageName}
                  type="text"
                  id="image-name"
                  aria-describedby="image-name"
                  onChange={() => this.setState({ imageName: event.target.value })}
                  isRequired
                />
              </FormGroup>
              {Object.keys(providerSettings[provider].settings).map(key => (
                <FormGroup
                  label={formatMessage({
                    id: `${provider}-settings`,
                    defaultMessage: providerSettings[provider].settings[key].displayText
                  })}
                  fieldId={key}
                  key={key}
                >
                  <TextInput
                    value={this.state.uploadSettings[key] || ""}
                    type={providerSettings[provider].settings[key].isPassword ? "password" : "text"}
                    id={key}
                    key={key}
                    onChange={this.setUploadSettings}
                    isRequired
                  />
                </FormGroup>
              ))}
            </Form>
          )}
        </React.Fragment>
      )
    });

    const uploadStep = (provider, displayName) => ({
      name: `Upload to ${displayName}`,
      steps: [uploadAuth(provider), uploadSettings(provider)]
    });

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
            {providerSettings[uploadService] !== undefined && (
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                  <FormattedMessage defaultMessage="Image name" />
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{imageName}</TextListItem>
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
                {Object.keys(providerSettings[uploadService].auth).map(key => (
                  <React.Fragment key={key}>
                    <TextListItem component={TextListItemVariants.dt}>
                      {formatMessage({
                        id: "review-settings",
                        defaultMessage: providerSettings[uploadService].auth[key].displayText
                      })}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                      {providerSettings[uploadService].auth[key].isPassword &&
                      this.state.uploadSettings[key] != undefined
                        ? "*".repeat(this.state.uploadSettings[key].length)
                        : this.state.uploadSettings[key]}
                    </TextListItem>
                  </React.Fragment>
                ))}
                {Object.keys(providerSettings[uploadService].settings).map(key => (
                  <React.Fragment key={key}>
                    <TextListItem component={TextListItemVariants.dt}>
                      {formatMessage({
                        id: "review-settings",
                        defaultMessage: providerSettings[uploadService].settings[key].displayText
                      })}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                      {providerSettings[uploadService].settings[key].isPassword &&
                      this.state.uploadSettings[key] != undefined
                        ? "*".repeat(this.state.uploadSettings[key].length)
                        : this.state.uploadSettings[key]}
                    </TextListItem>
                  </React.Fragment>
                ))}
              </TextList>
            )}
          </TextContent>
        </React.Fragment>
      )
    };

    const steps = [
      imageStep,
      ...(showUploadAwsStep ? [uploadStep("aws", "AWS")] : []),
      ...(showReviewStep ? [reviewStep] : [])
    ];

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
  providerSettings: PropTypes.objectOf(PropTypes.object),
  fetchingUploadProviders: PropTypes.func,
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
  providerSettings: {},
  fetchingComposeTypes: function() {},
  fetchingUploadProviders: function() {},
  setBlueprint: function() {},
  startCompose: function() {},
  layout: {},
  isOpen: false
};

const mapStateToProps = state => ({
  composeQueue: state.composes.queue,
  composeQueueFetched: state.composes.queueFetched,
  imageTypes: state.composes.composeTypes,
  providerSettings: state.uploads.providerSettings
});

const mapDispatchToProps = dispatch => ({
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  fetchingUploadProviders: () => {
    dispatch(fetchingUploadProviders());
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
