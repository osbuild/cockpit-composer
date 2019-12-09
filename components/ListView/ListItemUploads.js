import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  DataList,
  DataListItem,
  DataListCell,
  DataListItemRow,
  DataListItemCells,
  Text,
  TextVariants
} from "@patternfly/react-core";
import { ServiceIcon } from "@patternfly/react-icons";

class ListItemUploads extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  formatTime(rawTime) {
    const timestamp = new Date(rawTime * 1000);
    const formattedTime = timestamp.toDateString();
    return formattedTime;
  }

  render() {
    const uploads = this.props.uploads;

    return (
      <DataList aria-label="uploads data list">
        {uploads.map(upload => (
          <DataListItem key={upload.creation_time} aria-labelledby="uploads data list">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell isIcon key="icon">
                    <ServiceIcon />
                  </DataListCell>,
                  <DataListCell width={5} key="creation">
                    <Text>{upload.image_name}</Text>
                    <Text component={TextVariants.small}>
                      <FormattedMessage
                        defaultMessage="Created {time}"
                        values={{
                          time: this.formatTime(upload.creation_time)
                        }}
                      />
                    </Text>
                  </DataListCell>,
                  <DataListCell width={1} key="status">
                    {upload.status === "WAITING" && (
                      <div className="list-view-pf-additional-info-item">
                        <span className="pficon pficon-pending" aria-hidden="true" />
                        <FormattedMessage defaultMessage="Failed" />
                      </div>
                    )}
                    {upload.status === "RUNNING" && (
                      <div className="list-view-pf-additional-info-item">
                        <span className="pficon pficon-in-progress" aria-hidden="true" />
                        <FormattedMessage defaultMessage="Failed" />
                      </div>
                    )}
                    {upload.status === "FINISHED" && (
                      <div className="list-view-pf-additional-info-item">
                        <span className="pficon pficon-ok" aria-hidden="true" />
                        <FormattedMessage defaultMessage="Failed" />
                      </div>
                    )}
                    {upload.status === "FAILED" && (
                      <div className="list-view-pf-additional-info-item">
                        <span className="pficon pficon-error-circle-o" aria-hidden="true" />
                        <FormattedMessage defaultMessage="Failed" />
                      </div>
                    )}
                  </DataListCell>
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    );
  }
}
ListItemUploads.propTypes = {
  uploads: PropTypes.arrayOf(PropTypes.object)
};

ListItemUploads.defaultProps = {
  uploads: []
};

export default injectIntl(ListItemUploads);
