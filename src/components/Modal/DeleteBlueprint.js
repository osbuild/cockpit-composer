import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";

import { Modal, ModalVariant, Button } from "@patternfly/react-core";
import { deleteBlueprint } from "../../slices/blueprintsSlice";

export const DeleteBlueprint = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    dispatch(deleteBlueprint(props.blueprint.name));
    setIsModalOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Delete blueprint" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Delete blueprint",
        })}
        id="modal-delete-blueprint"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="danger" onClick={handleSubmit}>
            <FormattedMessage defaultMessage="Delete" />
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete the blueprint</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

DeleteBlueprint.propTypes = {
  blueprint: PropTypes.object,
};

export default DeleteBlueprint;
