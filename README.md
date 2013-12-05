ui-select2-sortable   [![Build Status](https://travis-ci.org/Taranys/ui-select2-sortable.png?branch=master)](https://travis-ci.org/Taranys/ui-select2-sortable)
==========
This directive allows you to enhance your select elements with behaviour from the [select2](http://ivaynberg.github.io/select2/) library.

It is a fork from [ui-select2](https://github.com/angular-ui/ui-select2).

I change it to meet my needs :
* Multiple elements
* Sortable with drag&grop
* Use any JS objects as data without any conversion between select2 model and your model

I removed support of <select> to keep only <input type="hidden"> to simplify the directive.

# Requirements

- [AngularJS](http://angularjs.org/)
- [JQuery](http://jquery.com/)
- [JQueryUi](http://jqueryui.com/)
- [Select2](http://ivaynberg.github.io/select2/)

## Setup

1. Install **Karma**, **Grunt** and **Bower**
  `$ npm install -g karma grunt-cli bower`
2. Install development dependencies
  `$ npm install`
3. Install components
  `$ bower install`

## Testing

I use [Grunt](http://gruntjs.com/) to check for JavaScript syntax errors and execute all unit tests. To run Grunt, simply execute:

`$ grunt`

This will lint and test the code, then exit. To have Grunt stay open and automatically lint and test your files whenever you make a code change, use:

`$ grunt karma:server watch`

This will start a Karma server in the background and run unit tests in Firefox and PhantomJS whenever the source code or spec file is saved.

# Usage

I use [bower](https://github.com/bower/bower) for dependency management. Install AngularUI Select2 Sortable into your project by running the command

`$ bower install angular-ui-select2-sortable`

If you use a `bower.json` file in your project, you can have Bower save ui-select2-sortable as a dependency by passing the `--save` or `--save-dev` flag with the above command.

This will copy the ui-select2-sortable files into your `bower_components` folder, along with its dependencies. Load the script files in your application:
```html
<link rel="stylesheet" href="bower_components/select2/select2.css">
<script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
<script type="text/javascript" src="bower_components/jquery/jquery-ui.js"></script>
<script type="text/javascript" src="bower_components/select2/select2.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-select2/src/select2sortable.js"></script>
```

(Note that `jquery` must be loaded before `angular` so that it doesn't use `jqLite` internally)


Add the select2 module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ui.select2.sortable']);
```

Apply the directive to your form elements:

```html
TODO
<select ui-select2 ng-model="select2" data-placeholder="Pick a number">
    <option value=""></option>
    <option value="one">First</option>
    <option value="two">Second</option>
    <option value="three">Third</option>
</select>
```

## Working with ng-model

The ui-select2 directive plays nicely with ng-model and validation directives such as ng-required.

If you add the ng-model directive to same the element as ui-select2 then the picked option is automatically synchronized with the model value.

## Working with dynamic options
`ui-select2` is incompatible with `<select ng-options>`. For the best results use `<option ng-repeat>` instead.
```html
TODO
<select ui-select2 ng-model="select2" data-placeholder="Pick a number">
    <option value=""></option>
    <option ng-repeat="number in range" value="{{number.value}}">{{number.text}}</option>
</select>
```

## Using simple query mode

When AngularJS View-Model tags are stored as a list of strings,
setting the ui-select2 specific option `simple_tags` will allow to keep the model as a list of strings,
and not convert it into a list of Select2 tag objects.

```html
<input
    type="text"
    ui-select2="select2Options"
    ng-model="list_of_string"
    >
```

```javascript
myAppModule.controller('MyController', function($scope) {
    $scope.list_of_string = ['tag1', 'tag2']
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };
});
```
