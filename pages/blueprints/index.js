import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import BlueprintListView from '../../components/ListView/BlueprintListView';
import CreateBlueprint from '../../components/Modal/CreateBlueprint';
import ExportBlueprint from '../../components/Modal/ExportBlueprint';
import EmptyState from '../../components/EmptyState/EmptyState';
import { connect } from 'react-redux';
import { deletingBlueprint } from '../../core/actions/blueprints';
import {
  setModalExportBlueprintName,
  setModalExportBlueprintContents,
  setModalExportBlueprintVisible,
  fetchingModalExportBlueprintContents,
} from '../../core/actions/modals';
import { blueprintsSortSetKey, blueprintsSortSetValue } from '../../core/actions/sort';
import { makeGetSortedBlueprints } from '../../core/selectors';

class BlueprintsPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHideModalExport = this.handleHideModalExport.bind(this);
    this.handleShowModalExport = this.handleShowModalExport.bind(this);
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

  render() {
    const { blueprints, exportBlueprint, createImage, blueprintSortKey, blueprintSortValue } = this.props;
    return (
      <Layout className="container-fluid" ref="layout">
        <div className="row toolbar-pf">
          <div className="col-sm-12">
            <form className="toolbar-pf-actions">
              <div className="form-group toolbar-pf-filter">
                <label className="sr-only" htmlFor="filter">Name</label>
                <div className="input-group">
                  <div className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-default dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Name<span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li><a>Name</a></li>
                      <li><a>Version</a></li>
                    </ul>
                  </div>
                  <input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
                </div>
              </div>
              <div className="form-group">
                <div className="dropdown btn-group">
                  <button
                    type="button"
                    className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Name<span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    <li><a>Name</a></li>
                    <li><a>Version</a></li>
                  </ul>
                </div>
              {blueprintSortKey === 'name' && blueprintSortValue === 'DESC' &&
                <button className="btn btn-link" type="button" onClick={() => this.props.blueprintsSortSetValue('ASC')}>
                  <span className="fa fa-sort-alpha-asc" />
                </button>
              ||
              blueprintSortKey === 'name' && blueprintSortValue === 'ASC' &&
                <button className="btn btn-link" type="button" onClick={() => this.props.blueprintsSortSetValue('DESC')}>
                  <span className="fa fa-sort-alpha-desc" />
                </button>
              }
              </div>
              <div className="toolbar-pf-action-right">
                <div className="form-group">
                  <button className="btn btn-default" type="button" data-toggle="modal" data-target="#cmpsr-modal-crt-blueprint">
                    Create Blueprint
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      {blueprints.length === 0 &&
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
      }
      {createImage.imageTypes !== undefined &&
        <BlueprintListView
          blueprints={blueprints.map(blueprint => blueprint.present)}
          imageTypes={createImage.imageTypes}
          handleDelete={this.handleDelete}
          setNotifications={this.setNotifications}
          handleShowModalExport={this.handleShowModalExport}
        />
      }
        <CreateBlueprint blueprintNames={blueprints.map(blueprint => blueprint.present.id)} />
        {(exportBlueprint !== undefined && exportBlueprint.visible)
          ? <ExportBlueprint
            blueprint={exportBlueprint.name}
            contents={exportBlueprint.contents}
            handleHideModal={this.handleHideModalExport}
          />
          : null}
      </Layout>
    );
  }
}

BlueprintsPage.propTypes = {
  deletingBlueprint: PropTypes.func,
  setModalExportBlueprintVisible: PropTypes.func,
  setModalExportBlueprintName: PropTypes.func,
  setModalExportBlueprintContents: PropTypes.func,
  fetchingModalExportBlueprintContents: PropTypes.func,
  blueprints: PropTypes.array,
  exportBlueprint: PropTypes.object,
  createImage: PropTypes.object,
  blueprintSortKey: PropTypes.string,
  blueprintSortValue: PropTypes.string,
  blueprintsSortSetKey: PropTypes.func,
  blueprintsSortSetValue: PropTypes.func,
};

const makeMapStateToProps = () => {
  const getSortedBlueprints = makeGetSortedBlueprints();
  const mapStateToProps = (state) => {
    if (getSortedBlueprints(state) !== undefined) {
      return {
        exportBlueprint: state.modals.exportBlueprint,
        createImage: state.modals.createImage,
        blueprints: getSortedBlueprints(state),
        blueprintSortKey: state.sort.blueprints.key,
        blueprintSortValue: state.sort.blueprints.value,
      };
    }
    return {
      exportBlueprint: state.modals.exportBlueprint,
      createImage: state.modals.createImage,
      blueprints: {},
      blueprintSortKey: state.sort.blueprints.key,
      blueprintSortValue: state.sort.blueprints.value,
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
  deletingBlueprint: blueprint => {
    dispatch(deletingBlueprint(blueprint));
  },
  blueprintsSortSetKey: key => {
    dispatch(blueprintsSortSetKey(key));
  },
  blueprintsSortSetValue: value => {
    dispatch(blueprintsSortSetValue(value));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(BlueprintsPage);
