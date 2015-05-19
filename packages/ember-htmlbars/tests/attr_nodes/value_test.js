import EmberView from "ember-views/views/view";
import run from "ember-metal/run_loop";
import compile from "ember-template-compiler/system/compile";
import firstChildElement from "ember-htmlbars/tests/test-helpers/first-child-element";

var view;

function appendView(view) {
  run(function() { view.appendTo('#qunit-fixture'); });
}

// jscs:disable validateIndentation
if (Ember.FEATURES.isEnabled('ember-htmlbars-attribute-syntax')) {

QUnit.module("ember-htmlbars: value attribute", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("property is output", function() {
  view = EmberView.create({
    context: { name: 'rick' },
    template: compile("<input value={{name}}>")
  });
  appendView(view);

  equal(firstChildElement(view.element).tagName, 'INPUT', "input element is created");
  equal(firstChildElement(view.element).value, "rick",
        'property is set true');
});

QUnit.test("string property is output", function() {
  view = EmberView.create({
    context: { name: 'rick' },
    template: compile("<input value='{{name}}'>")
  });
  appendView(view);

  equal(firstChildElement(view.element).tagName, 'INPUT', "input element is created");
  equal(firstChildElement(view.element).value, "rick",
        'property is set true');
});

QUnit.test("blank property is output", function() {
  view = EmberView.create({
    context: { name: '' },
    template: compile("<input value={{name}}>")
  });
  appendView(view);

  equal(firstChildElement(view.element).tagName, 'INPUT', "input element is created");
  equal(firstChildElement(view.element).value, "",
        'property is set true');
});

}
// jscs:enable validateIndentation
