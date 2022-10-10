import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from "@patternfly/react-core";
import { selectAllAlerts, removeAlert } from "../../slices/alertsSlice";

import "./Notifications.css";

const Notifications = () => {
  const dispatch = useDispatch();
  const getAlerts = () => useSelector(selectAllAlerts);
  const alerts = getAlerts();

  return (
    <AlertGroup isToast>
      {alerts.map((alert) => {
        switch (alert.type) {
          case "composeQueued": {
            return (
              <Alert
                id="alertComposeQueued"
                key={alert.id}
                variant="info"
                title={
                  <FormattedMessage
                    defaultMessage="{blueprint} Image creation has been added to the {queue}."
                    values={{
                      blueprint: <strong>{alert.blueprintName}:</strong>,
                      queue: (
                        <a href={`#blueprint/${alert.blueprintName}`}>queue</a>
                      ),
                    }}
                  />
                }
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => dispatch(removeAlert(alert.id))}
                  />
                }
              />
            );
          }
          case "composeStarted": {
            return (
              <Alert
                id="alertComposeStarted"
                key={alert.id}
                variant="info"
                title={
                  <FormattedMessage
                    defaultMessage="{blueprint} Image creation has {queue}."
                    values={{
                      blueprint: <strong>{alert.blueprintName}:</strong>,
                      queue: (
                        <a href={`#blueprint/${alert.blueprintName}`}>
                          started
                        </a>
                      ),
                    }}
                  />
                }
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => dispatch(removeAlert(alert.id))}
                  />
                }
              />
            );
          }
          case "composeSucceeded": {
            return (
              <Alert
                id="alertComposeSucceeded"
                key={alert.id}
                variant="success"
                title={
                  <FormattedMessage
                    defaultMessage="{blueprint} Image creation is {queue}."
                    values={{
                      blueprint: <strong>{alert.blueprintName}:</strong>,
                      queue: (
                        <a href={`#blueprint/${alert.blueprintName}`}>
                          complete
                        </a>
                      ),
                    }}
                  />
                }
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => dispatch(removeAlert(alert.id))}
                  />
                }
              />
            );
          }
          case "composeFailed": {
            return (
              <Alert
                id="alertComposeFailed"
                key={alert.id}
                variant="danger"
                title={
                  <FormattedMessage
                    defaultMessage="{blueprint} Image creation failed."
                    values={{
                      blueprint: <strong>{alert.blueprintName}:</strong>,
                    }}
                  />
                }
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => dispatch(removeAlert(alert.id))}
                  />
                }
              ></Alert>
            );
          }
          default:
            break;
        }
      })}
    </AlertGroup>
  );
};

Notifications.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.object),
  removeAlert: PropTypes.func,
};

Notifications.defaultProps = {
  alerts: [],
  removeAlert() {},
};

export default Notifications;
