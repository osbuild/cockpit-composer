import React, { useEffect, useState } from "react";
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Spinner,
  Tabs,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from "@patternfly/react-core";
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
import { CheckIcon } from "@patternfly/react-icons";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import FormSpy from "@data-driven-forms/react-form-renderer/form-spy";
import * as api from "../../api";

const messages = defineMessages({
  uploadToAWS: {
    id: "wizard.review.uploadToAWS",
    defaultMessage: "Upload to AWS",
  },
  uploadToAzure: {
    id: "wizard.review.uploadToAzure",
    defaultMessage: "Upload to Azure",
  },
  uploadToVMWare: {
    id: "wizard.review.uploadToVMWare",
    defaultMessage: "Upload to VMWare",
  },
  uploadToOCI: {
    id: "wizard.review.uploadToOCI",
    defaultMessage: "Upload to OCI",
  },
  review: {
    id: "wizard.review.review",
    defaultMessage:
      'Review the information and click "Save blueprint" to save the customizations and then click "Create image" to create the image.',
  },
  accessKeyID: {
    id: "wizard.review.accessKeyID",
    defaultMessage: "Access key ID",
  },
  secretAccessKey: {
    id: "wizard.review.secretAccessKey",
    defaultMessage: "Secret access key",
  },
  imageName: {
    id: "wizard.review.imageName",
    defaultMessage: "Image name",
  },
  amazonS3Bucket: {
    id: "wizard.review.amazonS3Bucket",
    defaultMessage: "Amazon S3 bucket",
  },
  awsRegion: {
    id: "wizard.review.awsRegion",
    defaultMessage: "AWS region",
  },
  storageAccount: {
    id: "wizard.review.storageAccount",
    defaultMessage: "Storage account",
  },
  storageAccessKey: {
    id: "wizard.review.storageAccessKey",
    defaultMessage: "Storage access key",
  },
  storageContainer: {
    id: "wizard.review.storageContainer",
    defaultMessage: "Storage container",
  },
  username: {
    id: "wizard.review.username",
    defaultMessage: "Username",
  },
  password: {
    id: "wizard.review.password",
    defaultMessage: "Password",
  },
  host: {
    id: "wizard.review.host",
    defaultMessage: "Host",
  },
  cluster: {
    id: "wizard.review.cluster",
    defaultMessage: "Cluster",
  },
  dataCenter: {
    id: "wizard.review.dataCenter",
    defaultMessage: "Data center",
  },
  dataStore: {
    id: "wizard.review.dataStore",
    defaultMessage: "Data store",
  },
  userOCID: {
    id: "wizard.review.userOCID",
    defaultMessage: "User OCID",
  },
  privateKey: {
    id: "wizard.review.privateKey",
    defaultMessage: "Private key filename",
  },
  fingerprint: {
    id: "wizard.review.fingerprint",
    defaultMessage: "Fingerprint",
  },
  ociBucket: {
    id: "wizard.review.ociBucket",
    defaultMessage: "OCI bucket",
  },
  bucketNamespace: {
    id: "wizard.review.bucketNamespace",
    defaultMessage: "Bucket namespace",
  },
  bucketRegion: {
    id: "wizard.review.bucketRegion",
    defaultMessage: "Bucket region",
  },
  bucketCompartment: {
    id: "wizard.review.bucketCompartment",
    defaultMessage: "Bucket compartment",
  },
  bucketTenancy: {
    id: "wizard.review.bucketTenancy",
    defaultMessage: "Bucket tenancy",
  },
  hostname: {
    id: "wizard.review.hostname",
    defaultMessage: "Hostname",
  },
  installationDevice: {
    id: "wizard.review.installationDevice",
    defaultMessage: "Installation device",
  },
  packages: {
    id: "wizard.review.packages",
    defaultMessage: "Packages",
  },
  dependencies: {
    id: "wizard.review.dependencies",
    defaultMessage: "Dependencies",
  },
  admin: {
    id: "wizard.review.admin",
    defaultMessage: "Administrator",
  },
  sshKey: {
    id: "wizard.review.sshKey",
    defaultMessage: "SSH key",
  },
});

const AWSReview = (formValues) => (
  <>
    <h3>
      <strong>
        <FormattedMessage {...messages.uploadToAWS} />
      </strong>
    </h3>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <FormattedMessage {...messages.accessKeyID} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {"*".repeat(formValues?.["aws-access-key"].length)}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.secretAccessKey} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {"*".repeat(formValues?.["aws-secret-access-key"].length)}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.imageName} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["aws-image-name"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.amazonS3Bucket} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["aws-s3-bucket"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.awsRegion} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["aws-region"]}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </>
);

const AzureReview = (formValues) => (
  <>
    <h3>
      <strong>
        <FormattedMessage {...messages.uploadToAzure} />
      </strong>
    </h3>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <FormattedMessage {...messages.storageAccount} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["azure-storage-account"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.storageAccessKey} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {"*".repeat(formValues?.["azure-storage-access-key"].length)}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.imageName} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["azure-image-name"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.storageContainer} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["azure-storage-container"]}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </>
);

const VMWareReview = (formValues) => (
  <>
    <h3>
      <strong>
        <FormattedMessage {...messages.uploadToVMWare} />
      </strong>
    </h3>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <FormattedMessage {...messages.username} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-username"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.password} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {"*".repeat(formValues?.["vmware-password"].length)}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.imageName} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-image-name"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.host} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-host"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.cluster} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-cluster"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.dataCenter} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-data-center"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.dataStore} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["vmware-data-store"]}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </>
);

const ociReview = (formValues) => (
  <>
    <h3>
      <strong>
        <FormattedMessage {...messages.uploadToOCI} />
      </strong>
    </h3>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <FormattedMessage {...messages.userOCID} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-user-ocid"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.privateKey} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-private-key-filename"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.fingerprint} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-fingerprint"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.imageName} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-image-name"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.ociBucket} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-bucket"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.bucketNamespace} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-bucket-namespace"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.bucketRegion} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-bucket-region"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.bucketCompartment} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-bucket-compartment"]}
      </DescriptionListDescription>
      <DescriptionListTerm>
        <FormattedMessage {...messages.bucketTenancy} />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {formValues?.["oci-bucket-regtenancyion"]}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </>
);

const customizations = (intl, formValues) => (
  <TextContent>
    <TextList component={TextListVariants.dl}>
      {formValues?.["customizations.hostname"] && (
        <>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.hostname} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.hostname"]}
          </TextListItem>
        </>
      )}
      {formValues["image-output-type"] === "edge-simplified-installer" && (
        <>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Installation device" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.installation_device"]}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="Manufacturing server URL" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.fdo.manufacturing_server_url"]}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="DIUN public key insecure" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.fdo.diun_public_key_insecure"]}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="DIUN public key hash" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.fdo.diun_public_key_hash"]}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage defaultMessage="DIUN public key root certs" />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues?.["customizations.fdo.diun_public_key_root_certs"]}
          </TextListItem>
        </>
      )}
      {formValues?.customizations?.user?.length && (
        <>
          <TextListItem component={TextListItemVariants.dt}>
            <strong>
              <FormattedMessage
                id="customizations.user.title"
                defaultMessage="Users"
              />
            </strong>
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd} id="user-table">
            <TableComposable variant="compact">
              <Thead>
                <Tr>
                  <Th>
                    <FormattedMessage {...messages.username} />
                  </Th>
                  <Th>
                    <FormattedMessage {...messages.password} />
                  </Th>
                  <Th>
                    <FormattedMessage {...messages.admin} />
                  </Th>
                  <Th>
                    <FormattedMessage {...messages.sshKey} />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {formValues.customizations.user.map((user) => (
                  <Tr key={user?.name}>
                    <Td dataLabel={intl.formatMessage(messages.username)}>
                      {user?.name}
                    </Td>
                    <Td dataLabel={intl.formatMessage(messages.password)}>
                      {user?.password && <CheckIcon />}
                    </Td>
                    <Td dataLabel={intl.formatMessage(messages.admin)}>
                      {user?.isAdmin && <CheckIcon />}
                    </Td>
                    <Td dataLabel={intl.formatMessage(messages.sshKey)}>
                      {user?.key && <CheckIcon />}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          </TextListItem>
        </>
      )}
    </TextList>
  </TextContent>
);

const Review = () => {
  const intl = useIntl();
  const [activeTabKey, setActiveTabKey] = useState(0);
  const { getState } = useFormApi();
  const [formValues, setFormValues] = useState(getState()?.values);
  const [dependencies, setDependencies] = useState(undefined);

  useEffect(() => {
    const fetchDependencies = async (packages) => {
      if (packages?.length) {
        const result = await api.getComponentDependencies(packages);
        // Build a Set() because Packages may share dependencies
        const dependencies = new Set(
          result.reduce((deps, pkg) => {
            const pkgDependencies = pkg.dependencies.map((dep) => dep.name);
            return [...deps, ...pkgDependencies];
          }, [])
        );
        setDependencies(dependencies.size);
      } else {
        setDependencies(0);
      }
    };

    if (formValues["selected-packages"]) {
      fetchDependencies(formValues["selected-packages"]);
    }
  });

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div id="review-list">
      <Text>
        <FormattedMessage {...messages.review} />
      </Text>
      <br />
      <DescriptionList isCompact isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage defaultMessage="Blueprint name" />
          </DescriptionListTerm>
          <DescriptionListDescription>
            {formValues?.blueprintName}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Tabs
        isFilled
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        className="pf-u-my-md"
      >
        <Tab
          eventKey={0}
          title={
            <TabTitleText>
              <FormattedMessage defaultMessage="Image output" />
            </TabTitleText>
          }
          data-testid="tab-target"
          autoFocus
        >
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Output type" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {formValues?.["image-output-type"]}
              </DescriptionListDescription>
              <DescriptionListTerm>
                <FormattedMessage
                  id="wizard.review.imageSize"
                  defaultMessage="Image size"
                />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {formValues?.["image-size"]}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {formValues?.["image-output-type"] === "ami" &&
              formValues?.["image-upload"] &&
              AWSReview(formValues)}
            {formValues?.["image-output-type"] === "vhd" &&
              formValues?.["image-upload"] &&
              AzureReview(formValues)}
            {formValues?.["image-output-type"] === "vmdk" &&
              formValues?.["image-upload"] &&
              VMWareReview(formValues)}
            {formValues?.["image-output-type"] === "oci" &&
              formValues?.["image-upload"] &&
              ociReview(formValues)}
          </DescriptionList>
        </Tab>
        <Tab
          eventKey={1}
          title={
            <TabTitleText>
              <FormattedMessage defaultMessage="Packages" />
            </TabTitleText>
          }
          data-testid="tab-packages"
        >
          <TextContent>
            <TextList component={TextListVariants.dl}>
              <FormSpy
                subscription={{ values: true }}
                onChange={() => {
                  setFormValues(getState()?.values);
                }}
              />
              <TextListItem component={TextListItemVariants.dt}>
                <FormattedMessage {...messages.packages} />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {formValues["selected-packages"] ? (
                  formValues["selected-packages"].length
                ) : (
                  <Spinner size="sm" />
                )}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                <FormattedMessage {...messages.dependencies} />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {dependencies || dependencies === 0 ? (
                  dependencies
                ) : (
                  <Spinner size="sm" />
                )}
              </TextListItem>
            </TextList>
          </TextContent>
        </Tab>
        <Tab
          eventKey={2}
          title={
            <TabTitleText>
              <FormattedMessage defaultMessage="Customizations" />
            </TabTitleText>
          }
          data-testid="tab-custom"
        >
          {customizations(intl, formValues)}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Review;
