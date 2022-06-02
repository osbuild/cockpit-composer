import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import { Button } from "@patternfly/react-core";
import { startCompose, fetchingComposeTypes } from "../../core/actions/composes";

import ImageCreator from "./ImageCreator";
import { imageOutput, details, review } from "./steps";
import "./CreateImageWizard.css";

const CreateImageWizard = (props) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const handleClose = () => {
    setIsWizardOpen(false);
  };

  useEffect(() => {
    // refactor since this currently gets called for each button
    props.fetchingComposeTypes();
  }, []);

  const handleOpen = () => {
    setIsWizardOpen(true);
  };

  const handleSubmit = (formValues) => {
    console.log(formValues);

    // startCompose(props.blueprint.name, composeType, imageSize, ostree, upload);
    props.startCompose(
      props.blueprint.name,
      formValues["image-output-type"],
      formValues["image-size"],
      undefined,
      undefined
    );
    setIsWizardOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpen}>
        Create image (new)
      </Button>
      {isWizardOpen && (
        <ImageCreator
          onClose={handleClose}
          onSubmit={(formValues) => handleSubmit(formValues)}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "cockpit-composer-wizard",
                isDynamic: true,
                inModal: true,
                showTitles: true,
                title: "Create image",
                buttonLabels: {
                  submit: "Create image",
                },
                fields: [imageOutput, details, review],
              },
            ],
          }}
          blueprint={props.blueprint}
          imageTypes={props.imageTypes}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  imageTypes: state.composes.composeTypes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  startCompose: (blueprintName, composeType, imageSize, ostree, upload) => {
    dispatch(startCompose(blueprintName, composeType, imageSize, ostree, upload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateImageWizard);
