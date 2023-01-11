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
  Label,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import { updateBlueprint } from "../../slices/blueprintsSlice";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";

import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import timezoneFields from "../../forms/schemas/timezone";

export const TimezoneCardModal = ({ blueprint }) => {
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

  const timezone = blueprint?.customizations?.timezone || [];

  const TimezoneCard = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Timezone" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(timezone).length ? (
            <DescriptionList isHorizontal isAutoFit>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Timezone" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {timezone?.timezone}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="NTP Servers" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {timezone?.ntpservers?.map((ntpserver, index) => (
                      <Label key={index}>{ntpserver}</Label>
                    ))}
                  </LabelGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateIcon icon={PlusCircleIcon} />
                <Title headingLevel="h2" size="md">
                  <FormattedMessage defaultMessage="Set timezone" />
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
      <TimezoneCard />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Timezone",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={timezoneFields}
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

TimezoneCardModal.propTypes = {
  blueprint: PropTypes.object,
};

export default TimezoneCardModal;
