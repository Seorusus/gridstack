/**
 * Created by bob on 21.09.17.
 */
mbcApp.controller('PageList', ['$scope', '$http', 'PageService', '$location', '$timeout',
    function($scope, $http, PageService, $location, $timeout){

        //var count = 0;
        var poller = function() {
            PageService.getPages(function(data){
                $scope.pages = data;
            });
        }
        poller();

        $scope.newPage = function(){
            var csrf = drupalSettings.csrf;
            // Get our data from the form
            var package = {
                'title': { 'value': $scope.title },
                '_links': { 'type': { 'href': drupalSettings.baseUrl + '/rest/type/node/mbc_page' }},
                'type' : {"target_id": "mbc_page"},
            }

            // Call the PageService object with the addPage method
            PageService.addPage(package, csrf)
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

        $scope.deletePage = function(id){

            PageService.deletePage(id)
                .success(function(){
                    PageService.getPages(function(data){
                        $scope.pages = data;
                    });
                })
        }

    }]);
