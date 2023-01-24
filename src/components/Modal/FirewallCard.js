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

import firewallFields from "../../forms/schemas/firewall";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";
import { updateBlueprint } from "../../slices/blueprintsSlice";
import TextFieldCustom from "../../forms/components/TextFieldCustom";

export const FirewallCard = ({ blueprint }) => {
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

  const firewall = blueprint?.customizations?.firewall || {};

  const FirewallCardEdit = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Firewall" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(firewall).length &&
          Object.keys(firewall.services).length ? (
            <DescriptionList isHorizontal isAutoFit>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Enabled Services" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {firewall?.services?.enabled?.map((service, index) => (
                      <Label key={index} color="blue">
                        {service}
                      </Label>
                    ))}
                  </LabelGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Disabled Services" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {firewall?.services?.disabled?.map((service, index) => (
                      <Label key={index} color="red">
                        {service}
                      </Label>
                    ))}
                  </LabelGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Ports" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelGroup>
                    {firewall?.ports?.map((port, index) => (
                      <Label key={index}>{port}</Label>
                    ))}
                  </LabelGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <FormattedMessage defaultMessage="Zones" />
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {firewall?.zones?.map((zone, index) => (
                    <React.Fragment key={index}>
                      <Label>{zone?.name}</Label>
                      {zone?.sources?.map((source, index) => (
                        <Label key={index}>{source}</Label>
                      ))}
                    </React.Fragment>
                  ))}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateIcon icon={PlusCircleIcon} />
                <Title headingLevel="h2" size="md">
                  <FormattedMessage defaultMessage="Add firewall" />
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
      <FirewallCardEdit />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Firewall",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={firewallFields}
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

FirewallCard.propTypes = {
  blueprint: PropTypes.object,
};

export default FirewallCard;
