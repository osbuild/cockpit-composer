import React, { useState } from "react";
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Spinner,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import cockpit from "cockpit";
import { getAPIStatus } from "../../api";

const APIEmpty = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    const argv = ["systemctl", "enable", "--now", "osbuild-composer.socket"];
    cockpit
      .spawn(argv, { superuser: "require", err: "message" })
      .then(() => getAPIStatus())
      .then(() => window.location.reload());
  };

  const Content = () => (
    <EmptyState variant={EmptyStateVariant.xl}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        <FormattedMessage defaultMessage="OSBuild Composer is not started" />
      </Title>
      <EmptyStateBody />
      <Button variant="primary" onClick={handleClick}>
        <FormattedMessage defaultMessage="Start socket" />
      </Button>
    </EmptyState>
  );

  const Loading = () => (
    <EmptyState>
      <EmptyStateIcon variant="container" component={Spinner} />
      <Title size="lg" headingLevel="h4">
        <FormattedMessage defaultMessage="Starting OSBuild Composer" />
      </Title>
    </EmptyState>
  );

  return isLoading ? <Loading /> : <Content />;
};

export default APIEmpty;
