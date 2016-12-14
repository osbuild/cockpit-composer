import React, { PropTypes } from 'react';
import constants from '../../core/constants';

class CreateComposition extends React.Component {

  state = { comptypes: [] };


  componentWillMount() {
		this.getComptypes();
  }

  componentDidMount() {
    this.bindCreateCompos();
  }

  componentDidUpdate() {
    this.unbind();
    this.bindCreateCompos();
  }

  componentWillUnmount(){
    this.unbind();
  }

  getComptypes() {
		let that = this;
		fetch(constants.get_comptypes_url).then(r => r.json())
			.then(data => {
				that.setState({comptypes : data.types})
			})
			.catch(e => console.log("Error getting component types: " + e));
	}

  bindCreateCompos() {
    // click the list-view heading then expand a row
    $("#cmpsr-modal-crt-compos .btn-primary").click(function(event){
      $('#cmpsr-modal-crt-compos').modal('hide');
      $("#cmpsr-toast-process-compos").removeClass("hidden");
      setTimeout(function(){
        $("#cmpsr-toast-process-compos").addClass("hidden");
        $("#cmpsr-toast-success-compos").removeClass("hidden");
      }, 1500);
    });
  }

  unbind() {
    $("#cmpsr-modal-crt-compos .btn-primary").off('click');
  }


  render() {

    return (
      <div className="modal fade" id="cmpsr-modal-crt-compos" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
                  <label className="col-sm-3 control-label" htmlFor="textInput-modal-markup">Composition Type</label>
                  <div className="col-sm-9">
                    <select>
                      {this.state.comptypes.map((type,i) =>
                        <option key={i} disabled={!type.enabled}>{type.name}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="textInput2-modal-markup">Field Two</label>
                  <div className="col-sm-9">
                    <input type="text" id="textInput2-modal-markup" className="form-control" /></div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="textInput3-modal-markup">Field Three</label>
                  <div className="col-sm-9">
                    <input type="text" id="textInput3-modal-markup" className="form-control" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">OK</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CreateComposition;
