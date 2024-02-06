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
  EmptyStateHeader,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import groupsFields from "../../forms/schemas/groups";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";
import { updateBlueprint } from "../../slices/blueprintsSlice";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

export const GroupsCardModal = ({ blueprint }) => {
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

  const groups = blueprint?.customizations?.group || [];

  const GroupsCard = () => {
    return (
      <Card
        hasSelectableInput
        isSelectable
        onClick={handleModalToggle}
        tabIndex={0}
      >
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Groups" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(groups).length ? (
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>
                    <FormattedMessage defaultMessage="Name" />
                  </Th>
                  <Th>
                    <FormattedMessage defaultMessage="Group ID" />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {groups.map((group, index) => (
                  <Tr key={index}>
                    <Td className="pf-m-width-30">{group.name}</Td>
                    <Td className="pf-m-width-30">{group.gid}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateHeader
                  titleText={
                    <>
                      <FormattedMessage defaultMessage="Add groups" />
                    </>
                  }
                  icon={<EmptyStateIcon icon={PlusCircleIcon} />}
                  headingLevel="h2"
                />
              </EmptyState>
            </Bullseye>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <GroupsCard />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Groups",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={groupsFields}
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

GroupsCardModal.propTypes = {
  blueprint: PropTypes.object,
};

export default GroupsCardModal;
