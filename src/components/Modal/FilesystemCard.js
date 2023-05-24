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
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import filesystemFields from "../../forms/schemas/filesystem";
import { filesystemValidator } from "../../forms/validators";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";
import { updateBlueprint } from "../../slices/blueprintsSlice";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { UNIT_GIB } from "../../constants";
import FileSystemConfigToggle from "../../forms/components/FileSystemConfigToggle";
import FileSystemConfiguration from "../../forms/components/FileSystemConfiguration";

export const FilesystemCard = ({ blueprint }) => {
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

  const filesystem = blueprint?.customizations?.filesystem || [];
  const FilesystemCardEdit = () => {
    return (
      <Card hasSelectableInput isSelectableRaised onClick={handleModalToggle}>
        <CardHeader className="pf-u-pr-0">
          <CardTitle>
            <Title headingLevel="h4" size="xl">
              <FormattedMessage defaultMessage="Filesystem" />
            </Title>
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardBody>
          {Object.keys(filesystem).length ? (
            <TableComposable variant="compact">
              <Thead>
                <Tr>
                  <Th>
                    <FormattedMessage defaultMessage="Mount point" />
                  </Th>
                  <Th>
                    <FormattedMessage defaultMessage="Type" />
                  </Th>
                  <Th>
                    <FormattedMessage defaultMessage="Min size" />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filesystem?.map((item, index) => (
                  <Tr key={index}>
                    <Td className="pf-m-width-30">{item.mountpoint}</Td>
                    <Td className="pf-m-width-30">xfs</Td>
                    <Td className="pf-m-width-30">
                      {item.minsize / UNIT_GIB} {"GiB"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          ) : (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateIcon icon={PlusCircleIcon} />
                <Title headingLevel="h2" size="md">
                  <FormattedMessage defaultMessage="Add manual filesystem" />
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
      <FilesystemCardEdit />
      <Modal
        variant={ModalVariant.medium}
        title={intl.formatMessage({
          defaultMessage: "Filesystem",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={filesystemFields(intl)}
          FormTemplate={(props) => (
            <FormTemplate {...props} disableSubmit={["invalid"]} />
          )}
          validatorMapper={{ filesystemValidator }}
          componentMapper={{
            ...componentMapper,
            "text-input-group-with-chips": TextInputGroupWithChips,
            "text-field-custom": TextFieldCustom,
            "filesystem-toggle": FileSystemConfigToggle,
            "filesystem-configuration": FileSystemConfiguration,
          }}
          onSubmit={(formValues) => handleSaveBlueprint(formValues)}
          onCancel={handleModalToggle}
          initialValues={blueprintToFormState(blueprint)}
        />
      </Modal>
    </>
  );
};

FilesystemCard.propTypes = {
  blueprint: PropTypes.object,
};

export default FilesystemCard;
