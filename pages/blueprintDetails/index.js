import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Stack,
  StackItem,
  Text,
  TextContent,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  Skeleton,
} from "@patternfly/react-core";

import DetailsTab from "./DetailsTab";
import UsersTab from "./UsersTab";

const BlueprintDetails = () => {
  const [activeTab, setActiveTab] = useState("details");

  const blueprintName = useParams().blueprint;

  return (
    <Stack hasGutter className="pf-u-m-lg">
      <StackItem>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={"/"}>Back to blueprints</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{blueprintName}</BreadcrumbItem>
        </Breadcrumb>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component="h1">{blueprintName}</Text>
          <Text component="small">Blueprint.Description</Text>
        </TextContent>
      </StackItem>
      <StackItem isFilled>
        <Tabs activeKey={activeTab} onSelect={setActiveTab}>
          <Tab
            eventKey={"details"}
            title={<TabTitleText>Details</TabTitleText>}
          >
            <DetailsTab />
          </Tab>
          <Tab eventKey={"users"} title={<TabTitleText>Users</TabTitleText>}>
            <UsersTab />
          </Tab>
          <Tab
            eventKey={"packages"}
            title={<TabTitleText>Packages</TabTitleText>}
          >
            <Skeleton />
          </Tab>
          <Tab
            eventKey={"versions"}
            title={<TabTitleText>Versions</TabTitleText>}
          >
            <Skeleton />
          </Tab>
        </Tabs>
      </StackItem>
    </Stack>
  );
};

export default BlueprintDetails;
