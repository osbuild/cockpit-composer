// Copied from https://github.com/RedHatInsights/image-builder-frontend

import React, { useContext, useEffect, useState } from "react";

import { useFormApi } from "@data-driven-forms/react-form-renderer";
import WizardContext from "@data-driven-forms/react-form-renderer/wizard-context";
import { Button } from "@patternfly/react-core";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

const FileSystemConfigButtons = ({ handleNext, handlePrev, nextStep }) => {
  const { formOptions } = useContext(WizardContext);
  const { change, getState } = useFormApi();
  const [hasErrors, setHasErrors] = useState(
    getState()?.errors?.customizations?.filesystem ? true : false
  );
  const [nextHasBeenClicked, setNextHasBeenClicked] = useState(false);

  useEffect(() => {
    const errors = getState()?.errors?.customizations?.filesystem;
    errors ? setHasErrors(true) : setHasErrors(false);

    if (!errors) {
      setNextHasBeenClicked(false);
      change("filesystem-config-show-errors", false);
    }
  });

  const handleClick = () => {
    if (!hasErrors) {
      handleNext(nextStep);
    }

    setNextHasBeenClicked(true);
    change("filesystem-config-show-errors", true);
  };

  return (
    <>
      <Button
        variant="primary"
        type="button"
        isDisabled={hasErrors && nextHasBeenClicked}
        onClick={handleClick}
      >
        <FormattedMessage defaultMessage="Next" />
      </Button>
      <Button variant="secondary" type="button" onClick={handlePrev}>
        <FormattedMessage defaultMessage="Back" />
      </Button>
      <div className="pf-c-wizard__footer-cancel">
        <Button type="button" variant="link" onClick={formOptions.onCancel}>
          <FormattedMessage defaultMessage="Cancel" />
        </Button>
      </div>
    </>
  );
};

FileSystemConfigButtons.propTypes = {
  handleNext: PropTypes.func,
  handlePrev: PropTypes.func,
  nextStep: PropTypes.string,
};

export default FileSystemConfigButtons;
