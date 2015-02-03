define([

  'App'

], function (DSW) {

  'use strict';

  DSW.module('Modules.CreateProject', {

    moduleClass: DSW.moduleClasses.ProjectFormContainer,

    define: function (module, app) {

      module.verbose = true;

      module.startWithParent = false;

      module.showModal = function (opts) {

        opts = opts || {};

        var type = '';

        if (opts.request) {
          type = 'request';
        } else {
          type = 'new'
        }

        app.userRouter.navigate('#projects/' + type);

        app.trigger('bc:route', new Backbone.Collection([
          {
            title: 'projects',
            link: 'projects'
          },
          {
            title: type,
            link: 'projects/' + type
          }

        ]));

        require(['views/item/LoadingView'], function (LoadingView) {
          var loadingView = new LoadingView({
            title: "Loading Project Create...",
            message: "Please wait, loading collections data..."
          });
          app.trigger('workspace:show', loadingView)
        });



        //var promise = app.request('fetch', collectionsToFetch);
        //
        //promise.done(function () {
        //  var data = {
        //    deps: colls,
        //    type: type
        //  };
        //  require(['views/modals/CreateProject'], function (CreateProjectView) {
        //    var view = new CreateProjectView(data);
        //    app.trigger('workspace:show', view);
        //  })
        //})

      };

    }
  });

  return DSW.Modules.CreateProject;

});
