/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Title,
  DescriptionListTerm,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { FormattedMessage } from "react-intl";
import { UNIT_GIB, UNIT_MIB } from "../../constants";

const CustomizationsTab = ({ blueprint, setActiveTab }) => {
  const KernelCard = () => (
    <Card isFullHeight>
      <CardTitle>
        <Title headingLevel="h4" size="xl">
          <FormattedMessage defaultMessage="Kernel" />
        </Title>
      </CardTitle>
      <Divider />
      <CardBody>
        <DescriptionList isHorizontal isAutoFit>
          <DescriptionListGroup>
            <DescriptionListTerm>
              <FormattedMessage defaultMessage="Name" />
            </DescriptionListTerm>
            <DescriptionListDescription>
              {blueprint?.customizations?.kernel?.name}
            </DescriptionListDescription>
            <DescriptionListTerm>
              <FormattedMessage defaultMessage="Append" />
            </DescriptionListTerm>
            <DescriptionListDescription>
              {blueprint?.customizations?.kernel?.append}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );

  const FilesystemCard = () => {
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="File system" />
          </Title>
        </CardTitle>
        <CardBody>
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
              {blueprint?.customizations?.filesystem?.map((item, index) => (
                <Tr key={index}>
                  <Td className="pf-m-width-30">{item.mountpoint}</Td>
                  <Td className="pf-m-width-30">xfs</Td>
                  <Td className="pf-m-width-30">
                    {item.size}{" "}
                    {item.unit === UNIT_GIB
                      ? "GiB"
                      : item.unit === UNIT_MIB
                      ? "MiB"
                      : "KiB"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </CardBody>
      </Card>
    );
  };

  const ServicesCard = () => {
    const services = blueprint?.customizations?.services;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="Services" />
          </Title>
        </CardTitle>
        <CardBody>
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
        </CardBody>
      </Card>
    );
  };

  const FirewallCard = () => {
    const firewall = blueprint?.customizations?.firewall;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="Firewall" />
          </Title>
        </CardTitle>
        <CardBody>
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
                    <Label>{zone.name}</Label>
                    {zone?.sources.map((source, index) => (
                      <Label key={index}>{source}</Label>
                    ))}
                  </React.Fragment>
                ))}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    );
  };

  const GroupsCard = () => {
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="Groups" />
          </Title>
        </CardTitle>
        <CardBody>
          <TableComposable variant="compact">
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
              {blueprint?.customizations?.group?.map((group, index) => (
                <Tr key={index}>
                  <Td className="pf-m-width-30">{group.name}</Td>
                  <Td className="pf-m-width-30">{group.gid}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </CardBody>
      </Card>
    );
  };

  const SSHKeysCard = () => {
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="SSH Keys" />
          </Title>
        </CardTitle>
        <CardBody>
          <TableComposable variant="compact">
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
              {blueprint?.customizations?.sshkey?.map((sshkey, index) => (
                <Tr key={index}>
                  <Td className="pf-m-width-30">{sshkey.key}</Td>
                  <Td className="pf-m-width-30">{sshkey.user}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </CardBody>
      </Card>
    );
  };

  const TimezoneCard = () => {
    const timezone = blueprint?.customizations?.timezone;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="Timezone" />
          </Title>
        </CardTitle>
        <CardBody>
          <DescriptionList isHorizontal isAutoFit>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Timezone" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {timezone?.timezone}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="NTP Servers" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                <LabelGroup>
                  {timezone?.ntpservers?.map((ntpserver, index) => (
                    <Label key={index}>{ntpserver}</Label>
                  ))}
                </LabelGroup>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    );
  };

  const LocaleCard = () => {
    const locale = blueprint?.customizations?.locale;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="Locale" />
          </Title>
        </CardTitle>
        <CardBody>
          <DescriptionList isHorizontal isAutoFit>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Keyboard" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {locale?.keyboard}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Languages" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                <LabelGroup>
                  {locale?.languages?.map((language, index) => (
                    <Label key={index}>{language}</Label>
                  ))}
                </LabelGroup>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    );
  };

  const FIDOCard = () => {
    const fdo = blueprint?.customizations?.fdo;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="FIDO Device Onboard" />
          </Title>
        </CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="DIUN Public Key Hash" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {fdo?.diun_pub_key_hash}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="DIUN Public Key Insecure" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {fdo?.diun_pub_key_insecure}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="DIUN Public Key Root Certificates" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {fdo?.diun_pub_key_root_certs}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Manufacturing Server URL" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {fdo?.manufacturing_server_url}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    );
  };

  const OpenSCAPCard = () => {
    const openscap = blueprint?.customizations?.openscap;
    return (
      <Card isFullHeight>
        <CardTitle>
          <Title headingLevel="h4" size="xl">
            <FormattedMessage defaultMessage="OpenSCAP" />
          </Title>
        </CardTitle>
        <CardBody>
          <DescriptionList isHorizontal isAutoFit>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Datastream" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {openscap?.datastream}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage defaultMessage="Profile ID" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {openscap?.profile_id}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    );
  };

  return (
    <Grid hasGutter className="pf-u-p-lg">
      <GridItem lg={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ServicesCard />
          </FlexItem>
          <FlexItem>
            <FirewallCard />
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <FilesystemCard />
          </FlexItem>
          <FlexItem>
            <SSHKeysCard />
          </FlexItem>
          <FlexItem>
            <GroupsCard />
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <KernelCard />
          </FlexItem>
          <FlexItem>
            <TimezoneCard />
          </FlexItem>
          <FlexItem>
            <LocaleCard />
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <FIDOCard />
          </FlexItem>
          <FlexItem>
            <OpenSCAPCard />
          </FlexItem>
        </Flex>
      </GridItem>
    </Grid>
  );
};

CustomizationsTab.propTypes = {
  blueprint: PropTypes.object,
  images: PropTypes.array,
  setActiveTab: PropTypes.func,
};

export default CustomizationsTab;
