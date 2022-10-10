import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useIntl, FormattedMessage } from "react-intl";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";

import { Modal, ModalVariant, Button } from "@patternfly/react-core";
import { createBlueprint } from "../../slices/blueprintsSlice";

export const CreateBlueprint = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (values) => {
    const { name, description } = values;
    const blueprint = {
      name,
      description,
    };
    dispatch(createBlueprint(blueprint));
    setIsModalOpen(false);
    navigate(`/${name}`);
  };

  const customValidatorMapper = {
    custom: () => (value) => {
      if (props.blueprintNames.includes(value)) {
        return intl.formatMessage({
          defaultMessage: "A blueprint with this name already exists.",
        });
      }
      if (value.match(/\s/)) {
        return intl.formatMessage({
          defaultMessage: "Blueprint names cannot contain spaces.",
        });
      }
      return undefined;
    },
  };

  const schema = {
    fields: [
      {
        component: "text-field",
        label: intl.formatMessage({
          defaultMessage: "Name",
        }),
        isRequired: true,
        name: "name",
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
          {
            type: "custom",
          },
        ],
      },
      {
        component: "text-field",
        label: intl.formatMessage({
          defaultMessage: "Description",
        }),
        name: "description",
      },
    ],
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Create blueprint" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Create blueprint"
        id="modal-create-blueprint"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={schema}
          FormTemplate={(props) => (
            <FormTemplate
              {...props}
              disableSubmit={["invalid"]}
              submitLabel={intl.formatMessage({ defaultMessage: "Create" })}
            />
          )}
          onSubmit={handleSubmit}
          onCancel={handleModalToggle}
          componentMapper={componentMapper}
          validatorMapper={customValidatorMapper}
        />
      </Modal>
    </>
  );
};

CreateBlueprint.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
};

export default CreateBlueprint;
