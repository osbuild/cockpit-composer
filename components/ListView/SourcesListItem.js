import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import { Button, Spinner } from "@patternfly/react-core";
import DropdownKebab from "../Dropdown/DropdownKebab";

const messages = defineMessages({
  edit: {
    defaultMessage: "Edit source",
  },
  kebab: {
    defaultMessage: "Source actions",
  },
  remove: {
    defaultMessage: "Remove source",
  },
  baseurl: {
    defaultMessage: "yum repository",
  },
  mirrorlist: {
    defaultMessage: "mirrorlist",
  },
  metalink: {
    defaultMessage: "metalink",
  },
});

class SourcesListItem extends React.Component {
  constructor(props) {
    super(props);
    this.editButton = React.createRef();
  }

  componentDidMount() {
    if (this.props.edited === this.props.source.name) {
      this.editButton.current.focus();
    }
  }

  render() {
    const { source, key } = this.props;
    const type = source.type.substring("yum-".length);
    const { formatMessage } = this.props.intl;

    const dropdownItems = [
      <li key="remove">
        <Button variant="plain" onClick={() => this.props.remove(source.name)}>
          {formatMessage(messages.remove)}
        </Button>
      </li>,
    ];

    return (
      <div className="list-pf-item" key={key} data-source={source.name}>
        <div className="list-pf-container">
          <div className="list-pf-content list-pf-content-flex">
            <div className="list-pf-left">
              <span className="pficon pficon-repository list-pf-icon-small" aria-hidden="true" />
            </div>
            <div className="list-pf-content-wrapper">
              <div className="list-pf-main-content">
                <div className="list-pf-title text-overflow-pf">{source.name}</div>
                <div className="list-pf-description">
                  <FormattedMessage
                    defaultMessage="Type {sourceType}"
                    values={{
                      sourceType: <strong>{formatMessage(messages[type])}</strong>,
                    }}
                  />
                </div>
              </div>
              <div className="list-pf-additional-content text-muted">{source.url}</div>
            </div>
            {this.props.edit ? (
              !this.props.fetching ? (
                <div className="list-pf-actions">
                  <button
                    aria-label={`${formatMessage(messages.edit)} ${source.name}`}
                    className="btn btn-default"
                    type="button"
                    ref={this.editButton}
                    onClick={() => this.props.edit(source.name)}
                  >
                    <span aria-hidden="true" className="pficon pficon-edit" />
                  </button>
                  <DropdownKebab dropdownItems={dropdownItems} />
                </div>
              ) : (
                <div className="list-pf-actions">
                  <em className="text-muted">
                    <Spinner loading size="xs" inline />
                    <FormattedMessage defaultMessage="Removing source" />
                  </em>
                </div>
              )
            ) : (
              <div className="list-pf-actions">
                <em className="text-muted">
                  <FormattedMessage
                    defaultMessage="System source"
                    description="System sources are configured repositories that were found on the host machine"
                  />
                </em>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

SourcesListItem.propTypes = {
  source: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  key: PropTypes.string,
  edited: PropTypes.string,
  fetching: PropTypes.string,
  edit: PropTypes.func,
  remove: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

SourcesListItem.defaultProps = {
  source: {},
  key: "",
  edited: "",
  fetching: false,
  edit: undefined,
  remove: undefined,
};

export default injectIntl(SourcesListItem);
