/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import BlueprintApi from '../../data/BlueprintApi';
import { connect } from 'react-redux';
import {
  setModalCreateBlueprintErrorNameVisible, setModalCreateBlueprintErrorDuplicateVisible,
  setModalCreateBlueprintErrorInline, setModalCreateBlueprintCheckErrors, setModalCreateBlueprintBlueprint,
} from '../../core/actions/modals';
import { creatingBlueprintSucceeded } from '../../core/actions/blueprints';

class CreateBlueprint extends React.Component {

  componentDidMount() {
    this.bindAutofocus();
  }

  componentDidUpdate() {
    this.unbind();
    this.bindAutofocus();
  }

  componentWillUnmount() {
    const initialBlueprint = {
      name: '',
      description: '',
      modules: [],
      packages: [],
    };
    this.props.setModalCreateBlueprintBlueprint(initialBlueprint);
    this.unbind();
  }

  bindAutofocus() {
    $('#cmpsr-modal-crt-blueprint').on('shown.bs.modal', () => {
      $('#textInput-modal-markup').focus();
    });
  }

  unbind() {
    $('#cmpsr-modal-crt-image .btn-primary').off('shown.bs.modal');
  }

  handleChange(e, prop) {
    const o = Object.assign({}, this.props.createBlueprint.blueprint);
    o[prop] = e.target.value;
    this.props.setModalCreateBlueprintBlueprint(o);
    if (prop === 'name') {
      this.dismissErrors();
      this.handleErrorDuplicate(e.target.value);
    }
  }

  handleEnterKey(event) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleErrors(this.props.createBlueprint.blueprint.name);
      setTimeout(() => {
        if (this.props.createBlueprint.errorNameVisible || this.props.createBlueprint.errorDuplicateVisible) {
          this.showInlineError();
        } else {
          this.handleCreateBlueprint(event, this.props.createBlueprint.blueprint);
        }
      }, 300);
    }
  }

  handleCreateBlueprint(event, blueprint) {
    $('#cmpsr-modal-crt-blueprint').modal('hide');
    BlueprintApi.handleCreateBlueprint(event, blueprint);
    const updatedBlueprint = blueprint;
    updatedBlueprint.id = updatedBlueprint.name.replace(/\s/g, '-');
    this.props.creatingBlueprintSucceeded(updatedBlueprint);
  }

  errorChecking(state) {
    this.props.setModalCreateBlueprintCheckErrors(state);
  }

  dismissErrors() {
    this.props.setModalCreateBlueprintErrorInline(false);
    this.props.setModalCreateBlueprintErrorNameVisible(false);
    this.props.setModalCreateBlueprintErrorDuplicateVisible(false);
  }

  handleErrors(blueprintName) {
    this.handleErrorDuplicate(blueprintName);
    this.handleErrorName(blueprintName);
  }

  handleErrorDuplicate(blueprintName) {
    const nameNoSpaces = blueprintName.replace(/\s+/g, '-');
    if (this.props.blueprintNames.includes(nameNoSpaces)) {
      this.props.setModalCreateBlueprintErrorDuplicateVisible(true);
    }
  }

  handleErrorName(blueprintName) {
    if (blueprintName === '' && this.props.createBlueprint.checkErrors) {
      setTimeout(() => {
        this.props.setModalCreateBlueprintErrorNameVisible(true);
      }, 200);
    }
  }

  showInlineError() {
    this.props.setModalCreateBlueprintErrorInline(true);
  }

  render() {
    const { createBlueprint } = this.props;
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-blueprint"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
                onMouseEnter={() => this.errorChecking(false)}
                onMouseLeave={() => this.errorChecking(true)}
                onClick={(e) => this.dismissErrors(e)}
              >
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Create Blueprint</h4>
            </div>
            <div className="modal-body">
              {(createBlueprint.errorInline && createBlueprint.errorNameVisible) &&
                <div className="alert alert-danger">
                  <span className="pficon pficon-error-circle-o"></span>
                  <strong>Required information is missing.</strong>
                </div>
              }
              {(createBlueprint.errorInline && createBlueprint.errorDuplicateVisible) &&
                <div className="alert alert-danger">
                  <span className="pficon pficon-error-circle-o"></span>
                  <strong>Specify a new blueprint name.</strong>
                </div>
              }
              <form className="form-horizontal" onKeyPress={(e) => this.handleEnterKey(e)}>
                <p className="fields-status-pf">
                  The fields marked with <span className="required-pf">*</span> are required.
                </p>
                <div
                  className={`form-group ${(createBlueprint.errorNameVisible || createBlueprint.errorDuplicateVisible)
                    ? 'has-error' : ''}`}
                >
                  <label
                    className="col-sm-3 control-label required-pf"
                    htmlFor="textInput-modal-markup"
                  >Name</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="textInput-modal-markup"
                      className="form-control"
                      value={createBlueprint.blueprint.name}
                      onFocus={(e) => { this.dismissErrors(); this.handleErrorDuplicate(e.target.value); }}
                      onChange={(e) => this.handleChange(e, 'name')}
                      onBlur={(e) => this.handleErrors(e.target.value)}
                    />
                    {createBlueprint.errorNameVisible &&
                      <span className="help-block">A blueprint name is required.</span>
                    }
                    {createBlueprint.errorDuplicateVisible &&
                      <span className="help-block">The name "{createBlueprint.blueprint.name}" already exists.</span>
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput2-modal-markup"
                  >Description</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="textInput2-modal-markup"
                      className="form-control"
                      value={createBlueprint.blueprint.description}
                      onChange={(e) => this.handleChange(e, 'description')}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onMouseEnter={() => this.errorChecking(false)}
                onMouseLeave={() => this.errorChecking(true)}
                onClick={(e) => this.dismissErrors(e)}
              >Cancel</button>
              {(createBlueprint.blueprint.name === '' || createBlueprint.errorDuplicateVisible) &&
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => this.showInlineError(e)}
                >Create</button>
                ||
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => { this.handleCreateBlueprint(e, createBlueprint.blueprint); }}
                >Create</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateBlueprint.propTypes = {
  blueprintNames: PropTypes.array,
  setModalCreateBlueprintErrorNameVisible: PropTypes.func,
  setModalCreateBlueprintErrorDuplicateVisible: PropTypes.func,
  setModalCreateBlueprintErrorInline: PropTypes.func,
  setModalCreateBlueprintCheckErrors: PropTypes.func,
  setModalCreateBlueprintBlueprint: PropTypes.func,
  createBlueprint: PropTypes.object,
  creatingBlueprintSucceeded: PropTypes.func,
};

const mapStateToProps = state => ({
  createBlueprint: state.modals.createBlueprint,
});


const mapDispatchToProps = dispatch => ({
  setModalCreateBlueprintErrorNameVisible: nameErrorVisible => {
    dispatch(setModalCreateBlueprintErrorNameVisible(nameErrorVisible));
  },
  setModalCreateBlueprintErrorDuplicateVisible: duplicateErrorVisible => {
    dispatch(setModalCreateBlueprintErrorDuplicateVisible(duplicateErrorVisible));
  },
  setModalCreateBlueprintErrorInline: inlineError => {
    dispatch(setModalCreateBlueprintErrorInline(inlineError));
  },
  setModalCreateBlueprintCheckErrors: checkErrors => {
    dispatch(setModalCreateBlueprintCheckErrors(checkErrors));
  },
  setModalCreateBlueprintBlueprint: blueprint => {
    dispatch(setModalCreateBlueprintBlueprint(blueprint));
  },
  creatingBlueprintSucceeded: (blueprint) => {
    dispatch(creatingBlueprintSucceeded(blueprint));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBlueprint);
