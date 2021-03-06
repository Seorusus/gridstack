/**
 * Created by bob on 21.09.17.
 */

app.controller('GridstackController', ['$scope', function($scope) {

    $scope.button = {
        'toggle' : true,
    }

    this.gridstack = null;

    this.init = function(element, options) {
        options.acceptWidgets = '.grid-stack-item';
        options.float = true;
        options.verticalMargin = 0;
        options.alwaysShowResizeHandle = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        options.cellHeight = 20;
        options.width = 24;
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

mbcApp.controller('mbcMain', ['$scope', '$http', '$uibModal', 'PageService', '$location', '$timeout', function($scope, $http, $uibModal, PageService, $location, $timeout) {
    if (typeof drupalSettings !== 'undefined') {
        var csrf = drupalSettings.csrf;
        var baseUrl = drupalSettings.baseUrl;
    }

    $scope.mbcInit = function() {
        PageService.getPages(function(data){
            $scope.pages = data;
            if ($scope.pages.length > 0){
                var firstPage = $scope.pages[0];
                $scope.loadPage(firstPage.nid);
            }
            else {
                $scope.newPage();
            }
        });
        PageService.getPagesTemplates(function(data){
            $scope.templatePages = data;
        });

    }

   // $timeout($scope.init);

    $scope.newPage = function(){
        $scope.loadPage('new');
        $scope.newTitleModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: '/' + drupalSettings.modulePath + '/js/dir-templates/mbcPageSettings.html',
            size: 'lg',
            controller: 'ModalPageSettingsController',
            controllerAs: '$ctrl',
            backdrop: false,
            scope: $scope,

        });

        $scope.newTitleModalInstance.result.then(function(res){
            if(res){
                $scope.pages = res;
            }
        });

    }

    $scope.loadPage = function(nid) {
        if (nid === 'new') {
            if ($scope.getPage(nid) === 0) {
                var newPage = {
                    'title' : 'Untitled',
                    'nid' : 'new',
                    'field_weight_value' : 0,
                    'field_background_color' : '',
                    'field_background_image' : '',
                }
                $scope.pages.push(newPage);
                $scope.nid = 'new';
                $scope.getPage(nid);
                $scope.widgets = [];
                $scope.currentBgColor = $scope.pages[$scope.page.id].field_background_color;
                $scope.currentBgImage = $scope.pages[$scope.page.id].field_background_image;
            }
            else {
                $scope.getPage(nid);
                $scope.currentBgColor = $scope.pages[$scope.page.id].field_background_color;
                $scope.currentBgImage = $scope.pages[$scope.page.id].field_background_image;
            }
        }
        else {
            $scope.getPage(nid);
            PageService.loadPage(nid, function(data){
                var pageGs = {};
                if (data === '[]') {
                    pageGs = {
                        "nid": nid,
                        "grid": JSON.parse(data),
                        "type": 'mbc_page',
                    }
                }
                else {
                    pageGs = {
                        "nid": nid,
                        "grid": (typeof data.field_gridstack_data !== 'undefined') ? JSON.parse(data.field_gridstack_data[0].value) : '[]',
                        "type": data.type[0].target_id,
                    }
                }
                if (pageGs) {
                    $scope.widgets = pageGs.grid;
                    if (pageGs.type === 'mbc_page') {
                        $scope.nid = pageGs.nid;
                    }
                }
                $scope.currentBgColor = $scope.pages[$scope.page.id].field_background_color;
                $scope.currentBgImage = $scope.pages[$scope.page.id].field_background_image;
            });
        }

    }

    $scope.loadTemplatePage = function (nid) {
        PageService.loadPage(nid, function(data){
            if (typeof data.field_gridstack_data !== 'undefined'){
                 $scope.widgets = JSON.parse(data.field_gridstack_data[0].value);
            }
            if (typeof data.field_background_color !== 'undefined') {
                $scope.currentBgColor = data.field_background_color[0].value;
                $scope.pages[$scope.page.id].field_background_color = $scope.currentBgColor;
            }
            if(typeof data.field_background_image !== 'undefined'){
                $scope.currentBgImage = data.field_background_image[0].value;
                $scope.pages[$scope.page.id].field_background_image = $scope.currentBgImage;
            }
        });
    }

    $scope.updatePage = function (nid, values) {
        if (typeof csrf === 'undefined') {
            return;
        }
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
        if (typeof csrf === 'undefined') {
            return;
        }
        if (id !== 'new') {
            PageService.deletePage(id, csrf)
                .then(function(response){
                    var resData = response.data;
                    PageService.getPages(function(resData){
                        $scope.pages = resData;
                    });
                });
        }else {
            $scope.getPage(id);
            $scope.pages.splice($scope.page.id, 1);
        }
        $scope.widgets = [];
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
    $scope.width = '100%';
    if (typeof drupalSettings !== 'undefined') {
        var csrf = drupalSettings.csrf;
        var baseUrl = drupalSettings.baseUrl;
    }

    $scope.options = {
        cellHeight: 20,
        verticalMargin: 0
    };

    var mbcShowFiles = function() {
        PageService.mbcGetFiles(function(data){
            $scope.mbcFiles = data;
        });
    }
    mbcShowFiles();

    $scope.getPage = function(nid) {
        var curpage = [];
        angular.forEach($scope.pages, function(value, key){
            if (value.nid == nid) {
                curpage = {
                    'value' : value,
                    'id' : key,
                }
            }
        });
        $scope.page = curpage;
        return curpage.length;
    }

    $scope.editPage = function(nid) {
        $scope.getPage(nid);
        $scope.pagesOld = angular.copy($scope.pages);
        $scope.newTitleModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: '/' + drupalSettings.modulePath + '/js/dir-templates/mbcPageSettings.html',
            size: 'lg',
            controller: 'ModalPageSettingsController',
            controllerAs: '$pctrl',
            backdrop: false,
            scope: $scope,

        });
        $scope.newTitleModalInstance.result.then(function(res){
            $scope.pages = res;
        });
    }
    $scope.savePage = function() {
        if (typeof csrf === 'undefined') {
            return;
        }
        var nid = $scope.nid;
        $scope.getPage(nid);
        var package = {
            '_links': { 'type': { 'href': baseUrl + '/rest/type/node/mbc_page' }},
            'type' : {"target_id": "mbc_page"},
        }
        angular.forEach($scope.widgets, function (value, key) {
            if (value.autopos === 1) {
                $scope.widgets[key].autopos = 0;
            }
        });
        var values = {
            'title': {
                "value": $scope.pages[$scope.page.id].title
            },
            'field_gridstack_data' : {
                "value": angular.toJson($scope.widgets)
            },
            'field_background_color': {
                "value": $scope.pages[$scope.page.id].field_background_color
            },
            'field_background_image': {
                "value": $scope.pages[$scope.page.id].field_background_image
            }
        }
        angular.forEach(values, function(value, key){
            package[key] = value;
        });
        if (nid === 'new') {
            // Call the PageService object with the addPage method
            PageService.addPage(package, csrf, baseUrl)
                .then(function(response){
                    console.log("Added");
                    var pageSavedModal = $uibModal.open({
                        animation: true,
                        template: 'New page saved!',
                        windowClass: 'pageSavedMsg',
                        size: 'sm',
                        controller: 'ModalController',
                        controllerAs: '$ctrl',
                        scope: $scope,
                    });
                    $timeout(function(){
                        pageSavedModal.close();
                    }, 2000);
                    var resNid = response.data.nid[0].value;
                    $scope.nid = resNid;
                    // // Re-call the list of pages so that it updates
                    PageService.getPages(function(resData){
                        $scope.pages = resData;
                        $scope.getPage(resNid);
                    });
                })
        }
        else {
            PageService.updatePage(package, csrf, baseUrl, nid)
                .then(function() {
                    console.log("Added");
                    var pageSavedModal = $uibModal.open({
                        animation: true,
                        template: 'Page saved!',
                        windowClass: 'pageSavedMsg',
                        size: 'sm',
                        controller: 'ModalController',
                        controllerAs: '$ctrl',
                        scope: $scope,
                    });
                    $timeout(function(){
                        pageSavedModal.close();
                    }, 2000);
                });
        }
    }

    $scope.addWidget = function(widid) {
        if (arguments[1] !== undefined) {
           var coords = arguments[1];
        }
        var newWidget = {
            x:(coords !== undefined)? coords.gsx : 0,
            y:(coords !== undefined)? coords.gsy : 0,
            width:3,
            mwidth:3,
            height:1,
            mheight: 1,
            mbcWidgetId:widid,
            mbcComponentId: $scope.getNewId(),
            autopos: (coords !== undefined)? 0 : 1,
            settings: {
                font: {
                   value: '',
                   options: ['Times New Roman', 'Arial', 'Tahoma'],
                   title: 'Font',
                   type: 'select',
                },
                fontStyle: {
                    value: {
                        bold: false,
                        italic: false,
                        underline: false,
                        linethrough: false,
                    },
                    title: 'Text styling',
                    type: 'fontstyle',
                },
                fontSize: {
                    value: '15px',
                    title: 'Font size',
                    type: 'text',
                },
                color: {
                    value: '',
                    title: 'Color',
                    type: 'colorpicker',
                },
                text: {
                    value: '',
                    title: 'Text',
                    type: 'text',
                },
                link: {
                    value: '',
                    title: 'Link',
                    type: 'text',
                },
                borderSize: {
                    value: '1px',
                    options: ['1px', '2px', '3px'],
                    title: 'Border size',
                    type: 'select',
                },
                borderStyle: {
                    value: 'solid',
                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double'],
                    title: 'Border style',
                    type: 'select',
                },
                borderColor: {
                    value: '',
                    title: 'Border color',
                    type: 'colorpicker',
                },
                borderPlace: {
                    value: {
                       top: true,
                       right: true,
                       bottom: true,
                       left: true,
                    },
                    title: 'Border placement',
                    type: 'borderplace',
                },
                backgroundColor: {
                    value: '',
                    title: 'Background color',
                    type: 'colorpicker',
                },
                backgroundUrl: {
                    value: '',
                    title: 'Background url',
                    type: 'files',
                },
            }
        };
        switch(widid) {
            case 'calendar':
                newWidget.width = 16;
                newWidget.mwidth = 16;
                newWidget.height = 19;
                newWidget.mheight = 19;
                newWidget.settings.calDate = {
                    value: new Date(),
                    title: 'Date',
                    type: 'date',
                };
                break;
            case 'button':
                newWidget.width = 2;
                newWidget.mwidth = 1;
                newWidget.height = 2;
                newWidget.mheight = 2;
                newWidget.settings.buttonValue = {
                    value: 'Button',
                    state: '',
                    title: 'Button',
                    type: 'text',
                };
                break;
            case 'form':
                newWidget.width = 10;
                newWidget.mwidth = 10;
                newWidget.height = 11;
                newWidget.mheight = 11;
                newWidget.settings.formMail = {
                    value: '',
                    title: 'Email',
                    type: 'text',
                };
                newWidget.settings.formPassword = {
                    value: '',
                    title: 'Password',
                    type: 'text',
                };
                newWidget.settings.formRememberMe = {
                    value: '',
                    title: 'Remember me',
                    type: 'checkbox',
                };
                newWidget.settings.formButton = {
                    value: 'Button',
                    state: '',
                    title: 'Button',
                    type: 'text',
                };
                break;
            case 'countdown':
                newWidget.width = 13;
                newWidget.mwidth = 13;
                newWidget.height = 8;
                newWidget.mheight = 8;
                newWidget.settings.CountdownDate = {
                    value: {
                      days: 1,
                      hours: 1,
                      mins: 0,
                    },
                    title: 'Date',
                    type: 'cdinput',
                };
                break;
            case 'video':
                newWidget.width = 6;
                newWidget.mwidth = 6;
                newWidget.height = 8;
                newWidget.mheight = 8;
                break;
            case 'image':
                newWidget.width = 3;
                newWidget.mwidth = 3;
                newWidget.height = 3;
                newWidget.mheight = 3;
                newWidget.settings.imageUrl = {
                    value: '',
                    title: 'Image Url',
                    type: 'files',
                };
                break;
            case 'price':
                newWidget.width = 5;
                newWidget.mwidth = 5;
                newWidget.height = 4;
                newWidget.mheight = 4;
                newWidget.settings.priceTitle = {
                    value: '',
                    title: 'Title',
                    type: 'text',
                };
                newWidget.settings.priceDescription = {
                    value: '',
                    title: 'Description',
                    type: 'text',
                };
                newWidget.settings.pricePrice = {
                    value: '',
                    title: 'Price',
                    type: 'text',
                };
                newWidget.settings.priceButton = {
                    value: '',
                    title: 'Button',
                    type: 'text',
                };
                break;
            case 'card':
                newWidget.width = 5;
                newWidget.mwidth = 5;
                newWidget.height = 5;
                newWidget.mheight = 5;
                newWidget.settings.cardImage = {
                    value: '',
                    title: 'Image',
                    type: 'files',
                };
                newWidget.settings.cardTitle = {
                    value: '',
                    title: 'Title',
                    type: 'text',
                };
                newWidget.settings.cardDescription = {
                    value: '',
                    title: 'Description',
                    type: 'text',
                };
                break;
            case 'title':
                newWidget.width = 6;
                newWidget.mwidth = 6;
                newWidget.height = 2;
                newWidget.mheight = 2;
                newWidget.settings.titleText = {
                    value: '',
                    title: 'Text',
                    type: 'text',
                };
                newWidget.settings.fontSize.value = '25px';
                delete newWidget.settings.text;
                break;
            case 'text':
                newWidget.width = 6;
                newWidget.mwidth = 6;
                newWidget.height = 2;
                newWidget.mheight = 2;
                newWidget.settings.textText = {
                    value: '',
                    title: 'Text',
                    type: 'textarea',
                };
                delete newWidget.settings.text;
                break;
            case 'subtitle':
                newWidget.width = 6;
                newWidget.hwidth = 6;
                newWidget.height = 2;
                newWidget.mheight = 2;
                newWidget.settings.subtitleText = {
                    value: '',
                    title: 'Text',
                    type: 'text',
                };
                newWidget.settings.fontSize.value = '20px';
                delete newWidget.settings.text;
                break;
            case 'menubar':
                newWidget.width = 6;
                newWidget.mwidth = 6;
                newWidget.height = 4;
                newWidget.mheight = 4;
                newWidget.settings.tabs = {
                    value: [],
                    type: 'tabs',
                };
                break;

        }
        if (typeof $scope.widgets === 'undefined') {
            $scope.widgets = new Array();
        }
        $scope.widgets.push(newWidget);
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
        if (imgUrlType === 'pageBgUrl') {
            $scope.$emit('changePageUrlImage', {
                imgUrlType: imgUrlType,
                file: f,
            });
        }
        else {
            $scope.$emit('changeComponentUrlImage', {
                imgUrlType: imgUrlType,
                file: f,
            });
        }
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
      // get settings
      $scope.settings = $scope.getComponentProperties(id);
      // seve old settings
      $scope.old_settings = angular.copy($scope.settings);
      $scope.modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: '/' + drupalSettings.modulePath + '/js/dir-templates/mbcDialog.html',
        size: 'lg',
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
                    $scope.widgets[key].settings[data.imgUrlType].value = data.file.uri;
                }
            });
        });
        // $scope.settings.mbcTabTitle = {
        //     title: '',
        //     tid: null,
        // };
        $scope.settings.menutitle = '';
        $scope.settings.menulink = '';
        $scope.settings.menuvisible = false;
        $scope.mbcAddTab = function() {
            $scope.settings.tabs.value.push({
                title: $scope.settings.menutitle,
                link: $scope.settings.menulink,
            });
            $scope.settings.menutitle = '';
            $scope.settings.menulink = '';
            $scope.settings.menuvisible = false;
        }
        $scope.mbcDeleteTab = function() {
            $scope.settings.tabs.value.splice(this.$index, 1);
        }
        $scope.mbcEditTab = function($event) {
            $event.preventDefault();
            $scope.settings.mbcTabTitle.title = $scope.settings.tabs.value[this.$index];
            $scope.settings.mbcTabTitle.tid = this.$index;
        }
        $scope.calPopup = {
            opened: false
        };
        $scope.openCalPopup = function() {
            $scope.calPopup.opened = true;
        };
    };

    $scope.onChange = function(event, items) {
       // console.log("onChange event: "+event+" items:"+items);
    };

    $scope.onDragStart = function(event, ui) {
       // console.log("onDragStart event: "+event+" ui:"+ui);
    };

    $scope.onDragStop = function(event, ui) {
       // console.log("onDragStop event: "+event+" ui:"+ui);
    };

    $scope.onResizeStart = function(event, ui) {
       // console.log("onResizeStart event: "+event+" ui:"+ui);
    };

    $scope.onResizeStop = function(event, ui) {
       // console.log("onResizeStop event: "+event+" ui:"+ui);
    };

    $scope.onItemAdded = function(item) {
      //  console.log("onItemAdded item: "+item);
    };

    $scope.onItemRemoved = function(item) {
      //  console.log("onItemRemoved item: "+item);
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

mbcApp.controller('ModalPageSettingsController', function ($scope) {
    var $pctrl = this;
    $pctrl.page = $scope.page;
    $pctrl.pages = $scope.pages;
    $scope.$on('changePageUrlImage', function (event, data) {
        $pctrl.pages[$pctrl.page.id].field_background_image = data.file.uri;
    });
    $pctrl.ok = function() {
        $scope.newTitleModalInstance.close($pctrl.pages);
    };
    $pctrl.cancel = function() {
        $pctrl.pages = $scope.pagesOld;
        $scope.newTitleModalInstance.close($pctrl.pages);
    }
});

mbcApp.controller('SimpleController', function($scope){

});
