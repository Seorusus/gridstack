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

    app.directive('gridstackItem', ['$timeout', '$datepicker', '$parse', function($timeout, $datepicker, $parse) {

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
                var ngModel = $parse(attrs.ngModel);
                $(function(){
                    var mbcWidget = angular.element(element[0].querySelector('.mbc-widget'));
                    var mbcWidgetContent = '';
                    switch (scope.mbcWidgetId) {
                        case 'button':
                            mbcWidgetContent = '<button type="button" class="btn btn-default" ng-model="button.toggle" bs-checkbox>Button</button>';
                            break;
                        case 'calendar':
                            //var mbc_control = angular.element('<input type="text" class="form-control" ng-model="selectedDate" name="date" bs-datepicker>');
                            scope.mbcWidgetContent = '<input type="text" class="form-control" ng-model="selectedDate" name="date" bs-datepicker>';
                            //mbcWidget.append(mbc_control);
                            // var calElement = $(mbc_control).datepicker({
                            //     inline: true,
                            //     dateFormat: 'dd.mm.yy',
                            //     onSelect: function(dateText) {
                            //         var modelPath = $(this).attr('ng-model');
                            //         putObject(modelPath, scope, dateText);
                            //         scope.$apply();
                            //     }
                            // });
                            //mbcWidgetContent = calElement;
                            break;
                        default:
                            mbcWidgetContent = 'in proccess';
                            break;
                    }

                    $(mbcWidget).html(mbcWidgetContent);
                });

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
})(jQuery);