import React, { useState } from "react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Spinner,
  EmptyStateHeader,
  EmptyStateFooter,
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
      <EmptyStateHeader
        titleText={
          <>
            <FormattedMessage defaultMessage="OSBuild Composer is not started" />
          </>
        }
        icon={<EmptyStateIcon icon={CubesIcon} />}
        headingLevel="h4"
      />
      <EmptyStateBody />
      <EmptyStateFooter>
        <Button variant="primary" onClick={handleClick}>
          <FormattedMessage defaultMessage="Start socket" />
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );

  const Loading = () => (
    <EmptyState>
      <EmptyStateHeader
        titleText={
          <>
            <FormattedMessage defaultMessage="Starting OSBuild Composer" />
          </>
        }
        icon={<EmptyStateIcon icon={Spinner} />}
        headingLevel="h4"
      />
    </EmptyState>
  );

  return isLoading ? <Loading /> : <Content />;
};

export default APIEmpty;
