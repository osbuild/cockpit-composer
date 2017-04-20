import React from 'react';
import RecipeApi from '../../data/RecipeApi';


class CreateRecipe extends React.Component {

  state = { showErrorName: false, inlineError: false, checkErrors: true,
    recipe: {
      name: '',
      description: '',
      modules: [],
      packages: [],
    },
  };

  componentDidMount() {
    this.bindAutofocus();
  }

  componentDidUpdate() {
    this.unbind();
    this.bindAutofocus();
  }

  componentWillUnmount() {
    this.unbind();
  }

  bindAutofocus() {
    $('#cmpsr-modal-crt-recipe').on('shown.bs.modal', () => {
      $('#textInput-modal-markup').focus();
    });
  }

  unbind() {
    $('#cmpsr-modal-crt-compos .btn-primary').off('shown.bs.modal');
  }

  handleChange = (e, prop) => {
    const o = Object.assign({}, this.state.recipe);
    o[prop] = e.target.value;
    this.setState({ recipe: o });
  };

  handleEnterKey(event) {
    if (event.which === 13 || event.keyCode === 13) {
      if (this.state.recipe.name === '') {
        this.setState({ showErrorName: true });
        this.showInlineError();
      } else {
        this.handleCreateRecipe(event, this.state.recipe);
      }
    }
  }

  handleCreateRecipe(event, recipe) {
    $('#cmpsr-modal-crt-recipe').modal('hide');
    RecipeApi.handleCreateRecipe(event, recipe);
  }

  errorChecking(state) {
    this.setState({checkErrors: state});
  }

  dismissErrors(e) {
    this.setState({ inlineError: false });
    this.setState({ showErrorName: false });
  }

  handleErrorName(event) {
    if (this.state.recipe.name === '' && this.state.checkErrors) {
      setTimeout(() => {
        this.setState({ showErrorName: true });
      }, 400); // don't change state immediately so that user has time to finish clicking Save,
               // if that's how onBlur is triggered
    }
  }

  showInlineError() {
    this.setState({ inlineError: true });
  }



  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-recipe"
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
              <h4 className="modal-title" id="myModalLabel">Create Recipe</h4>
            </div>
            <div className="modal-body">
              {this.state.inlineError === true &&
                <div className="alert alert-danger">
                  <span className="pficon pficon-error-circle-o"></span>
                  <strong>Required information is missing.</strong>.
                </div>
              }
              <form className="form-horizontal" onKeyPress={(e) => this.handleEnterKey(e)}>
                <p className="fields-status-pf">
                  The fields marked with <span className="required-pf">*</span> are required.
                </p>
                <div className={`form-group ${this.state.showErrorName ? 'has-error' : ''}`}>
                  <label
                    className="col-sm-3 control-label required-pf"
                    htmlFor="textInput-modal-markup"
                  >Name</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="textInput-modal-markup"
                      className="form-control"
                      value={this.state.recipe.name}
                      onChange={(e) => this.handleChange(e, 'name')}
                      onBlur={(e) => this.handleErrorName(e)}
                    />
                    {this.state.showErrorName === true &&
                      <span className="help-block">A recipe name is required.</span>
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
                      value={this.state.recipe.description}
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
              {this.state.recipe.name === '' &&
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => this.showInlineError(e)}
                >Save</button>
                ||
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => this.handleCreateRecipe(e, this.state.recipe)}
                >Save</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default CreateRecipe;
