import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";

import CustomizationsTab from "../components/Tab/CustomizationsTab";
import PackagesTab from "../components/Tab/PackagesTab";
import ImagesTab from "../components/Tab/ImagesTab";
import BlueprintDetailsToolbar from "../components/Toolbar/BlueprintDetailsToolbar";
import Notifications from "../components/Notifications/Notifications";

import {
  selectBlueprintByName,
  depsolveBlueprint,
} from "../slices/blueprintsSlice";
import { selectImagesFilteredAndSorted } from "../slices/imagesSlice";

import "./blueprintDetails.css";

const BlueprintDetails = () => {
  const dispatch = useDispatch();
  const getBlueprintByName = (name) =>
    useSelector((state) => selectBlueprintByName(state, name));
  const blueprintName = useParams().blueprint;

  useEffect(() => {
    dispatch(depsolveBlueprint(blueprintName));
  }, []);

  const blueprint = getBlueprintByName(blueprintName);
  // images sorted by creation date on default
  const images = useSelector((state) =>
    selectImagesFilteredAndSorted(state, {
      key: "blueprint",
      value: blueprintName,
      sortBy: "job_created",
      isSortAscending: false,
    })
  );

  const [activeTab, setActiveTab] = useState("customizations");

  const handleTabClick = (event, tabName) => setActiveTab(tabName);

  return (
    <Page>
      <Notifications />
      <PageSection variant={PageSectionVariants.light} className="pf-u-py-0">
        <BlueprintDetailsToolbar blueprint={blueprint} />
      </PageSection>
      <PageSection variant={PageSectionVariants.light} className="pf-u-py-0">
        <TextContent>
          <Text component="h1">{blueprint?.name}</Text>
          <Text component="small">{blueprint?.description}</Text>
        </TextContent>
      </PageSection>
      <PageSection hasShadowBottom={true} className="pf-u-p-0">
        <Tabs
          isFilled
          activeKey={activeTab}
          onSelect={handleTabClick}
          className="tabs pf-u-px-lg"
        >
          <Tab
            eventKey="customizations"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Customizations" />
              </TabTitleText>
            }
          >
            <CustomizationsTab
              blueprint={blueprint}
              images={images}
              setActiveTab={setActiveTab}
            />
          </Tab>
          <Tab
            eventKey="packages"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Packages" />
              </TabTitleText>
            }
          >
            {blueprint?.dependencies?.length && (
              <PackagesTab blueprint={blueprint} />
            )}
          </Tab>
          <Tab
            eventKey="images"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Images" />
              </TabTitleText>
            }
          >
            <ImagesTab images={images} blueprint={blueprint} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default BlueprintDetails;
