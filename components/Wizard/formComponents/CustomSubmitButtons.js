import React, { useContext, useState } from "react";
import { Button } from "@patternfly/react-core";
import { FormSpy } from "@data-driven-forms/react-form-renderer";
import WizardContext from "@data-driven-forms/react-form-renderer/wizard-context";
import PropTypes from "prop-types";

const CustomButtons = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { handlePrev, formOptions } = useContext(WizardContext);
  return (
    <FormSpy>
      {() => (
        <>
          <Button
            variant="primary"
            type="button"
            isDisabled={!formOptions.valid || isSaving}
            isLoading={isSaving}
            onClick={() => {
              formOptions.onSubmit({
                values: formOptions.getState().values,
                setIsSaving,
              });
            }}
          >
            {isSaving ? "Creating image" : "Create image"}
          </Button>
          <Button type="button" variant="secondary" onClick={handlePrev} isDisabled={isSaving}>
            Back
          </Button>
          <Button type="button" variant="link" onClick={formOptions.onCancel} isDisabled={isSaving}>
            Cancel
          </Button>
        </>
      )}
    </FormSpy>
  );
};

CustomButtons.propTypes = {
  isSaving: PropTypes.bool,
};

export default CustomButtons;
