import React, { PropTypes } from 'react';
import cx from 'classnames';
import Header from './Header';
import Navigation from './Navigation';
import s from './Layout.css';

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div>
        <Header />
        <Navigation />
        <div className="toast-notifications-list-pf">
        	<div className="toast-pf alert alert-info alert-dismissable hidden" id="cmpsr-toast-process-compos">
        		<button type="button" className="close" data-dismiss="alert" aria-hidden="true">
        	    <span className="pficon pficon-close"></span>
        	  </button>
        	  <div className="pull-right toast-pf-action">
        	    <a href="#">Cancel</a>
        	  </div>
        	  <span className="pficon"><div className="spinner spinner-inverse"></div></span>
        	  <strong>Low Latency:</strong> Creating composition.
        	</div>

        	<div className="toast-pf alert alert-success alert-dismissable hidden" id="cmpsr-toast-success-compos">
            <div className="dropdown pull-right dropdown-kebab-pf">
              <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span className="fa fa-ellipsis-v"></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
                <li><a href="#" id="cmpsr-bom-link">Export Recipe (.bom)</a></li>
                <li><a href="#" data-dismiss="alert">Close</a></li>
              </ul>
            </div>
            <div className="pull-right toast-pf-action">
              <a href="#" id="cmpsr-download-link">Download (.iso)</a>
            </div>
        	  <span className="pficon pficon-ok"></span>
        	  <strong>Low Latency:</strong> Composition creation is complete.
        	</div>

        </div>
        <div {...this.props} className={cx(s.content, this.props.className)} />
      </div>
    );
  }
}

export default Layout;
