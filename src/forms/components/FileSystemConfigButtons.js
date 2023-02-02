import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Button } from "@patternfly/react-core";
import { FormSpy } from "@data-driven-forms/react-form-renderer";
import WizardContext from "@data-driven-forms/react-form-renderer/wizard-context";

const FileSystemConfigButtons = ({ handleNext, handlePrev, nextStep }) => {
  const { formOptions } = useContext(WizardContext);

  return (
    <FormSpy>
      {({ errors }) => (
        <>
          <Button
            variant="primary"
            type="button"
            isDisabled={Object.keys(errors).length}
            onClick={() => handleNext(nextStep)}
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
      )}
    </FormSpy>
  );
};

FileSystemConfigButtons.propTypes = {
  handleNext: PropTypes.func,
  handlePrev: PropTypes.func,
  nextStep: PropTypes.string,
};

export default FileSystemConfigButtons;
