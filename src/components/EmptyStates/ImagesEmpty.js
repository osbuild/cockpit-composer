import React from "react";
import PropTypes from "prop-types";
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import CreateImageWizard from "../Wizard/CreateImageWizard";

const ImagesEmpty = ({ blueprint }) => (
  <EmptyState>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      <FormattedMessage defaultMessage="No images" />
    </Title>
    <EmptyStateBody />
    <CreateImageWizard blueprint={blueprint} />
  </EmptyState>
);

ImagesEmpty.propTypes = {
  blueprint: PropTypes.object,
};

export default ImagesEmpty;
