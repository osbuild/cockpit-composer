import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  ClipboardCopy,
  ClipboardCopyVariant,
  Gallery,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
} from "@patternfly/react-core";
import { CheckCircleIcon, TimesCircleIcon } from "@patternfly/react-icons";

const UsersTab = (props) => {
  const userCard = (user) => (
    <Card key={user?.name}>
      <CardTitle>
        <Title headingLevel="h4" size="xl">
          {user?.name}
        </Title>
      </CardTitle>
      <Divider />
      <CardBody>
        <DescriptionList isCompact isHorizontal>
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

  return (
    <Gallery
      className="pf-u-p-lg"
      hasGutter
      maxWidths={{
        md: "280px",
        lg: "320px",
        "2xl": "400px",
      }}
    >
      {props.users?.map((user) => userCard(user))}
    </Gallery>
  );
};

UsersTab.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default UsersTab;
