import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/component-mapper";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";

import {
  Modal,
  ModalVariant,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  ClipboardCopy,
  ClipboardCopyVariant,
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
  Tooltip,
  EmptyStateHeader,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  PlusCircleIcon,
  TimesCircleIcon,
} from "@patternfly/react-icons";

import { createSource, deleteSource } from "../../slices/sourcesSlice";

export const SourceCardModal = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = (source) => {
    // delete existing source before creating new source
    if (props.isEditable) dispatch(deleteSource(props.source.name));
    dispatch(createSource(source));
    setIsModalOpen(false);
  };

  const onDelete = (event) => {
    // Prevent Card onClick from firing and opening the modal
    event.stopPropagation();
    dispatch(deleteSource(props.source.name));
  };

  const customValidatorMapper = {
    custom: () => (value) => {
      // no error if the name is unchanged
      if (props.source?.name === value) return undefined;
      if (props.sourceNames.includes(value)) {
        return intl.formatMessage({
          defaultMessage: "A source with this name already exists.",
        });
      }
      if (value.match(/\s/)) {
        return intl.formatMessage({
          defaultMessage: "Source names cannot contain spaces.",
        });
      }
      return undefined;
    },
  };

  const schema = {
    fields: [
      {
        component: "text-field",
        label: intl.formatMessage({
          defaultMessage: "ID",
        }),
        isRequired: true,
        name: "id",
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
          {
            type: "custom",
          },
        ],
      },
      {
        component: "text-field",
        label: intl.formatMessage({
          defaultMessage: "Name",
        }),
        isRequired: true,
        name: "name",
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
          {
            type: "custom",
          },
        ],
      },
      {
        component: "text-field",
        label: intl.formatMessage({
          defaultMessage: "URL",
        }),
        isRequired: true,
        name: "url",
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "select",
        label: intl.formatMessage({
          defaultMessage: "Type",
        }),
        name: "type",
        isRequired: true,
        options: [
          {
            label: intl.formatMessage({
              defaultMessage: "Yum repository",
            }),
            value: "yum-baseurl",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Mirrorlist",
            }),
            value: "yum-mirrorlist",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Metalink",
            }),
            value: "yum-metalink",
          },
        ],
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "checkbox",
        label: intl.formatMessage({
          defaultMessage: "Check SSL signature",
        }),
        name: "check_ssl",
      },
      {
        component: "checkbox",
        label: intl.formatMessage({
          defaultMessage: "Check GPG key",
        }),
        name: "check_gpg",
      },
      {
        component: "checkbox",
        label: intl.formatMessage({
          defaultMessage: "Use RHSM",
        }),
        name: "rhsm",
      },
    ],
  };

  const SourceCardEdit = (props) => {
    return (
      <Tooltip
        content={
          props.isEditable
            ? intl.formatMessage({ defaultMessage: "Edit source" })
            : intl.formatMessage({
                defaultMessage: "System sources cannot be edited",
              })
        }
        entryDelay={500}
      >
        <Card
          hasSelectableInput
          isSelectable
          onClick={props.isEditable ? handleModalToggle : null}
          tabIndex={0}
        >
          <CardHeader
            {...(props.isEditable && {
              actions: {
                actions: (
                  <>
                    <Button variant="plain" onClick={onDelete}>
                      <TimesCircleIcon />
                    </Button>
                  </>
                ),
                hasNoOffset: false,
                className: undefined,
              },
            })}
            className="pf-u-pr-0"
          >
            <CardTitle>
              <Title headingLevel="h4" size="xl">
                {props.source?.id}
              </Title>
            </CardTitle>
          </CardHeader>
          <Divider />
          <CardBody>
            <DescriptionList isCompact isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {props.source?.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>
                  {props.source?.type}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>URL</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy
                    variant={ClipboardCopyVariant.expansion}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {props.source?.url}
                  </ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>GPG</DescriptionListTerm>
                <DescriptionListDescription>
                  {props.source?.check_gpg ? (
                    <CheckCircleIcon className="success" />
                  ) : (
                    <TimesCircleIcon className="error" />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>SSL</DescriptionListTerm>
                <DescriptionListDescription>
                  {props.source?.check_ssl ? (
                    <CheckCircleIcon className="success" />
                  ) : (
                    <TimesCircleIcon className="error" />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>RHSM</DescriptionListTerm>
                <DescriptionListDescription>
                  {props.source?.rhsm ? (
                    <CheckCircleIcon className="success" />
                  ) : (
                    <TimesCircleIcon className="error" />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
          <CardFooter />
        </Card>
      </Tooltip>
    );
  };

  const SourceCardAdd = () => {
    return (
      <Card
        isCompact
        hasSelectableInput
        isSelectable
        onClick={handleModalToggle}
        tabIndex={0}
      >
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateHeader
              titleText={
                <>
                  <FormattedMessage defaultMessage="Add source" />
                </>
              }
              icon={
                <EmptyStateIcon icon={PlusCircleIcon} className="pending" />
              }
              headingLevel="h2"
            />
          </EmptyState>
        </Bullseye>
      </Card>
    );
  };

  return (
    <>
      {props.isAdd ? SourceCardAdd() : SourceCardEdit(props)}
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Create source",
        })}
        id="modal-create-source"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <FormRenderer
          schema={schema}
          FormTemplate={(props) => (
            <FormTemplate {...props} disableSubmit={["invalid"]} />
          )}
          componentMapper={componentMapper}
          validatorMapper={customValidatorMapper}
          onSubmit={onSubmit}
          onCancel={handleModalToggle}
          initialValues={props.isEditable ? props.source : {}}
        />
      </Modal>
    </>
  );
};

SourceCardModal.propTypes = {
  source: PropTypes.object,
  sourceNames: PropTypes.arrayOf(PropTypes.string),
  isAdd: PropTypes.bool,
  isEditable: PropTypes.bool,
};

export default SourceCardModal;
