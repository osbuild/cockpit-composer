import React from "react";
import PropTypes from "prop-types";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
  Grid,
  GridItem,
  Button,
} from "@patternfly/react-core";
import { useIntl, FormattedMessage } from "react-intl";

import { formTimestampLabel } from "../../helpers";

const DetailsTab = ({ blueprint, images, setActiveTab }) => {
  const intl = useIntl();

  const imageInfo = (
    <>
      <Text component={TextVariants.h2}>
        <FormattedMessage defaultMessage="Image Info" />
      </Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage defaultMessage="Version" />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {blueprint?.version}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage defaultMessage="Most recent build" />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {images.length
            ? formTimestampLabel(images[0]?.job_created)
            : intl.formatMessage({
                defaultMessage: "No builds available",
              })}
        </TextListItem>
      </TextList>
    </>
  );

  const customizations = (
    <>
      <Text component={TextVariants.h2}>Customizations</Text>
      <TextList component={TextListVariants.dl}>
        {blueprint?.customizations?.hostname && (
          <>
            <TextListItem component={TextListItemVariants.dt}>
              <FormattedMessage defaultMessage="Hostname" />
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {blueprint?.customizations?.hostname}
            </TextListItem>
          </>
        )}
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage defaultMessage="Users" />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          <Button variant="link" isInline onClick={() => setActiveTab("users")}>
            {blueprint?.customizations?.user?.length || 0}
          </Button>
        </TextListItem>
      </TextList>
    </>
  );

  const packages = (
    <>
      <Text component={TextVariants.h2}>Packages </Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage defaultMessage={"Selected packages"} />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          <Button
            variant="link"
            isInline
            onClick={() => setActiveTab("packages")}
          >
            {blueprint?.packages?.length}
          </Button>
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage defaultMessage={"Total packages"} />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          <Button
            variant="link"
            isInline
            onClick={() => setActiveTab("packages")}
          >
            {blueprint?.dependencies?.length}
          </Button>
        </TextListItem>
      </TextList>
    </>
  );

  return (
    <TextContent className="pf-u-p-lg">
      <PageSection variant={PageSectionVariants.light}>
        <Grid span={12}>
          <GridItem span={5}>
            {imageInfo}
            {customizations}
          </GridItem>
          <GridItem span={1} />
          <GridItem span={6}>{packages}</GridItem>
        </Grid>
      </PageSection>
    </TextContent>
  );
};

DetailsTab.propTypes = {
  blueprint: PropTypes.object,
  images: PropTypes.array,
  setActiveTab: PropTypes.func,
};

export default DetailsTab;
