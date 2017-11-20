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
            PageService.getPagesTemplates(function(data){
                $scope.templatePages = data;
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

app.controller('GridstackController', ['$scope', function($scope) {

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

mbcApp.controller('DemoCtrl', ['$scope','$uibModal', 'PageService', function($scope, $uibModal, PageService) {

    $scope.videoUrl = "http://www.youtube.com/watch?v=vabnZ9-ex7o";
    $scope.width = '100%';

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

    var mbcShowFiles = function() {
        PageService.mbcGetFiles(function(data){
            $scope.mbcFiles = data;
        });
    }
    mbcShowFiles();

    $scope.savePage = function() {
        var nid = $scope.nid;
        var package = {
            '_links': { 'type': { 'href': baseUrl + '/rest/type/node/mbc_page' }},
            'type' : {"target_id": "mbc_page"},
        }
        var values = {
            'field_gridstack_data' : {
                "value": angular.toJson($scope.widgets)
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
        var newWidget = {
            x:0,
            y:0,
            width:3,
            height:1,
            mbcWidgetId:widid,
            mbcComponentId: $scope.getNewId(),
            settings: {
                font: '',
                text: '',
                link: '',
                border: '',
                backgroundColor: '',
                backgroundUrl: '',
            }
        };
        switch(widid) {
            case 'calendar':
                newWidget.width = 5;
                newWidget.height = 2;
                newWidget.settings.calDate = '';
                break;
            case 'button':
                newWidget.width = 1;
                newWidget.height = 1;
                newWidget.settings.buttonValue = '';
                break;
            case 'form':
                newWidget.width = 6;
                newWidget.height = 2;
                newWidget.settings.email = '';
                newWidget.settings.password = '';
                newWidget.settings.rememberMe = '';
                newWidget.settings.buttonValue = '';
                break;
            case 'countdown':
                newWidget.width = 5;
                newWidget.height = 1;
                newWidget.settings.date = '';
                break;
            case 'video':
                newWidget.settings.link = '';
                break;
            case 'image':
                newWidget.settings.imageUrl = '';
                break;
            case 'price':
                newWidget.settings.title = '';
                newWidget.settings.description = '';
                newWidget.settings.price = '';
                newWidget.settings.button = '';
                break;
            case 'card':
                newWidget.settings.cardImage = '';
                newWidget.settings.cardTitle = '';
                newWidget.settings.cardDescription = '';
                break;
            case 'title':
                newWidget.settings.titleText = '';
                break;
            case 'subtitle':
                newWidget.settings.subtitleText = '';
                break;
            case 'menubar':
                newWidget.settings.tabs = [];
                break;
                // newWidget.settings.card2 = {
                //     title: '',
                //     description: '',
                //     price: '',
                //     button: '',
                // };
                // newWidget.settings.card3 = {
                //     title: '',
                //     description: '',
                //     price: '',
                //     button: '',
                // };
        }
        $scope.widgets.push(newWidget);
        console.log($scope.widgets);
        console.log($scope.getComponentProperties($scope.widgets.length));
    };

    $scope.getNewId = function() {
        var currentMaxId = 0;
        angular.forEach(this.widgets, function (widget, key) {
          currentMaxId = (widget.mbcComponentId > currentMaxId) ? widget.mbcComponentId : currentMaxId;
        });
        return ++currentMaxId;
    }

    $scope.setImageUrl = function($event, f) {
        $event.preventDefault();
        var imgUrlType = this.$parent.urlType;
        $scope.$emit('changeComponentUrlImage', {
            imgUrlType: imgUrlType,
            file: f,
        });

        console.log(f);
    }

    $scope.getComponentProperties = function(id) {
        var found = $scope.widgets.filter(function (obj) {
            return obj.mbcComponentId === id;
        })[0];
        return found.settings;
    }

    $scope.moveWidget = function() {
        $scope.widgets[0].x = 1;
        $scope.widgets[0].width = 3;
        $scope.widgets[0].height = 1;
    };

    $scope.removeWidget = function(w) {
        var index = $scope.widgets.indexOf(w);
        $scope.widgets.splice(index, 1);
    };

    $scope.editWidget = function (id) {
      $scope.currentEditWidget = id;
      console.log('id : '+id);
      // get settings
      $scope.settings = $scope.getComponentProperties(id);
      // seve old settings
      $scope.old_settings = angular.copy($scope.settings);

      $scope.modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'modules/custom/mbc_app/js/dir-templates/mbcDialog.html',
        size: 'sm',
        controller: 'ModalController',
        controllerAs: '$ctrl',
        backdrop: false,
        scope: $scope,

      });
      $scope.modalInstance.result.then(function (res) {
        $scope.settings = res;
        angular.forEach($scope.widgets, function (widget,key ) {
          if (widget.mbcComponentId == id)
          {
            $scope.widgets[key].settings = $scope.settings;
          }
        });
      }, function (res) {
        $scope.settings = res;
      });
        $scope.$on('changeComponentUrlImage', function (event, data) {
            angular.forEach($scope.widgets, function (widget,key ) {
                if (widget.mbcComponentId == $scope.currentEditWidget)
                {
                    $scope.widgets[key].settings[data.imgUrlType] = data.file.uri;
                }
            });
        });
        $scope.settings.mbcTabTitle = {
            title: '',
            tid: null,
        };
        $scope.mbcAddTab = function() {
            var tid = $scope.settings.mbcTabTitle.tid;
            if (tid === null) {
                $scope.settings.tabs.push($scope.settings.mbcTabTitle.title);
            }
            else {
                $scope.settings.tabs[tid] = $scope.settings.mbcTabTitle.title;
            }
            $scope.settings.mbcTabTitle.title = '';
            $scope.settings.mbcTabTitle.tid = null;
        }
        $scope.mbcDeleteTab = function() {
            $scope.settings.tabs.splice(this.$index, 1);
        }
        $scope.mbcEditTab = function($event) {
            $event.preventDefault();
            $scope.settings.mbcTabTitle.title = $scope.settings.tabs[this.$index];
            $scope.settings.mbcTabTitle.tid = this.$index;
        }
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

mbcApp.controller('ModalController', function ($scope)
{
  var $ctrl = this;
  $ctrl.settings = $scope.settings;
  $ctrl.ok = function () {
    $scope.modalInstance.close($ctrl.settings);
  };

  $ctrl.cancel = function () {
    $scope.settings = $scope.old_settings;
    $scope.modalInstance.close($scope.settings);
  };

});
