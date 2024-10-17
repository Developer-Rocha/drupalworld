(function (document, Drupal) {

  'use strict';

  Drupal.drupalizer_facets = {};

  Drupal.drupalizer_facets.used = [];

  Drupal.drupalizer_facets.findToggleStuffTrigger = function(wrapper) {
    var el = wrapper.querySelectorAll('.js-toggle-stuff-trigger');
    if (el.length > 0) {
      return el[0];
    }
    return false;
  };

  Drupal.behaviors.drupalizer_facets_stuff = {
    attach: function (context) {
      var facets = context.querySelectorAll('.js-facets-widget');
      if (facets.length > 0) {
        for (var i = 0; i < facets.length; i++) {
          var alias = facets[i].getAttribute('data-drupal-facet-alias');
          if (facets[i].classList && facets[i].classList.contains('facet-active')) {
            if (!Drupal.drupalizer_facets.used.includes(alias)) {
              Drupal.drupalizer_facets.used.push(alias);
            }
          }

          // Always keep used facets open.
          if (Drupal.drupalizer_facets.used.includes(alias)) {
            var wrapper = Drupal.toggle_stuff.findWrapper(facets[i]);
            var trigger = Drupal.drupalizer_facets.findToggleStuffTrigger(wrapper);
            trigger.setAttribute('aria-expanded', 'true');
            Drupal.toggle_stuff.handleEl(trigger);
          }
        }
      }
    }
  };

})(document, Drupal);
