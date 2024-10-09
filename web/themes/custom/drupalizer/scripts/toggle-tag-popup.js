(function ($, Drupal) {
  'use strict';

  $('.js-tag-popup').each(function () {
    var $popupWrapper = $(this).closest('.js-tag-popup-wrapper');
    if (!$popupWrapper.hasClass('tagPopupApplied')) {
      $popupWrapper.addClass('tagPopupApplied').on('click', '.js-tag-popup', function () {
        $(this).siblings('.field__items').toggleClass('show');
      });

      $(document).on('click', function (event) {
        if (!$(event.target).closest('.field__items').length && !$(event.target).is('.js-tag-popup')) {
          $popupWrapper.find('.field__items').removeClass('show');
        }
      });
    }
  });

})(jQuery, Drupal);
