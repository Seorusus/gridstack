var mbcApp = angular.module("mbcApp", ['ngSanitize', 'dndLists', 'gridstack-angular', 'mgcrea.ngStrap', 'mgcrea.ngStrap.datepicker']);

var app = angular.module('gridstack-angular', ['mbcApp', 'mgcrea.ngStrap', 'mgcrea.ngStrap.datepicker']).config(function($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
        autoclose: true,
    });
})