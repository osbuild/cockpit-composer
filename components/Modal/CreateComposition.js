import React from 'react';
import constants from '../../core/constants';
import utils from '../../core/utils';
import NotificationsApi from '../../data/NotificationsApi';

class CreateComposition extends React.Component {

  state = { comptypes: [] };

  componentWillMount() {
    this.getComptypes();
  }

  getComptypes() {
    const that = this;
    utils.apiFetch(constants.get_compose_types)
      .then(data => {
        that.setState({ comptypes: data.types });
      })
      .catch(e => console.log(`Error getting component types: ${e}`));
  }

  handleCreateCompos = () => {
    $('#cmpsr-modal-crt-compos').modal('hide');
    NotificationsApi.displayNotification(this.props.recipe, 'creating');
    this.props.setNotifications();
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-compos"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Create Composition</h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput-modal-markup"
                  >Composition Type</label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      {this.state.comptypes.map((type, i) =>
                        <option key={i} disabled={!type.enabled}>{type.name}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput2-modal-markup"
                  >Architecture</label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <option>i686</option>
                      <option>x86_64</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleCreateCompos()}>OK</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default CreateComposition;
