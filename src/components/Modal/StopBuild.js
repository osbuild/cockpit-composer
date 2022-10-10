import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";

import { Modal, ModalVariant, Button } from "@patternfly/react-core";
import { stopImageBuild } from "../../slices/imagesSlice";

export const StopBuild = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    dispatch(stopImageBuild(props.image.id));
    setIsModalOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Stop build" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Stop image build",
        })}
        id="modal-stop-image"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="danger" onClick={handleSubmit}>
            <FormattedMessage defaultMessage="Stop" />
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>,
        ]}
      >
        <FormattedMessage defaultMessage="Are you sure you want to stop the image build?" />
        <FormattedMessage defaultMessage="The build process cannot resume after it stops." />
      </Modal>
    </>
  );
};

StopBuild.propTypes = {
  image: PropTypes.object,
};

export default StopBuild;
