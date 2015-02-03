define([

  'App'

], function (DSW) {

  'use strict';

  DSW.module('Modules.ManageEnvironments', {

    moduleClass: DSW.moduleClasses.ProjectFormContainer,

    define: function (module, app) {

      module.verbose = true;

      var envModule = DSW.module('Modules.ManageEnvironments.Env');
      var depsInitializer = envModule.getEnvDepsInitializer();
      var depsFetcher = envModule.getEnvDepsFetcher();
      module.setDepsInitializer(depsInitializer);
      module.setDepsFetcher(depsFetcher);
      module.trigger('deps:init:start', this);

      module.startWithParent = false;
      module.opts = {};
      module.showDialog = function (projectName) {
        module.opts.projectName = projectName;

        var aLevels = app.request('get:accessLevels');

        if (!aLevels.level2()) {
          app.trigger('alert:show', {
            type: 'danger',
            message: 'Sorry, you\'re not authorized for this operation.'
          });
          app.trigger('workspace:nav:close');
          require(['modules/ProjectsList'], function (ProjectsList) {
            ProjectsList.start();
            ProjectsList.showProjectsList();
          });
          return false;
        }

        app.userRouter.navigate('#projects/' + projectName + '/environments');

        app.trigger('bc:route', new Backbone.Collection([

          {
            title: 'projects',
            link: 'projects'
          },

          {
            title: projectName,
            link: 'projects/' + projectName
          },

          {
            title: 'environments',
            link: 'projects/' + projectName + '/environments'
          }
        ]));

        require(['views/item/LoadingView'], function (LoadingView) {
          var loadingView = new LoadingView({
            title: "Loading Manage Environments...",
            message: "Please wait, loading environments data..."
          });
          app.trigger('workspace:show', loadingView)
        });

      };

    }
  })
  ;

  return DSW.Modules.ManageEnvironments;

});