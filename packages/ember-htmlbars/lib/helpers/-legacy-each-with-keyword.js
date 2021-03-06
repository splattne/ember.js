import { get } from "ember-metal/property_get";
import { forEach } from "ember-metal/enumerable_utils";
import shouldDisplay from "ember-views/streams/should_display";

export default function legacyEachWithKeywordHelper(params, hash, blocks) {
  var list = params[0];
  var keyPath = hash.key;
  var legacyKeyword = hash['-legacy-keyword'];

  if (shouldDisplay(list)) {
    forEach(list, function(item, i) {
      var self;
      if (legacyKeyword) {
        self = bindKeyword(self, legacyKeyword, item);
      }

      var key = keyPath ? get(item, keyPath) : String(i);
      blocks.template.yieldItem(key, [item, i], self);
    });
  } else if (blocks.inverse.yield) {
    blocks.inverse.yield();
  }
}

function bindKeyword(self, keyword, item) {
  return {
    self,
    [keyword]: item
  };
}

export var deprecation = "Using the context switching form of {{each}} is deprecated. Please use the keyword form (`{{#each items as |item|}}`) instead.";
