import React from 'react';

class Toolbar extends React.Component {

  render() {
    return (

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
                  >Name<span className="caret"></span></button>
                  <ul className="dropdown-menu">
                    <li><a >Name</a></li>
                    <li><a >Version</a></li>
                  </ul>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="filter"
                  placeholder="Filter By Name..."
                />
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
                >Name<span className="caret"></span></button>
                <ul className="dropdown-menu">
                  <li><a >Name</a></li>
                  <li><a >Version</a></li>
                </ul>
              </div>
              <button className="btn btn-link" type="button">
                <span className="fa fa-sort-alpha-asc"></span>
              </button>
            </div>

            <div className="toolbar-pf-action-right">
              <div className="form-group">
                <button
                  className="btn btn-default"
                  id="cmpsr-btn-crt-compos"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-compos"
                  type="button"
                >Create Composition</button>
                <div className="dropdown btn-group  dropdown-kebab-pf">
                  <button
                    className="btn btn-link dropdown-toggle"
                    type="button"
                    id="dropdownKebab"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ><span className="fa fa-ellipsis-v"></span></button>
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
                    <li><a >Export Recipe</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a >Update Selected Components</a></li>
                    <li><a >Remove Selected Components</a></li>
                  </ul>
                </div>
              </div>
              <div className="form-group toolbar-pf-find">
                <button className="btn btn-link btn-find" type="button">
                  <span className="fa fa-search"></span>
                </button>
                <div className="find-pf-dropdown-container">
                  <input
                    type="text"
                    className="form-control"
                    id="find"
                    placeholder="Find By Keyword..."
                  />
                  <div className="find-pf-buttons">
                    <span className="find-pf-nums">1 of 3</span>
                    <button className="btn btn-link" type="button">
                      <span className="fa fa-angle-up"></span>
                    </button>
                    <button className="btn btn-link" type="button">
                      <span className="fa fa-angle-down"></span>
                    </button>
                    <button className="btn btn-link btn-find-close" type="button">
                      <span className="pficon pficon-close"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="row toolbar-pf-results toolbar-pf-results-none">
            <div className="col-sm-12">
              <h5>40 Results</h5>
              <p>Active filters: </p>
              <ul className="list-inline">
                <li>
                  <span className="label label-info">Name: nameofthething
                    <a ><span className="pficon pficon-close"></span></a>
                  </span>
                </li>
                <li>
                  <span className="label label-info">Version: 3
                    <a ><span className="pficon pficon-close"></span></a>
                  </span>
                </li>
                <li>
                  <span className="label label-info">Lifecycle: 5
                    <a ><span className="pficon pficon-close"></span></a>
                  </span>
                </li>
              </ul>
              <p><a >Clear All Filters</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Toolbar;
