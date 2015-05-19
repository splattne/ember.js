import ComponentNodeManager from "ember-htmlbars/node-managers/component-node-manager";
import { SubexprStream } from "ember-htmlbars/hooks/subexpr";
import buildComponentTemplate from "ember-views/system/build-component-template";
import { assign } from "ember-metal/merge";
import { get } from "ember-metal/property_get";

export default function componentHook(renderNode, env, scope, _tagName, params, attrs, templates, visitor) {
  let tagName = _tagName;

  if (attrs._ember_is_toplevel) {
    let isMatchingComponent = scope.component && `<${scope.component.tagName}>` === tagName;
    let isAngleBracket = scope.view._isAngleBracket;

    if (isMatchingComponent || isPlainElement(tagName)) {
      let newAttrs = isAngleBracket ? populateAttrs(attrs, scope.attrs, scope.component) : copyAttrs(attrs);
      tagName = stripAngleBrackets(tagName);

      let { block } = buildComponentTemplate({ isAngleBracket: true, tagName }, newAttrs, { templates, scope });
      block(env, [], undefined, renderNode, scope, visitor);
      return;
    }
  }

  if ('_ember_is_toplevel' in attrs) {
    attrs = copyAttrs(attrs);
  }

  var state = renderNode.state;

  // Determine if this is an initial render or a re-render
  if (state.manager) {
    state.manager.rerender(env, attrs, visitor);
    return;
  }

  let isAngleBracket = false;

  if (tagName.charAt(0) === '<') {
    tagName = tagName.slice(1, -1);
    isAngleBracket = true;
  }

  var read = env.hooks.getValue;
  var parentView = read(env.view);

  var manager = ComponentNodeManager.create(renderNode, env, {
    tagName,
    params,
    attrs,
    parentView,
    templates,
    isAngleBracket,
    parentScope: scope
  });

  state.manager = manager;

  manager.render(env, visitor);
}

function stripAngleBrackets(tagName) {
  return tagName.match(/^<(.*)>$/)[1];
}

function isPlainElement(tagName) {
  return !tagName.match(/-/);
}

function populateAttrs(_attrs, scopeAttrs, component) {
  let attrsClass, scopeClass;
  let classComponents = [];

  if (attrsClass = _attrs.class) {
    classComponents.push(attrsClass);
  }

  if (scopeClass = scopeAttrs && scopeAttrs.class) {
    classComponents.push(scopeClass);
  }

  let attrs = assign(copyAttrs(_attrs), copyAttrs(scopeAttrs));

  if (component) {
    attrs.id = get(component, 'elementId');
    classComponents.push('ember-view');
  }

  if (classComponents.length) {
    attrs.class = new SubexprStream(classComponents, {}, params => {
      return params.join(' ');
    }, "todo");
    attrs.class.isConcat = true;
  }

  return attrs;
}

function copyAttrs(attrs) {
  let newAttrs = {};

  for (let prop in attrs) {
    if (prop === '_ember_is_toplevel') { continue; }
    newAttrs[prop] = attrs[prop];
  }

  return newAttrs;
}
