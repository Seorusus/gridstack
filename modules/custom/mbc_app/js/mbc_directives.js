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

    mbcApp.directive('mbcWidget', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs, controller) {
                attrs.$observe('mbcWidget', function(directive) {
                    element.html('');
                    element.append($compile(angular.element('<mbc-widget-' + directive + '/>'))($scope));
                });
            }
        };

    }]);
    mbcApp.directive('mbcWidgetButton', function(){
       return {
           restrict: 'E',
           controller: 'DemoCtrl',
           replace: true,
           templateUrl: '/modules/custom/mbc_app/components/button/index.html',
           link: function (scope, element, attrs, controller) {
               scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                   if (scope.w.settings.font.value) {
                       $(element).css('font-family', scope.w.settings.font.value);
                   }
                   else {
                       $(element).css('font-family', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                   if (scope.w.settings.backgroundColor.value) {
                       $(element).css('background-color', scope.w.settings.backgroundColor.value);
                   }
                   else {
                       $(element).css('background-color', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                   if (scope.w.settings.backgroundUrl.value) {
                       $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                   }
                   else {
                       $(element).css('background-image', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                   if (scope.w.settings.borderPlace.value.top) {
                       $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                   }
                   else {
                       $(element).css('border-top', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                   if (scope.w.settings.borderPlace.value.right) {
                       $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                   }
                   else {
                       $(element).css('border-right', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                   if (scope.w.settings.borderPlace.value.bottom) {
                       $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                   }
                   else {
                       $(element).css('border-bottom', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                   if (scope.w.settings.borderPlace.value.left) {
                       $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                   }
                   else {
                       $(element).css('border-left', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                   if (scope.w.settings.borderSize.value) {
                       $(element).css('border-width', scope.w.settings.borderSize.value);
                   }
                   else {
                       $(element).css('border-width', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                   if (scope.w.settings.borderStyle.value) {
                       $(element).css('border-style', scope.w.settings.borderStyle.value);
                   }
                   else {
                       $(element).css('border-style', '');
                   }
               });
               scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                   if (scope.w.settings.borderColor.value) {
                       $(element).css('border-color', scope.w.settings.borderColor.value);
                   }
                   else {
                       $(element).css('border-color', '');
                   }
               });
           },
       }
    });
    mbcApp.directive('mbcWidgetCalendar', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/calendar/index.html',
            link: function (scope, element, attrs, controller) {
                var el = angular.element(element[0].querySelector('.mbc-widget'));
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(el).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(el).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(el).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(el).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(el).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(el).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(el).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(el).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(el).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(el).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(el).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(el).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(el).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(el).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(el).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(el).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(el).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(el).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(el).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(el).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(el).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(el).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetCard', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/card/index.html',
            link: function (scope, element, attrs, controller) {
                //var el = angular.element(element[0].querySelector('.mbc-widget'));
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetCountdown', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/countdown/index.html',
            link: function (scope, element, attrs, controller) {
                    scope.countdown = function() {
                    var countdownDate = scope.w.settings.CountdownDate;
                    var cdDelay = countdownDate.value.days*24*60*60 + countdownDate.value.hours*60*60 + countdownDate.value.mins*60;
                    element.timeTo({
                        seconds: cdDelay,
                        displayCaptions: true,
                        fontSize: 56,
                    });

                };
                scope.$watch(function () { return scope.w.settings.CountdownDate.value.days; }, function(){
                    scope.countdown();
                });
                scope.$watch(function () { return scope.w.settings.CountdownDate.value.hours; }, function(){
                    scope.countdown();
                });
                scope.$watch(function () { return scope.w.settings.CountdownDate.value.mins; }, function(){
                    scope.countdown();
                });
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetForm', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/form/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetImage', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/image/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetMenubar', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/menubar/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetPrice', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/price/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetSubtitle', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/subtitle/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetTitle', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/title/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });
    mbcApp.directive('mbcWidgetVideo', function(){
        return {
            restrict: 'E',
            controller: 'DemoCtrl',
            replace: true,
            templateUrl: '/modules/custom/mbc_app/components/video/index.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () { return scope.w.settings.color.value; }, function(){
                    if (scope.w.settings.color.value) {
                        $(element).css('color', scope.w.settings.color.value);
                    }
                    else {
                        $(element).css('color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.font.value; }, function(){
                    if (scope.w.settings.font.value) {
                        $(element).css('font-family', scope.w.settings.font.value);
                    }
                    else {
                        $(element).css('font-family', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundColor.value; }, function(){
                    if (scope.w.settings.backgroundColor.value) {
                        $(element).css('background-color', scope.w.settings.backgroundColor.value);
                    }
                    else {
                        $(element).css('background-color', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.backgroundUrl.value; }, function(){
                    if (scope.w.settings.backgroundUrl.value) {
                        $(element).css('background-image', 'url(' + scope.w.settings.backgroundUrl.value + ')');
                    }
                    else {
                        $(element).css('background-image', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.top; }, function(){
                    if (scope.w.settings.borderPlace.value.top) {
                        $(element).css('border-top', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-top', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.right; }, function(){
                    if (scope.w.settings.borderPlace.value.right) {
                        $(element).css('border-right', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-right', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.bottom; }, function(){
                    if (scope.w.settings.borderPlace.value.bottom) {
                        $(element).css('border-bottom', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-bottom', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderPlace.value.left; }, function(){
                    if (scope.w.settings.borderPlace.value.left) {
                        $(element).css('border-left', scope.w.settings.borderSize.value + ' ' + scope.w.settings.borderColor.value + ' ' + scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-left', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderSize.value; }, function(){
                    if (scope.w.settings.borderSize.value) {
                        $(element).css('border-width', scope.w.settings.borderSize.value);
                    }
                    else {
                        $(element).css('border-width', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderStyle.value; }, function(){
                    if (scope.w.settings.borderStyle.value) {
                        $(element).css('border-style', scope.w.settings.borderStyle.value);
                    }
                    else {
                        $(element).css('border-style', '');
                    }
                });
                scope.$watch(function () { return scope.w.settings.borderColor.value; }, function(){
                    if (scope.w.settings.borderColor.value) {
                        $(element).css('border-color', scope.w.settings.borderColor.value);
                    }
                    else {
                        $(element).css('border-color', '');
                    }
                });
            },
        }
    });

    mbcApp.directive('fileSelection', function() {
        return {
           restrict: 'E',
           controller: 'DemoCtrl',
           templateUrl: '/modules/custom/mbc_app/js/dir-templates/fileSelection.html',
           replace: true,
           scope: {
                urlType: '@',
            },
           link: function ($scope, element, attrs) {
               // console.log(attrs);
               // var uType = attrs.urlType;
               // $(element).find('a').attr('uritype', uType);
           }
        }
    });
    mbcApp.directive('minicolor', function() {
        return {
            restrict: 'A',
            controller: 'DemoCtrl',
            link: function ($scope, element, attrs) {
                $(element).minicolors();
            }
        }
    });
    mbcApp.directive('borderplace', function() {
        return {
            restrict: 'E',
            controller: 'ModalController',
            templateUrl: '/modules/custom/mbc_app/js/dir-templates/templates/borderplace.html',
            replace: true,
            link: function ($scope, element, attrs) {
                 console.log($scope);
                // $scope.$watch(function () { return $scope.$parent.field.value.top; }, function(){
                //     if ($scope.$parent.field.value.top) {
                //         $('#button1').css('border-left', '2px solid red');
                //     }
                // });
            }
        }
    });
})(jQuery);