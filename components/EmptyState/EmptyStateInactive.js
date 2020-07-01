import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import cockpit from "cockpit";
import { Alert, Button, OverlayTrigger, Tooltip } from "patternfly-react";
import EmptyState from "./EmptyState";

const messages = defineMessages({
  errorInactiveTitle: {
    defaultMessage: "Image Building Service is Not Active",
  },
  errorInactivePrimary: {
    defaultMessage: "Start",
  },
  errorInactiveSecondary: {
    defaultMessage: "Troubleshoot",
  },
  errorInactiveCheckbox: {
    defaultMessage: "Automatically start osbuild-composer on boot",
  },
  alertTitleEnableServiceFailure: {
    defaultMessage: "The service osbuild-composer was not started.",
  },
  alertMessagePreface: {
    defaultMessage: "Message",
  },
});

const permission = cockpit.permission({ admin: true });

class EmptyStateInactive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableService: true,
      enableServiceFailure: "",
      allowed: true,
      user: "",
    };
    this.onPermissionChanged = this.onPermissionChanged.bind(this);
    this.startService = this.startService.bind(this);
    this.goToServicePage = this.goToServicePage.bind(this);
  }

  componentDidMount() {
    permission.addEventListener("changed", this.onPermissionChanged);
  }

  componentWillUnmount() {
    permission.removeEventListener("changed", this.onPermissionChanged);
  }

  onPermissionChanged() {
    this.setState({ allowed: permission.allowed !== false });
    this.setState({ user: permission.user.name });
  }

  startService(e) {
    if (!e || e.button !== 0) return;
    let argv;
    if (this.state.enableService) {
      argv = ["systemctl", "enable", "--now", "osbuild-composer.socket"];
    } else {
      argv = ["systemctl", "start", "osbuild-composer.socket"];
    }
    cockpit
      .spawn(argv, { superuser: "require", err: "message" })
      .then(() => this.props.fetchingBlueprints())
      .catch((err) => {
        this.setState({ enableServiceFailure: err.message });
        console.error("Failed to start osbuild-composer.socket:", JSON.stringify(err));
      });
  }

  goToServicePage(e) {
    if (!e || e.button !== 0) return;
    cockpit.jump("/system/services#/osbuild-composer.service");
  }

  render() {
    const { user, allowed } = this.state;
    const { formatMessage } = this.props.intl;
    const startButton = !allowed ? (
      <OverlayTrigger
        overlay={
          <Tooltip id="cmpsr-tooltip-start" trigger={["hover", "focus"]}>
            <FormattedMessage
              defaultMessage="The user {userName} is not permitted to start services."
              values={{
                userName: <strong>{user}</strong>,
              }}
            />
          </Tooltip>
        }
      >
        <Button bsStyle="primary" bsSize="large" className="disabled cmpsr-has-tooltip">
          {formatMessage(messages.errorInactivePrimary)}
        </Button>
      </OverlayTrigger>
    ) : (
      <Button bsStyle="primary" bsSize="large" onClick={this.startService}>
        {formatMessage(messages.errorInactivePrimary)}
      </Button>
    );
    return (
      <>
        {this.state.enableServiceFailure !== "" && (
          <Alert className="cmpsr-alert-blank-slate">
            <strong>{formatMessage(messages.alertTitleEnableServiceFailure)}</strong>
            {` `}
            {formatMessage(messages.alertMessagePreface)}
            {`: `}
            {this.state.enableServiceFailure}
          </Alert>
        )}
        <EmptyState title={formatMessage(messages.errorInactiveTitle)} icon="fa fa-exclamation-circle">
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={this.state.enableService}
                onChange={(e) => this.setState({ enableService: e.target.checked })}
                disabled={!allowed}
              />
              {formatMessage(messages.errorInactiveCheckbox)}
            </label>
          </div>
          <div className="blank-slate-pf-main-action">{startButton}</div>
          <div className="blank-slate-pf-secondary-action">
            <Button onClick={this.goToServicePage}>{formatMessage(messages.errorInactiveSecondary)}</Button>
          </div>
        </EmptyState>
      </>
    );
  }
}

EmptyStateInactive.propTypes = {
  fetchingBlueprints: PropTypes.func,
  intl: intlShape.isRequired,
};

EmptyStateInactive.defaultProps = {
  fetchingBlueprints() {},
};

export default injectIntl(EmptyStateInactive);
