/* *
  Application Constants
 */

const constants = {
  // BDCS API paths
  get_blueprints_list: '/api/v0/blueprints/list',
  get_blueprints_info: '/api/v0/blueprints/info/',
  get_blueprints_deps: '/api/v0/blueprints/depsolve/',
  get_modules_list: '/api/v0/modules/list',
  get_projects_info: '/api/v0/projects/info/',
  get_projects_deps: '/api/v0/projects/depsolve/',
  get_modules_info: '/api/v0/modules/info/',
  get_image_types: '/api/v0/compose/types',
  get_image_output: '/api/v0/compose/image/',
  get_image_status: '/api/v0/compose/status/',
  get_compose_queue: '/api/v0/compose/queue',
  get_compose_finished: '/api/v0/compose/finished',
  get_compose_failed: '/api/v0/compose/failed',
  cancel_compose: '/api/v0/compose/cancel/',
  delete_compose: '/api/v0/compose/delete/',
  post_blueprints_new: '/api/v0/blueprints/new',
  post_blueprints_workspace: '/api/v0/blueprints/workspace',
  post_compose_start: '/api/v0/compose',
  delete_blueprint: '/api/v0/blueprints/delete/',
  delete_workspace: '/api/v0/blueprints/workspace/',
  get_sources_list: '/api/v0/projects/source/list',
  get_sources_info: '/api/v0/projects/source/info/',

};


export default constants;
