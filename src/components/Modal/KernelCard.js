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
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import { updateBlueprint } from "../../slices/blueprintsSlice";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";

import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import kernelFields from "../../forms/schemas/kernel";

export const KernelCardModal = ({ blueprint }) => {
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

  const kernel = blueprint?.customizations?.kernel || [];

  const KernelCard = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Kernel" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {kernel?.name?.length || kernel?.append?.length ? (
            <DescriptionList isHorizontal isAutoFit>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Name" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {kernel?.name}
                </DescriptionListDescription>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Append" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {kernel?.append}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateIcon icon={PlusCircleIcon} />
                <Title headingLevel="h2" size="md">
                  <FormattedMessage defaultMessage="Add kernel" />
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
      <KernelCard />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Kernel",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={kernelFields}
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

KernelCardModal.propTypes = {
  blueprint: PropTypes.object,
};

export default KernelCardModal;
