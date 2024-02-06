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

import sshKeysFields from "../../forms/schemas/sshkeys";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";
import { updateBlueprint } from "../../slices/blueprintsSlice";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

export const SSHKeysCardModal = ({ blueprint }) => {
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

  const sshkeys = blueprint?.customizations?.sshkey || [];

  const SSHKeysCard = () => {
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
              <FormattedMessage defaultMessage="SSH keys" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(sshkeys).length ? (
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>
                    <FormattedMessage defaultMessage="Key" />
                  </Th>
                  <Th>
                    <FormattedMessage defaultMessage="User" />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sshkeys.map((sshkey, index) => (
                  <Tr key={index}>
                    <Td className="pf-m-width-30">{sshkey.key}</Td>
                    <Td className="pf-m-width-30">{sshkey.user}</Td>
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
                      <FormattedMessage defaultMessage="Add ssh keys" />
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
      <SSHKeysCard />
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "SSH Keys",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={sshKeysFields}
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

SSHKeysCardModal.propTypes = {
  blueprint: PropTypes.object,
};

export default SSHKeysCardModal;
