(function($) {
    'use strict';

    app.directive('gridstack', ['$timeout', function($timeout) {

        return {
            restrict: 'A',
            controller: 'GridstackController',
            scope: {
                onChange: '&',
                onDragStart: '&',
                onDragStop: '&',
                onResizeStart: '&',
                onResizeStop: '&',
                gridstackHandler: '=?',
                options: '='
            },
            link: function(scope, element, attrs, controller, ngModel) {

                var gridstack = controller.init(element, scope.options);
                scope.gridstackHandler = gridstack;

                element.on('change', function(e, items) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onChange({event: e, items: items});
                    });
                });

                element.on('dragstart', function(e, ui) {
                    scope.onDragStart({event: e, ui: ui});
                });

                element.on('dragstop', function(e, ui) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onDragStop({event: e, ui: ui});
                    });
                });

                element.on('resizestart', function(e, ui) {
                    scope.onResizeStart({event: e, ui: ui});
                });

                element.on('resizestop', function(e, ui) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onResizeStop({event: e, ui: ui});
                    });
                });

            }
        };

    }]);

    app.directive('gridstackItem', ['$timeout', '$parse', function ($timeout, $parse) {

        return {
            restrict: 'A',
            controller: 'GridstackController',
            require: '^gridstack',
            scope: {
                gridstackItem: '=',
                onItemAdded: '&',
                onItemRemoved: '&',
                gsItemId: '=?',
                gsItemX: '=',
                gsItemY: '=',
                gsItemWidth: '=',
                gsItemHeight: '=',
                gsItemAutopos: '=',
                gsItemMinHeight: '=?',
                gsItemMaxHeight: '=?',
                gsItemMinWidth: '=?',
                gsItemMaxWidth: '=?',
                mbcWidgetId: '=',
            },
            link: function(scope, element, attrs, controller) {
                if (scope.gsItemId) {
                    $(element).attr('data-gs-id', scope.gsItemId);
                }
                $(element).attr('data-gs-x', scope.gsItemX);
                $(element).attr('data-gs-y', scope.gsItemY);
                $(element).attr('data-gs-width', scope.gsItemWidth);
                $(element).attr('data-gs-height', scope.gsItemHeight);
                $(element).attr('data-gs-min-width', scope.gsItemMinWidth);
                $(element).attr('data-gs-min-height', scope.gsItemMinHeight);
                $(element).attr('data-gs-max-width', scope.gsItemMaxWidth);
                $(element).attr('data-gs-max-height', scope.gsItemMaxHeight);
                $(element).attr('data-gs-auto-position', scope.gsItemAutopos);
                $(element).attr('mbc-widget-id', scope.mbcWidgetId);
                var mbcWidget = angular.element(element[0].querySelector('.mbc-widget'));
                $(mbcWidget).attr('mbc-widget-id', scope.mbcWidgetId);

                var widget = controller.addItem(element);
                var item = element.data('_gridstack_node');
                $timeout(function() {
                    scope.onItemAdded({item: item});
                });

                var propertyChanged = function(newVal, oldVal) {
                    if(newVal != oldVal) {
                        controller.gridstack.update($(element), scope.gsItemX, scope.gsItemY, scope.gsItemWidth, scope.gsItemHeight);
                    }
                };

                scope.$watch(function() { return $(element).attr('data-gs-id'); }, function(val) {
                    scope.gsItemId = val;
                });

                scope.$watch(function() { return $(element).attr('data-gs-x'); }, function(val) {
                    scope.gsItemX = Number(val);
                });

                scope.$watch(function() { return $(element).attr('data-gs-y'); }, function(val) {
                    scope.gsItemY = Number(val);
                });

                scope.$watch(function() { return $(element).attr('data-gs-width'); }, function(val) {
                    scope.gsItemWidth = Number(val);
                });

                scope.$watch(function() { return $(element).attr('data-gs-height'); }, function(val) {
                    scope.gsItemHeight = Number(val);
                });

                scope.$watch('gsItemX', propertyChanged);
                scope.$watch('gsItemY', propertyChanged);
                scope.$watch('gsItemWidth', propertyChanged);
                scope.$watch('gsItemHeight', propertyChanged);

                element.bind('$destroy', function() {
                    var item = element.data('_gridstack_node');
                    scope.onItemRemoved({item: item});
                    controller.removeItem(element);
                });

            }

        };

    }]);

    app.directive('mbcCountdown', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                element.timeTo({
                 timeTo: new Date('Dec 10 2017 00:00:00'),
                 displayCaptions: true,
                 fontSize: 56,
                });
            }

        };

    }]);

    app.directive('mbcWidget', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            template: '<div ng-include="getTemplate()" class="mbc-widget-wrapper"></div>',
            scope: {
                mbcWidgetId: "=",
            },
            link: function (scope, element, attrs, controller) {
                    var mbcWidgetId = scope.mbcWidgetId;
                    var baseURL = '/modules/custom/mbc_app/components/';

                    scope.getTemplate = function(){
                        return baseURL + mbcWidgetId + "/index.html";
                    };
                }

        };

    }]);
    mbcApp.directive('fileSelection', function() {
        return {
           restrict: 'E',
            controller: 'DemoCtrl',
           templateUrl: '/modules/custom/mbc_app/js/dir-templates/fileSelection.html',
           replace: true,
           link: function ($scope, element, attrs) {
               console.log($scope.mbcFiles);
           }
        }
    });
})(jQuery);