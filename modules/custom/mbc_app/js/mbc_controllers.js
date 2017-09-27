/**
 * Created by bob on 21.09.17.
 */
mbcApp.controller('PageList', ['$scope', '$http', 'PageService', '$location', '$timeout',
    function($scope, $http, PageService, $location, $timeout){
        var csrf = drupalSettings.csrf;
        var baseUrl = drupalSettings.baseUrl;
        //var count = 0;
        var poller = function() {
            PageService.getPages(function(data){
                $scope.pages = data;
            });
        }
        poller();

        $scope.newPage = function(){

            // Get our data from the form
            var package = {
                'title': { 'value': $scope.title },
                '_links': { 'type': { 'href': baseUrl + '/rest/type/node/mbc_page' }},
                'type' : {"target_id": "mbc_page"},
            }

            // Call the PageService object with the addPage method
            PageService.addPage(package, csrf, baseUrl)
                .success(function(){
                    console.log("Added");

                    // Clear the inputs
                    $scope.title = '';

                    // Re-call the list of pages so that it updates
                    PageService.getPages(function(data){
                        $scope.pages = data;
                    });
                })
        }
        $scope.updatePage = function (nid, values) {
            var package = {
                '_links': { 'type': { 'href': baseUrl + '/rest/type/node/mbc_page' }},
                'type' : {"target_id": "mbc_page"},
            }
            angular.forEach(values, function(value, key){
                package[key] = value;
            });
            PageService.updatePage(package, csrf, baseUrl, nid)
                .success(function() {
                    console.log("Updated");
                });
        }

        $scope.deletePage = function(id){

            PageService.deletePage(id, csrf)
                .success(function(){
                    PageService.getPages(function(data){
                        $scope.pages = data;
                    });
                })
        }

        $scope.savePagesList = function(){
           var pages = $scope.pages;
           var i = 0;
           var values = {};
            angular.forEach (pages, function (value, key){
                $scope.pages[key].field_weight_value = i;
                i++;
                values = {
                    'field_weight': {"value": value.field_weight_value},
                };

                $scope.updatePage(value.nid, values);
            });
        }

    }]);
