/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('ui.select2.sortable', []).directive('uiSelect2Sortable', ['$timeout', function ($timeout) {
    return {
        require: 'ngModel',
        restrict: 'A',
        transclude: true,
        scope: {
            ngModel: '=',
            allowClear: '=?',
            simpleQuery: '=?',
            query: '=?',
            toId: '=?',
            toText: '=?',
            minimumInputLength: '=?',
            onSelect: '=?'
        },
        link: function (scope, element, attrs, ngModel) {
            //create a function to find an id into object
            if (!scope.toId) {
                scope.toId = function (item) {
                    if (item._id) return item._id;
                    if (item.id) return item.id;
                    if (item.uri) return item.uri;
                    if (item.href) return item.href;
                    if (item.href) return item.resource;
                    return item;
                };
            }

            //create a function to find display value into object
            if (!scope.toText) {
                scope.toText = function (item) {
                    if (item.text) return item.text;
                    if (item.name) return item.name;
                    if (item.label) return item.label;
                    return item;
                };
            }

            //prepare options for the select2 element
            scope.opts = {
                multiple: attrs.multiple || false,
                sortable: attrs.multiple || false,
                minimumInputLength: scope.minimumInputLength || 0,
                query: scope.query,
                allowClear: scope.allowClear || false
            };

            // Convert from Select2 view-model to Angular view-model.
            scope.convertToAngularModel = function (select2_data) {
                var model;
                if (angular.isArray(select2_data)) {
                    model = [];
                    angular.forEach(select2_data, function (value) {
                        model.push(value._data);
                    });
                } else {
                    if (select2_data && select2_data._data) {
                        model = select2_data._data;
                    } else {
                        model = select2_data;
                    }
                }
                return model;
            };

            // Convert from Angular view-model to Select2 view-model.
            scope.convertToSelect2Model = function (angular_data) {
                if (angular.isArray(angular_data)) {
                    var model = [];
                    angular.forEach(
                        angular_data,
                        function (value) {
                            model.push({
                                id: scope.toId(value),
                                text: scope.toText(value),
                                _data: value
                            });
                        });
                    return model;
                } else if (angular.isObject(angular_data)) {
                    return {
                        id: scope.toId(angular_data),
                        text: scope.toText(angular_data),
                        _data: angular_data
                    };
                }

                return angular_data;
            };

            //allow user to create a simple query
            //just use simpleQuery : function(term, callback) { callback(array_of_dummy_objects; }
            if (scope.simpleQuery) {
                scope.opts.query = function (query) {
                    scope.simpleQuery(query.term, function (values) {
                        query.callback({ results: scope.convertToSelect2Model(values) });
                    });
                };
            }

            // call select2 function to set data and all properties
            scope.render = function () {
                if (scope.opts.multiple) {
                    element.select2('data', scope.convertToSelect2Model(ngModel.$viewValue));
                } else {
                    if (angular.isObject(ngModel.$viewValue)) {
                        element.select2('data', scope.convertToSelect2Model(ngModel.$viewValue));
                    } else if (!ngModel.$viewValue) {
                        element.select2('data', null);
                    } else {
                        element.select2('val', scope.convertToSelect2Model(ngModel.$viewValue));
                    }
                }
                if (scope.opts.sortable) {
                    element.select2("container").find("ul.select2-choices").sortable({
                        containment: 'parent',
                        start: function () {
                            element.select2("onSortStart");
                        },
                        update: function () {
                            element.select2("onSortEnd");
                            element.trigger('change');
                        }
                    });
                }
            };

            // Set the view and model value and update the angular template manually for the ajax/multiple select2.
            element.bind("change", function (event) {
                if (scope.$$phase) {
                    return;
                }
                var e = event;
                scope.$apply(function () {
                    var values = element.select2('data');
                    if (e.removed) {
                        for (var i = 0; i < values.length; i++) {
                            if (values[i] === e.removed) {
                                values.splice(i, 1);
                            }
                        }
                    }
                    if (values && (angular.isArray(values) || values._data)) {
                        values = scope.convertToAngularModel(values);
                    }
                    ngModel.$setViewValue(values);
                });
            });

            // Watch the model for programmatic changes
            scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (current, old) {
                if (current === old) return;
                scope.render();
            }, true);

            element.bind("$destroy", function () {
                element.select2("destroy");
            });

            //watch disabled attrs to send event to select2
            attrs.$observe('disabled', function (value) {
                element.select2('enable', !value);
            });

            // add an onSelect element which retreive model object into e.added or e.removed
            if (scope.onSelect) {
                element.on("change", function (e) {
                    if (e.added) e.added = scope.convertToAngularModel(e.added);
                    if (e.removed) e.removed = scope.convertToAngularModel(e.removed);
                    scope.onSelect(e);
                });
            }

            // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
            $timeout(function () {
                element.select2(scope.opts);
                scope.render();
            });
        }
    };
}]);
