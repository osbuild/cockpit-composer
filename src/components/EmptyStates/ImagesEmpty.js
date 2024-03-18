import React from "react";
import PropTypes from "prop-types";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateFooter,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import CreateImageWizard from "../Wizard/CreateImageWizard";

const ImagesEmpty = ({ blueprint }) => (
  <EmptyState>
    <EmptyStateHeader
      titleText={
        <>
          <FormattedMessage defaultMessage="No images" />
        </>
      }
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody />
    <EmptyStateFooter>
      <CreateImageWizard blueprint={blueprint} />
    </EmptyStateFooter>
  </EmptyState>
);

ImagesEmpty.propTypes = {
  blueprint: PropTypes.object,
};

export default ImagesEmpty;
