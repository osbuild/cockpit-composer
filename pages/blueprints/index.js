import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import BlueprintListView from '../../components/ListView/BlueprintListView';
import CreateBlueprint from '../../components/Modal/CreateBlueprint';
import ExportBlueprint from '../../components/Modal/ExportBlueprint';
import DeleteBlueprint from '../../components/Modal/DeleteBlueprint';
import CreateImage from '../../components/Modal/CreateImage';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loading from '../../components/Loading/Loading';
import BlueprintsToolbar from '../../components/Toolbar/BlueprintsToolbar';
import { connect } from 'react-redux';
import { deletingBlueprint, startCompose } from '../../core/actions/blueprints';
import {
  fetchingModalExportBlueprintContents,
  setModalExportBlueprintName, setModalExportBlueprintContents, setModalExportBlueprintVisible,
  setModalDeleteBlueprintName, setModalDeleteBlueprintId, setModalDeleteBlueprintVisible,
  setModalCreateImageBlueprintName, setModalCreateImageVisible,
} from '../../core/actions/modals';
import { blueprintsSortSetKey, blueprintsSortSetValue } from '../../core/actions/sort';
import { blueprintsFilterAddValue, blueprintsFilterRemoveValue, blueprintsFilterClearValues } from '../../core/actions/filter';
import { makeGetSortedBlueprints, makeGetFilteredBlueprints } from '../../core/selectors';

class BlueprintsPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHideModalDelete = this.handleHideModalDelete.bind(this);
    this.handleShowModalDelete = this.handleShowModalDelete.bind(this);
    this.handleHideModalExport = this.handleHideModalExport.bind(this);
    this.handleShowModalExport = this.handleShowModalExport.bind(this);
    this.handleHideModalCreateImage = this.handleHideModalCreateImage.bind(this);
    this.handleShowModalCreateImage = this.handleShowModalCreateImage.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    document.title = 'Blueprints';
  }

  setNotifications() {
    this.refs.layout.setNotifications();
  }

  handleDelete(event, blueprint) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deletingBlueprint(blueprint);
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  // handle show/hide of modal dialogs
  handleHideModalExport() {
    this.props.setModalExportBlueprintVisible(false);
    this.props.setModalExportBlueprintName('');
    this.props.setModalExportBlueprintContents([]);
  }

  handleShowModalExport(e, blueprint) {
    // This implementation of the dialog only provides a text option, and it's
    // automatically selected. Eventually, the following code should move to a
    // separate function that is called when the user selects the text option

    // display the dialog, a spinner will display while contents are undefined
    this.props.setModalExportBlueprintName(blueprint);
    this.props.setModalExportBlueprintContents(undefined);
    const blueprintName = blueprint.replace(/\s/g, '-');
    // run depsolving against blueprint to get contents for dialog
    this.props.fetchingModalExportBlueprintContents(blueprintName);
    this.props.setModalExportBlueprintVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalDelete() {
    this.props.setModalDeleteBlueprintVisible(false);
    this.props.setModalDeleteBlueprintId('');
    this.props.setModalDeleteBlueprintName('');
  }

  handleShowModalDelete(e, blueprint) {
    this.props.setModalDeleteBlueprintId(blueprint.id);
    this.props.setModalDeleteBlueprintName(blueprint.name);
    this.props.setModalDeleteBlueprintVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalCreateImage() {
    this.props.setModalCreateImageVisible(false);
    this.props.setModalCreateImageBlueprintName('');
  }

  handleShowModalCreateImage(e, blueprint) {
    this.props.setModalCreateImageBlueprintName(blueprint.name);
    this.props.setModalCreateImageVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {
      blueprints, exportBlueprint, deleteBlueprint, createImage,
      blueprintSortKey, blueprintSortValue, blueprintsSortSetValue, blueprintFilters,
      blueprintsFilterAddValue, blueprintsFilterRemoveValue, blueprintsFilterClearValues,
      blueprintsError, blueprintsLoading
    } = this.props;
    return (
      <Layout className="container-fluid" ref="layout">
        <BlueprintsToolbar
          emptyState={blueprints.length === 0 && blueprintFilters.filterValues.length === 0}
          errorState={blueprintsError !== null}
          filters={blueprintFilters}
          filterRemoveValue={blueprintsFilterRemoveValue}
          filterClearValues={blueprintsFilterClearValues}
          filterAddValue={blueprintsFilterAddValue}
          sortKey={blueprintSortKey}
          sortValue={blueprintSortValue}
          sortSetValue={blueprintsSortSetValue}
        />
      {blueprintsLoading === true &&
        <Loading />
        ||
        (blueprintsError !== null &&
          <EmptyState
            title="An Error Occurred"
            message={blueprintsError.message}
          />
          ||
          (blueprints.length > 0 &&
            <BlueprintListView
              blueprints={blueprints.map(blueprint => blueprint.present)}
              setNotifications={this.setNotifications}
              handleShowModalExport={this.handleShowModalExport}
              handleShowModalDelete={this.handleShowModalDelete}
              handleShowModalCreateImage={this.handleShowModalCreateImage}
            />
            ||
            (blueprintFilters.filterValues.length === 0 &&
              <EmptyState
                title="No Blueprints"
                message={`Create a blueprint to define the contents that will be included
                  in the images you create. Images can be produced in a variety of
                  output formats.`}
              >
                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-blueprint"
                >
                  Create Blueprint
                </button>
              </EmptyState>
              ||
              <EmptyState
                title="No Results Match the Filter Criteria"
                message={`Modify your filter criteria to get results.`}
              >
                <button
                  className="btn btn-link btn-lg"
                  type="button"
                  onClick={blueprintsFilterClearValues}
                >
                  Clear All Filters
                </button>
              </EmptyState>
            )
          )
        )
      }
        <CreateBlueprint blueprintNames={blueprints.map(blueprint => blueprint.present.id)} />
        {(exportBlueprint !== undefined && exportBlueprint.visible)
          ? <ExportBlueprint
            blueprint={exportBlueprint.name}
            contents={exportBlueprint.contents}
            handleHideModal={this.handleHideModalExport}
          />
          : null}
        {(deleteBlueprint !== undefined && deleteBlueprint.visible)
          ? <DeleteBlueprint
            blueprint={deleteBlueprint}
            handleDelete={this.handleDelete}
            handleHideModal={this.handleHideModalDelete}
          />
          : null}
        {(createImage !== undefined && createImage.visible)
          ? <CreateImage
            blueprint={createImage.name}
            imageTypes={createImage.imageTypes}
            handleStartCompose={this.handleStartCompose}
            handleHideModal={this.handleHideModalCreateImage}
            setNotifications={this.setNotifications}
          />
          : null}
      </Layout>
    );
  }
}

BlueprintsPage.propTypes = {
  deletingBlueprint: PropTypes.func,
  setModalCreateImageVisible: PropTypes.func,
  setModalCreateImageBlueprintName: PropTypes.func,
  setModalDeleteBlueprintVisible: PropTypes.func,
  setModalDeleteBlueprintName: PropTypes.func,
  setModalDeleteBlueprintId: PropTypes.func,
  setModalExportBlueprintVisible: PropTypes.func,
  setModalExportBlueprintName: PropTypes.func,
  setModalExportBlueprintContents: PropTypes.func,
  fetchingModalExportBlueprintContents: PropTypes.func,
  blueprints: PropTypes.array,
  filteredBlueprints: PropTypes.array,
  exportBlueprint: PropTypes.object,
  deleteBlueprint: PropTypes.object,
  createImage: PropTypes.object,
  blueprintSortKey: PropTypes.string,
  blueprintSortValue: PropTypes.string,
  blueprintFilters: PropTypes.object,
  blueprintsSortSetKey: PropTypes.func,
  blueprintsSortSetValue: PropTypes.func,
  blueprintsFilterAddValue: PropTypes.func,
  blueprintsFilterRemoveValue: PropTypes.func,
  blueprintsFilterClearValues: PropTypes.func,
  blueprintsError: PropTypes.object,
  blueprintsLoading: PropTypes.bool,
  startCompose: PropTypes.func,
};

const makeMapStateToProps = () => {
  const getSortedBlueprints = makeGetSortedBlueprints();
  const getFilteredBlueprints = makeGetFilteredBlueprints();
  const mapStateToProps = (state) => {
    if (getSortedBlueprints(state) !== undefined) {
      return {
        exportBlueprint: state.modals.exportBlueprint,
        deleteBlueprint: state.modals.deleteBlueprint,
        createImage: state.modals.createImage,
        blueprints: getFilteredBlueprints(state, getSortedBlueprints(state)),
        blueprintSortKey: state.sort.blueprints.key,
        blueprintSortValue: state.sort.blueprints.value,
        blueprintFilters: state.filter.blueprints,
        blueprintsError: state.blueprints.errorState,
        blueprintsLoading: state.blueprints.fetchingBlueprints,
      };
    }
    return {
      exportBlueprint: state.modals.exportBlueprint,
      deleteBlueprint: state.modals.deleteBlueprint,
      createImage: state.modals.createImage,
      blueprints: {},
      blueprintSortKey: state.sort.blueprints.key,
      blueprintSortValue: state.sort.blueprints.value,
      blueprintFilters: state.filter.blueprints,
      blueprintsError: state.blueprints.errorState,
      blueprintsLoading: state.blueprints.fetchingBlueprints,
    };
  };

  return mapStateToProps;
};


const mapDispatchToProps = dispatch => ({
  fetchingModalExportBlueprintContents: modalBlueprintName => {
    dispatch(fetchingModalExportBlueprintContents(modalBlueprintName));
  },
  setModalExportBlueprintName: modalBlueprintName => {
    dispatch(setModalExportBlueprintName(modalBlueprintName));
  },
  setModalExportBlueprintContents: modalBlueprintContents => {
    dispatch(setModalExportBlueprintContents(modalBlueprintContents));
  },
  setModalExportBlueprintVisible: modalVisible => {
    dispatch(setModalExportBlueprintVisible(modalVisible));
  },
  setModalDeleteBlueprintName: modalBlueprintName => {
    dispatch(setModalDeleteBlueprintName(modalBlueprintName));
  },
  setModalDeleteBlueprintId: modalBlueprintId => {
    dispatch(setModalDeleteBlueprintId(modalBlueprintId));
  },
  setModalDeleteBlueprintVisible: modalVisible => {
    dispatch(setModalDeleteBlueprintVisible(modalVisible));
  },
  setModalCreateImageBlueprintName: modalBlueprintName => {
    dispatch(setModalCreateImageBlueprintName(modalBlueprintName));
  },
  setModalCreateImageVisible: modalVisible => {
    dispatch(setModalCreateImageVisible(modalVisible));
  },
  deletingBlueprint: blueprint => {
    dispatch(deletingBlueprint(blueprint));
  },
  blueprintsSortSetKey: key => {
    dispatch(blueprintsSortSetKey(key));
  },
  blueprintsSortSetValue: value => {
    dispatch(blueprintsSortSetValue(value));
  },
  blueprintsFilterAddValue: value => {
    dispatch(blueprintsFilterAddValue(value));
  },
  blueprintsFilterRemoveValue: value => {
    dispatch(blueprintsFilterRemoveValue(value));
  },
  blueprintsFilterClearValues: value => {
    dispatch(blueprintsFilterClearValues(value));
  },
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(BlueprintsPage);
