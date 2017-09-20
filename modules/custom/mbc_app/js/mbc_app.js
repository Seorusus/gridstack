var mbcApp = angular.module("myModule", []).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('<<').endSymbol('>>');
});

mbcApp.controller("myController", function ($scope) {
    $scope.message = "This is AngularJS";
});
