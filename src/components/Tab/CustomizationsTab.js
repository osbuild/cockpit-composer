import React from "react";
import PropTypes from "prop-types";
import { Grid, GridItem, Flex, FlexItem } from "@patternfly/react-core";
import { ServicesCard } from "../Modal/ServicesCard";
import FirewallCard from "../Modal/FirewallCard";
import FilesystemCard from "../Modal/FilesystemCard";
import SSHKeysCardModal from "../Modal/SSHKeysCard";
import GroupsCardModal from "../Modal/GroupsCard";
import KernelCardModal from "../Modal/KernelCard";
import TimezoneCardModal from "../Modal/TimezoneCard";
import LocaleCardModal from "../Modal/LocaleCard";
import FDOCardModal from "../Modal/FDOCard";
import OpenSCAPCardModal from "../Modal/OpenSCAPCard";
import UserCard from "../Cards/UserCard";
import IgnitionCardModal from "../Modal/ignitionCard";

const CustomizationsTab = ({ blueprint }) => {
  return (
    <Grid hasGutter className="pf-u-p-lg">
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ServicesCard blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <FirewallCard blueprint={blueprint} />
          </FlexItem>
          {blueprint?.customizations?.user?.map((u, i) => (
            <FlexItem key={i}>
              <UserCard user={u} />
            </FlexItem>
          ))}
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <FilesystemCard blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <SSHKeysCardModal blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <GroupsCardModal blueprint={blueprint} />
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <KernelCardModal blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <TimezoneCardModal blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <LocaleCardModal blueprint={blueprint} />
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <FDOCardModal blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <OpenSCAPCardModal blueprint={blueprint} />
          </FlexItem>
          <FlexItem>
            <IgnitionCardModal blueprint={blueprint} />
          </FlexItem>
        </Flex>
      </GridItem>
    </Grid>
  );
};

CustomizationsTab.propTypes = {
  blueprint: PropTypes.object,
  images: PropTypes.array,
};

export default CustomizationsTab;
