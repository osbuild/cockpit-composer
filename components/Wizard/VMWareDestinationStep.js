import React from "react";
import { Button, Form, Popover, Text, TextInput } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const ariaLabels = defineMessages({
  imageName: {
    defaultMessage: "Image name help",
  },
  host: {
    defaultMessage: "Host help",
  },
  cluster: {
    defaultMessage: "Cluster help",
  },
  dataCenter: {
    defaultMessage: "Datacenter help",
  },
  dataStore: {
    defaultMessage: "Datastore help",
  },
});

class VMWareDestinationStep extends React.PureComponent {
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
              <label htmlFor="vmware-host-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Host" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <FormattedMessage
                    defaultMessage="Provide the url of your {vmware} instance to which the image file will be uploaded."
                    values={{
                      vmware: "VMWare vSphere",
                    }}
                  />
                }
                aria-label={formatMessage(ariaLabels.host)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.host)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.host}
              type="text"
              id="vmware-host-input"
              name="host"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="cluster-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Cluster" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <FormattedMessage defaultMessage="Provide the name of the Cluster to which the image file will be uploaded." />
                }
                aria-label={formatMessage(ariaLabels.cluster)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.cluster)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.cluster}
              type="text"
              id="cluster-input"
              name="cluster"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="data-center-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Data center" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <FormattedMessage defaultMessage="Provide the name of the Datacenter to which the image file will be uploaded." />
                }
                aria-label={formatMessage(ariaLabels.dataCenter)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.dataCenter)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.dataCenter}
              type="text"
              id="data-center-input"
              name="dataCenter"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="data-store-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Data store" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
              <Popover
                id="bucket-popover"
                bodyContent={
                  <FormattedMessage defaultMessage="Provide the name of the Datastore to which the image file will be uploaded." />
                }
                aria-label={formatMessage(ariaLabels.dataStore)}
              >
                <Button variant="plain" aria-label={formatMessage(ariaLabels.dataStore)}>
                  <OutlinedQuestionCircleIcon id="popover-icon" />
                </Button>
              </Popover>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.dataStore}
              type="text"
              id="data-store-input"
              name="dataStore"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

VMWareDestinationStep.propTypes = {
  intl: intlShape.isRequired,
  imageName: PropTypes.string,
  setUploadSettings: PropTypes.func,
  setImageName: PropTypes.func,
  uploadSettings: PropTypes.object,
};

VMWareDestinationStep.defaultProps = {
  imageName: "",
  uploadSettings: {},
  setImageName() {},
  setUploadSettings() {},
};

export default injectIntl(VMWareDestinationStep);
