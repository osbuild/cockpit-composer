import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  ClipboardCopy,
  ClipboardCopyVariant,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
} from "@patternfly/react-core";
import { CheckCircleIcon, TimesCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";

const UserCard = ({ user }) => {
  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h4" size="xl">
          <FormattedMessage defaultMessage="User" />
        </Title>
      </CardTitle>
      <Divider />
      <CardBody>
        <DescriptionList isCompact isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>
              <FormattedMessage defaultMessage="Name" />
            </DescriptionListTerm>
            <DescriptionListDescription>
              {user?.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Admin</DescriptionListTerm>
            <DescriptionListDescription>
              {user?.groups?.includes("wheel") ? (
                <CheckCircleIcon className="success" />
              ) : (
                <TimesCircleIcon className="error" />
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Password</DescriptionListTerm>
            <DescriptionListDescription>
              {user?.password?.length ? (
                <CheckCircleIcon className="success" />
              ) : (
                <TimesCircleIcon className="error" />
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>SSH key</DescriptionListTerm>
            <DescriptionListDescription>
              {user?.key ? (
                <ClipboardCopy
                  hoverTip="Copy"
                  clickTip="Copied"
                  variant={ClipboardCopyVariant.expansion}
                >
                  {user?.key}
                </ClipboardCopy>
              ) : (
                <TimesCircleIcon className="error" />
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
      <CardFooter />
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.object,
};

export default UserCard;
