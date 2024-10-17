(function ($, Drupal) {

  'use strict';

  Drupal.search_effets = {};

  Drupal.behaviors.drupalizer_search_effects = {
    attach: function (context, e) {

      // Search hover effects
      var menuHighlightClass = 'is-search-highlighted';
      var itemsFocused = $('.js-search-effects .js-form-type-search-api-autocomplete input.ui-autocomplete-input');

      $(itemsFocused, context).on('focus', function () {
        $('body').addClass(menuHighlightClass, true);
        // $(this).parent('.js-form-item').css({ 'position': 'relative', 'z-index': '200' })
      });

      $(itemsFocused, context).on('blur', function () {
        $('body').removeClass(menuHighlightClass, false);
      });
    }
  };

  document.body.addEventListener('keyup', function(e) {
    var isEscPressed = (e.key === 'Escape' || e.key === 'Enter' );

    if (isEscPressed) {
      $('body').removeClass('is-search-highlighted', false);
    }
  },{once: false});


})(jQuery, Drupal);
