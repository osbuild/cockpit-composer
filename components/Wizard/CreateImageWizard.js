import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import { Button } from "@patternfly/react-core";
import { startCompose, fetchingComposeTypes } from "../../core/actions/composes";

import ImageCreator from "./ImageCreator";
import { imageOutput, awsAuth, awsDest, details, review } from "./steps";
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
    // startCompose(props.blueprint.name, composeType, imageSize, ostree, upload);

    let uploadSettings;
    if (formValues["image-upload"]) {
      if (formValues["image-output-type"] === "ami") {
        uploadSettings = {
          image_name: formValues["aws-image-name"],
          provider: "aws",
          settings: {
            accessKeyID: formValues["aws-access-key"],
            secretAccessKey: formValues["aws-secret-access-key"],
            bucket: formValues["aws-s3-bucket"],
            region: formValues["aws-region"],
          },
        };
      }
    }

    props.startCompose(
      props.blueprintName,
      formValues["image-output-type"],
      formValues["image-size"],
      undefined,
      uploadSettings
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
                fields: [imageOutput, awsAuth, awsDest, details, review],
                crossroads: ["image-output-type", "image-upload"],
              },
            ],
          }}
          blueprintName={props.blueprintName}
          imageTypes={props.imageTypes}
        />
      )}
    </>
  );
};

CreateImageWizard.propTypes = {
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  fetchingComposeTypes: PropTypes.func,
  startCompose: PropTypes.func,
  blueprintName: PropTypes.string,
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
