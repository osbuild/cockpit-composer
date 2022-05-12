import React from "react";
import { defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { Button, DataListItem, DataListItemRow, DataListCell, DataListItemCells } from "@patternfly/react-core";
import { CaretDownIcon, ServiceIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  imageName: {
    defaultMessage: "Image name",
    description: "The name given by the user for an image",
  },
  uploadType: {
    defaultMessage: "Upload type",
    description: "A label for the service to which an image was uploaded",
  },
  timeStarted: {
    defaultMessage: "Started",
    description: "A label for the date that an image upload was started",
  },
  uploadActions: {
    defaultMessage: "Actions",
    description: "A label for the menu that displays the actions available",
  },
  uploadLogs: {
    defaultMessage: "Logs",
    description: "Log content that gets generated as part of the upload process",
  },
  uploadStatusWaiting: {
    defaultMessage: "Upload pending",
    description: "Upload status when process is waiting",
  },
  uploadStatusRunning: {
    defaultMessage: "Upload in progress",
    description: "Upload status when process is in progress",
  },
  uploadStatusFinished: {
    defaultMessage: "Upload complete",
    description: "Upload status when process is finished",
  },
  uploadStatusFailed: {
    defaultMessage: "Upload failed",
    description: "Upload status when process failed",
  },
});

class ListItemUploads extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uploadProviderToLabel = this.uploadProviderToLabel.bind(this);
  }

  uploadProviderToLabel(uploadType) {
    const uploadTypeLabels = {
      aws: "AWS",
      azure: "Azure",
      vmware: "VMWare",
    };
    return uploadTypeLabels[uploadType] !== undefined ? uploadTypeLabels[uploadType] : uploadType;
  }

  render() {
    const { upload } = this.props;
    const { formatMessage } = this.props.intl;
    const timestamp = new Date(upload.creation_time * 1000);
    const formattedTime = timestamp.toDateString();
    const logsButton = <Button variant="secondary">{formatMessage(messages.uploadLogs)}</Button>;
    const uploadStatus = () => {
      switch (upload.status) {
        case "WAITING":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <span className="pficon pficon-pending" aria-hidden="true" />
              </div>
              {formatMessage(messages.uploadStatusWaiting)}
            </div>
          );
        case "RUNNING":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <div className="spinner spinner-xs" />
              </div>
              {formatMessage(messages.uploadStatusRunning)}
            </div>
          );
        case "FINISHED":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <span className="pficon pficon-ok" aria-hidden="true" />
              </div>
              {formatMessage(messages.uploadStatusFinished)}
            </div>
          );
        case "FAILED":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <span className="pficon pficon-error-circle-o" aria-hidden="true" />
              </div>
              {formatMessage(messages.uploadStatusFailed)}
            </div>
          );
        default:
          return <></>;
      }
    };

    return (
      <DataListItem aria-labelledby={`${upload.uuid}-type ${upload.uuid}-name`}>
        <DataListItemRow>
          <div className="pf-c-data-list__item-control cc-u-not-visible">
            <div className="pf-c-data-list__toggle">
              <Button variant="plain" aria-hidden="true">
                <CaretDownIcon />
              </Button>
            </div>
          </div>
          <div className="cc-c-data-list__item-icon">
            <ServiceIcon />
          </div>
          <DataListItemCells
            className="cc-m-stacked cc-m-split-on-lg"
            dataListCells={[
              <DataListCell key="primary" className="pf-l-flex pf-m-column pf-m-space-items-xs">
                {upload.image_name && upload.image_name !== "" && (
                  <div className="pf-l-flex__item">
                    <span>{formatMessage(messages.imageName)}</span>{" "}
                    <strong id={`${upload.uuid}-name`}>{upload.image_name}</strong>
                  </div>
                )}
                <div className="pf-l-flex__item">
                  <span>{formatMessage(messages.uploadType)}</span>{" "}
                  <strong id={`${upload.uuid}-type`}>{this.uploadProviderToLabel(upload.provider_name)}</strong>
                </div>
                <div className="pf-l-flex__item">
                  <span>{formatMessage(messages.timeStarted)}</span> <strong>{formattedTime}</strong>
                </div>
              </DataListCell>,
              <DataListCell key="status">{uploadStatus()}</DataListCell>,
            ]}
          />
          <div className="pf-c-data-list__item-action cc-u-not-visible" aria-hidden="true">
            <div className="dropdown pull-right dropdown-kebab-pf">
              <button
                aria-label={formatMessage(messages.uploadActions)}
                className="btn btn-link dropdown-toggle"
                type="button"
                id={`${upload.uuid}-actions`}
              >
                <span className="fa fa-ellipsis-v" />
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="pf-c-data-list__item-action cc-u-not-visible">
            {logsButton}
          </div>
        </DataListItemRow>
      </DataListItem>
    );
  }
}
ListItemUploads.propTypes = {
  upload: PropTypes.shape({
    creation_time: PropTypes.number,
    image_name: PropTypes.string,
    provider_name: PropTypes.string,
    status: PropTypes.string,
    uuid: PropTypes.string,
  }),
  intl: PropTypes.object.isRequired,
};

ListItemUploads.defaultProps = {
  upload: {},
};

export default injectIntl(ListItemUploads);
