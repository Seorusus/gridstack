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
                .then(function(response){
                    console.log("Added");

                    // Clear the inputs
                    $scope.title = '';
                    var resData = response.data;
                    // Re-call the list of pages so that it updates
                    PageService.getPages(function(resData){
                        $scope.pages = resData;
                    });
                })
        }

        $scope.loadPage = function(nid) {
            PageService.loadPage(nid, function(data){
                if (data.field_gridstack_data !== undefined) {
                    $scope.$emit('pageLoaded', {
                        "nid": nid,
                        "grid": JSON.parse(data.field_gridstack_data[0].value),
                    });
                }
            });
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
                .then(function() {
                    console.log("Updated");
                });
        }
        $scope.deletePage = function(id){

            PageService.deletePage(id, csrf)
                .then(function(response){
                    var resData = response.data;
                    PageService.getPages(function(resData){
                        $scope.pages = resData;
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

app.controller('GridstackController', ['$scope', '$datepicker', function($scope, $datepicker) {

    $scope.button = {
        'toggle' : true,
    }

    $scope.selectedDate = "2017-10-07T17:17:09.840Z";

    this.gridstack = null;

    this.init = function(element, options) {
        this.gridstack = element.gridstack(options).data('gridstack');
        return this.gridstack;
    };

    this.removeItem = function(element) {
        if(this.gridstack) {
            return this.gridstack.removeWidget(element, false);
        }
        return null;
    };

    this.addItem = function(element) {
        if(this.gridstack) {
            this.gridstack.makeWidget(element);
            return element;
        }
        return null;
    };

}]);

mbcApp.controller('DemoCtrl', ['$scope', 'PageService', function($scope, PageService) {

    var csrf = drupalSettings.csrf;
    var baseUrl = drupalSettings.baseUrl;

    $scope.$on('pageLoaded', function(event, pageObj) {
        $scope.widgets = pageObj.grid;
        $scope.nid = pageObj.nid;
        console.log($scope);
    });

    $scope.options = {
        cellHeight: 200,
        verticalMargin: 10
    };

    $scope.savePage = function() {
        var nid = $scope.nid;
        var package = {
            '_links': { 'type': { 'href': baseUrl + '/rest/type/node/mbc_page' }},
            'type' : {"target_id": "mbc_page"},
        }
        var values = {
            'field_gridstack_data' : {
                "value": JSON.stringify($scope.widgets)
            },
        }
        angular.forEach(values, function(value, key){
            package[key] = value;
        });
        PageService.updatePage(package, csrf, baseUrl, nid)
            .then(function() {
                console.log("Saved");
            });
    }

    $scope.addWidget = function(widid) {
        var newWidget = { x:0, y:0, width:3, height:1, mbcWidgetId:widid};
        $scope.widgets.push(newWidget);
    };

    $scope.moveWidget = function() {
        $scope.widgets[0].x = 1;
        $scope.widgets[0].width = 3;
        $scope.widgets[0].height = 1;
    };

    $scope.removeWidget = function(w) {
        var index = $scope.widgets.indexOf(w);
        $scope.widgets.splice(index, 1);
    };

    $scope.onChange = function(event, items) {
        console.log("onChange event: "+event+" items:"+items);
    };

    $scope.onDragStart = function(event, ui) {
        console.log("onDragStart event: "+event+" ui:"+ui);
    };

    $scope.onDragStop = function(event, ui) {
        console.log("onDragStop event: "+event+" ui:"+ui);
    };

    $scope.onResizeStart = function(event, ui) {
        console.log("onResizeStart event: "+event+" ui:"+ui);
    };

    $scope.onResizeStop = function(event, ui) {
        console.log("onResizeStop event: "+event+" ui:"+ui);
    };

    $scope.onItemAdded = function(item) {
        console.log("onItemAdded item: "+item);
    };

    $scope.onItemRemoved = function(item) {
        console.log("onItemRemoved item: "+item);
    };

}]);
