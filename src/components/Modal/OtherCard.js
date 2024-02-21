import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";

import {
  Modal,
  ModalVariant,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  Divider,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  LabelGroup,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import { updateBlueprint } from "../../slices/blueprintsSlice";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";

import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import otherFields from "../../forms/schemas/other";

export const OtherCardModal = ({ blueprint }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSaveBlueprint = (formValues) => {
    const blueprintData = formStateToBlueprint(formValues);
    dispatch(updateBlueprint(blueprintData));
    setIsModalOpen(false);
  };

  const hostname = blueprint?.customizations?.hostname || "";
  const installation_device =
    blueprint?.customizations?.installation_device || "";

  const OtherCard = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Other customizations" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {hostname || installation_device ? (
            <DescriptionList isHorizontal isAutoFit>
              {hostname && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    <FormattedMessage defaultMessage="Hostname" />
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {hostname}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {installation_device && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    <FormattedMessage defaultMessage="Installation device" />
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <LabelGroup>{installation_device}</LabelGroup>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateIcon icon={PlusCircleIcon} />
                <Title headingLevel="h2" size="md">
                  <FormattedMessage defaultMessage="Add other customizations" />
                </Title>
              </EmptyState>
            </Bullseye>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <OtherCard />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Other customizations",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={otherFields(intl)}
          FormTemplate={(props) => (
            <FormTemplate {...props} disableSubmit={["invalid"]} />
          )}
          componentMapper={{
            ...componentMapper,
            "text-input-group-with-chips": TextInputGroupWithChips,
            "text-field-custom": TextFieldCustom,
          }}
          onSubmit={(formValues) => handleSaveBlueprint(formValues)}
          onCancel={handleModalToggle}
          initialValues={blueprintToFormState(blueprint)}
        />
      </Modal>
    </>
  );
};

OtherCardModal.propTypes = {
  blueprint: PropTypes.object,
};

export default OtherCardModal;
