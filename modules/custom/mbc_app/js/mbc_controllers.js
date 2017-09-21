/**
 * Created by bob on 21.09.17.
 */
mbcApp.controller('PageList', ['$scope', '$http', 'PageService', '$location', '$timeout',
    function($scope, $http, PageService, $location, $timeout){

        // Call the GetTasks service and the tasks method
        // Then pass the data form this to the scope
        // Addition: created a poller which uses the timeout service to query the feed every 5 seconds
        // Upon querying, it just updates the task list.

        //var count = 0;
        var poller = function() {
            $timeout(poller, 5000);
            //count++;
            //count = count;
            //console.log(count);
            PageService.getPages(function(data){
                $scope.pages = data;
            });
        }
        poller();

        $scope.newPage = function(){

            // Get our data from the form
            var package = {
                'title': { 'value': $scope.title },
                '_links': { 'type': { 'href': '/rest/type/node/mbc_page' }}
            }

            // Call the PageService object with the addPage method
            PageService.addPage(package)
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
                    // Redirect to the page list
                    $location.path('/');
                })
        }

    }]);
