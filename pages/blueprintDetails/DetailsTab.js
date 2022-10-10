import React from "react";
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
  Grid,
  GridItem,
  Skeleton,
} from "@patternfly/react-core";

const DetailsTab = () => {
  const imageInfo = (
    <>
      <Text component={TextVariants.h2}>{"Image info"}</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          {"Version"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Version
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {"Type"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Image.Type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {"Distro"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Distro
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {"Most recent build"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Image.Created
        </TextListItem>
      </TextList>
    </>
  );

  const customizations = (
    <>
      <Text component={TextVariants.h2}>Customizations</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          {"Hostname"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Hostname
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {"Users"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Users.length
        </TextListItem>
      </TextList>
    </>
  );

  const packages = (
    <>
      <Text component={TextVariants.h2}>Packages </Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          {"Selected packages"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          <Skeleton width="180px" />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {"Total packages"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Blueprint.Packages.length
        </TextListItem>
      </TextList>
    </>
  );

  return (
    <TextContent className="pf-u-mt-lg">
      <Grid span={12}>
        <GridItem span={5}>
          {imageInfo}
          {customizations}
        </GridItem>
        <GridItem span={1} />
        <GridItem span={6}>{packages}</GridItem>
      </Grid>
    </TextContent>
  );
};

export default DetailsTab;
