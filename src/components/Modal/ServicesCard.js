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
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
  LabelGroup,
  Label,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import servicesFields from "../../forms/schemas/services";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";
import { updateBlueprint } from "../../slices/blueprintsSlice";

export const ServicesCard = ({ blueprint }) => {
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

  const services = blueprint?.customizations?.services || [];

  const ServicesCardEdit = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Services" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(services).length ? (
            <DescriptionList isHorizontal isAutoFit>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Enabled" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {services?.enabled?.map((service, index) => (
                      <Label key={index} color="blue">
                        {service}
                      </Label>
                    ))}
                  </LabelGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Disabled" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {services?.disabled?.map((service, index) => (
                      <Label key={index} color="red">
                        {service}
                      </Label>
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
                  <FormattedMessage defaultMessage="Add services" />
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
      <ServicesCardEdit />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Services",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={servicesFields}
          FormTemplate={(props) => (
            <FormTemplate {...props} disableSubmit={["invalid"]} />
          )}
          componentMapper={{
            ...componentMapper,
            "text-input-group-with-chips": TextInputGroupWithChips,
          }}
          onSubmit={(formValues) => handleSaveBlueprint(formValues)}
          onCancel={handleModalToggle}
          initialValues={blueprintToFormState(blueprint)}
        />
      </Modal>
    </>
  );
};

ServicesCard.propTypes = {
  blueprint: PropTypes.object,
};

export default ServicesCard;
