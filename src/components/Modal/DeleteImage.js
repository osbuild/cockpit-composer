import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";

import { Modal, ModalVariant, Button } from "@patternfly/react-core";
import { deleteImage } from "../../slices/imagesSlice";

export const DeleteImage = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    dispatch(deleteImage(props.image.id));
    setIsModalOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Delete image" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Delete image",
        })}
        id="modal-delete-image"
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
        <FormattedMessage defaultMessage="Are you sure you want to delete the image?" />{" "}
        <FormattedMessage defaultMessage="This action cannot be undone." />
      </Modal>
    </>
  );
};

DeleteImage.propTypes = {
  image: PropTypes.object,
};

export default DeleteImage;
