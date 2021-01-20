import React from "react";
import { Form, Text, TextInput } from "@patternfly/react-core";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";

class VMWareAuthStep extends React.PureComponent {
  render() {
    const { uploadSettings, setUploadSettings } = this.props;

    return (
      <>
        <Text className="help-block cc-c-form__required-text">
          <FormattedMessage defaultMessage="All fields are required." />
        </Text>
        <Form isHorizontal className="cc-m-wide-label">
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="vmware-username-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Username" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.username}
              id="vmware-username-input"
              name="username"
              onChange={setUploadSettings}
            />
          </div>
          <div className="pf-c-form__group">
            <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-u-display-flex pf-m-justify-content-flex-start pf-m-nowrap">
              <label htmlFor="vmware-password-input" className="pf-l-flex__item">
                <span className="pf-c-form__label-text">
                  <FormattedMessage defaultMessage="Password" />
                </span>
                <span className="pf-c-form__label-required" aria-hidden="true">
                  &#42;
                </span>
              </label>
            </div>
            <TextInput
              className="pf-c-form-control"
              value={uploadSettings.password}
              type="password"
              id="vmware-password-input"
              name="password"
              onChange={setUploadSettings}
            />
          </div>
        </Form>
      </>
    );
  }
}

VMWareAuthStep.propTypes = {
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.object,
};

VMWareAuthStep.defaultProps = {
  uploadSettings: {},
  setUploadSettings() {},
};

export default injectIntl(VMWareAuthStep);
