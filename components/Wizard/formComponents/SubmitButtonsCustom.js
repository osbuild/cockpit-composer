import React, { useContext, useState } from "react";
import { Button, Tooltip } from "@patternfly/react-core";
import { FormSpy } from "@data-driven-forms/react-form-renderer";
import WizardContext from "@data-driven-forms/react-form-renderer/wizard-context";
import PropTypes from "prop-types";

const SubmitButtonsCustom = ({ buttonLabels: { cancel, submit, back } }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const { handlePrev, formOptions } = useContext(WizardContext);

  return (
    <FormSpy>
      {() => (
        <>
          <Button
            variant="primary"
            isDisabled={!formOptions.valid || formOptions.getState().validating || isSaving || hasSaved}
            isLoading={isSaving}
            onClick={() =>
              formOptions.onSubmit("save", {
                formValues: formOptions.getState().values,
                setIsSaving,
                setHasSaved,
              })
            }
          >
            Save blueprint{" "}
          </Button>
          <Tooltip content={<div>An image can only be created after saving the blueprint</div>}>
            <Button
              variant="primary"
              type="button"
              isAriaDisabled={!formOptions.valid || formOptions.getState().validating || isSaving || !hasSaved}
              onClick={() => {
                formOptions.onSubmit("build", {
                  formValues: formOptions.getState().values,
                });
              }}
            >
              {isSaving ? "Creating image" : submit}
            </Button>
          </Tooltip>
          <Button type="button" variant="secondary" onClick={handlePrev} isDisabled={isSaving}>
            {back}
          </Button>
          <div className="pf-c-wizard__footer-cancel">
            <Button type="button" variant="link" onClick={formOptions.onCancel} isDisabled={isSaving}>
              {cancel}
            </Button>
          </div>
        </>
      )}
    </FormSpy>
  );
};

SubmitButtonsCustom.propTypes = {
  buttonLabels: PropTypes.shape({
    cancel: PropTypes.node,
    submit: PropTypes.node,
    back: PropTypes.node,
  }),
};

export default SubmitButtonsCustom;
