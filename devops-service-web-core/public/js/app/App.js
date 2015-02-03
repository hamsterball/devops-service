define([

  'jquery',
  'backbone',

  'marionette',
  'handlebars'

], function ($, Backbone) {

  'use strict';

  var App = new Backbone.Marionette.Application({

    moduleClasses: function () {

      var Common = Marionette.Module.extend({
        log: function (message, obj) {
          if (!this.verbose) return;
          message = message || "";
          obj = obj || "";
          console.info("[" + this.moduleName + "]: " + message, obj);
        }
      });

      var ProjectFormContainer = Common.extend({

        test: function (arg) {
          var str = " !!! " + arg;
          this.log(str);
        },

        initialize: function () {
          this.on("deps:init:start", this.onDepsInitStart);
          this.on("deps:init:done", this.onDepsInitDone);
          this.on("deps:fetch:start", this.onDepsFetchStart);
          this.on("deps:fetch:done", this.onDepsFetchDone);
        },

        setDepsInitializer: function (f) {
          this.depsInitializer = f;
        },

        setDepsFetcher: function (fetcher) {
          this.depsFetcher = fetcher;
        },

        setDependencies: function (deps) {
          this.dependencies = deps;
        },

        getDependencies: function () {
          return this.dependencies;
        },

        initDependencies: function () {
          if (!this.depsInitializer) {
            this.log("started empty deps initializer");
            this.trigger("deps:init:done");
            return;
          }
          this.depsInitializer(this);
        },

        fetchDependencies: function () {
          if (!this.depsFetcher) {
            this.log("started empty deps fetcher");
            this.trigger("deps:fetch:done");
            return;
          }
          this.depsFetcher(this);
        },

        onDepsInitStart: function () {
          this.log('initializing dependencies...');
          this.initDependencies();
        },

        onDepsInitDone: function () {
          this.log('initializing dependencies... Done.')
          this.trigger('deps:fetch:start', this);
        },

        onDepsFetchStart: function () {
          this.log('fetching dependencies...');
          this.fetchDependencies();
        },

        onDepsFetchDone: function () {
          this.log('fetching dependencies... Done.');
        }

      });

      return {
        Common: Common,
        ProjectFormContainer: ProjectFormContainer
      }
    }(),

    log: function (type, message) {
      if (type === 'err') {
        this.execute('console:error', message);
      }
    },

    dlog: function (params, o) {
      console.info(params, o);
    }
  });

  App.reqres.setHandler('get:todayDate', function () {
    var date = new Date();
    var dd = ('0' + date.getDate()).slice(-2);
    var mm = ('0' + (date.getMonth() + 1)).slice(-2);
    var yyyy = date.getFullYear();
    var dateString = yyyy + "-" + mm + "-" + dd;
    console.log('getted date ', dateString);
    return dateString;
  });

  App.reqres.setHandler('get:dateIncrement', function (date) {
    var current = date.getDate();
    date.setDate(current + 1);
    console.log('get:dateIncrement', current, date);
    return date;
  });

  App.reqres.setHandler('set:serviceHostname', function (hostname) {
    App.reqres.setHandler('get:serviceHostname', function () {
      return hostname;
    })
  });

  App.reqres.setHandler('set:currentUser', function (username) {
    App.reqres.setHandler('get:currentUser', function () {
      return username;
    })
  });

  App.addRegions({
    workspaceRegion: '#workspace',
    alertRegion: '#alert',
    consoleRegion: '#console',
    footerRegion: '#footer',
    navbarRegion: '#navbar',
    projectNavbarRegion: '#project-nav',
    navbarRegionNav: '#navbar-nav',
    breadcrumbsRegion: '#breadcrumbs',
    sidebarInfoRegion: '#sidebar-info'
  });

  App.addInitializer(function () {
    Backbone.history.start();
  });

  App.module('Views', function (Views, app) {

    App.module('Views.Composite', function (Composite) {

      Composite.addInitializer(function () {
        //require(['views/composite/ProjectNavigation']);
      });

    });

    App.module('Views.Modals', function (Modals) {

      Modals.addInitializer(function () {
        require(['views/modals/ManageUsers']);
      });

      app.module('Views.Modals.Alerts', function (Alerts) {

        Alerts.addInitializer(function () {
          require(['views/modals/alert/DeleteProject']);
        });

      });

    });

  });

  return App;

});
