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

import SystemTab from "../components/Tab/SystemTab";
import UsersTab from "../components/Tab/UsersTab";
import SourcesTab from "../components/Tab/SourcesTab";
import PackagesTab from "../components/Tab/PackagesTab";
import ImagesTab from "../components/Tab/ImagesTab";
import BlueprintDetailsToolbar from "../components/Toolbar/BlueprintDetailsToolbar";
import Notifications from "../components/Notifications/Notifications";

import {
  selectBlueprintByName,
  depsolveBlueprint,
} from "../slices/blueprintsSlice";
import {
  fetchSources,
  selectAllSources,
  selectAllSourceNames,
} from "../slices/sourcesSlice";
import { selectImagesFilteredAndSorted } from "../slices/imagesSlice";

import "./blueprintDetails.css";

const BlueprintDetails = () => {
  const dispatch = useDispatch();
  const getAllSources = () => useSelector(selectAllSources);
  const getAllSourceNames = () => useSelector(selectAllSourceNames);
  const getBlueprintByName = (name) =>
    useSelector((state) => selectBlueprintByName(state, name));
  const blueprintName = useParams().blueprint;

  useEffect(() => {
    dispatch(depsolveBlueprint(blueprintName));
    dispatch(fetchSources());
  }, []);

  const sources = getAllSources();
  const sourceNames = getAllSourceNames();
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

  const [activeTab, setActiveTab] = useState("system");

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
            eventKey="system"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="System" />
              </TabTitleText>
            }
          >
            <SystemTab
              blueprint={blueprint}
              images={images}
              setActiveTab={setActiveTab}
            />
          </Tab>
          <Tab
            eventKey="users"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Users" />
              </TabTitleText>
            }
          >
            <UsersTab users={blueprint?.customizations?.user} />
          </Tab>
          <Tab
            eventKey="sources"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Sources" />
              </TabTitleText>
            }
          >
            <SourcesTab sources={sources} sourceNames={sourceNames} />
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
              <PackagesTab
                packages={blueprint?.packages}
                dependencies={blueprint?.dependencies}
              />
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
            <ImagesTab blueprintName={blueprint?.name} images={images} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default BlueprintDetails;
