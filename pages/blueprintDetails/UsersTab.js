import React from "react";
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
} from "@patternfly/react-core";

const UsersTab = () => {
  return (
    <TextContent className="pf-u-mt-lg">
      <Text component={TextVariants.h2}>{"User 0"}</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem component={TextListItemVariants.dt}>
          {"Name"}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          User.Name
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export default UsersTab;
