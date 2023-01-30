import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  PageSection,
  Title,
  Tab,
  TabTitleText,
  Tabs,
  Page,
  PageSectionVariants,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import BlueprintTable from "../components/Table/BlueprintTable";
import BlueprintListToolbar from "../components/Toolbar/BlueprintToolbar";
import Notifications from "../components/Notifications/Notifications";
import SourcesTab from "../components/Tab/SourcesTab";
import {
  selectAllBlueprintNames,
  selectBlueprintsFilteredAndSorted,
} from "../slices/blueprintsSlice";
import {
  fetchSources,
  selectAllSources,
  selectAllSourceNames,
} from "../slices/sourcesSlice";
import { selectAllImages } from "../slices/imagesSlice";
import ImagesTab from "../components/Tab/ImagesTab";
import BlueprintWizard from "../components/Wizard/BlueprintWizard";
import ImportBlueprint from "../components/Modal/ImportBlueprint";
import CreateImageWizard from "../components/Wizard/CreateImageWizard";
import BlueprintsEmpty from "../components/EmptyStates/BlueprintsEmpty";

const BlueprintList = () => {
  const dispatch = useDispatch();

  const filterKey = "name";
  const [filterValue, setFilterValue] = useState("");
  const sortBy = "name";
  const [isSortAscending, setIsSortAscending] = useState(true);
  const [activeTab, setActiveTab] = useState("system");

  const blueprintNames = useSelector((state) => selectAllBlueprintNames(state));
  const blueprintsFilteredAndSorted = useSelector((state) =>
    selectBlueprintsFilteredAndSorted(state, {
      key: filterKey,
      value: filterValue,
      sortBy: sortBy,
      isSortAscending: isSortAscending,
    })
  );

  const getAllSources = () => useSelector(selectAllSources);
  const getAllSourceNames = () => useSelector(selectAllSourceNames);
  const sources = getAllSources();
  const sourceNames = getAllSourceNames();

  useEffect(() => {
    dispatch(fetchSources());
  }, []);

  const images = useSelector((state) => selectAllImages(state));

  const handleTabClick = (event, tabName) => setActiveTab(tabName);

  return (
    <Page>
      <Notifications />
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem>
            <Title headingLevel="h1">image builder</Title>
          </FlexItem>
          <FlexItem align={{ default: "alignRight" }}>
            <ImportBlueprint />
          </FlexItem>
          <FlexItem>
            <BlueprintWizard blueprintNames={blueprintNames} />
          </FlexItem>
          <FlexItem>
            <CreateImageWizard />
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection className="pf-u-p-0">
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
                <FormattedMessage defaultMessage="Blueprints" />
              </TabTitleText>
            }
          >
            <div className="pf-u-p-lg">
              {blueprintNames.length === 0 && <BlueprintsEmpty />}
              {blueprintNames.length > 0 && (
                <>
                  <BlueprintListToolbar
                    isSortAscending={isSortAscending}
                    setIsSortAscending={setIsSortAscending}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    blueprintNames={blueprintNames}
                  />
                  <BlueprintTable
                    blueprints={blueprintsFilteredAndSorted}
                    images={images}
                  />
                </>
              )}
            </div>
          </Tab>
          <Tab
            eventKey="images"
            title={
              <TabTitleText>
                <FormattedMessage defaultMessage="Images" />
              </TabTitleText>
            }
          >
            <ImagesTab images={images} />
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
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default BlueprintList;
