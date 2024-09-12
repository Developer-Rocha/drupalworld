/**
 * @file
 * Drupalizer custom scripts.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Object fit fallback for IE
   */
  // $(document).ready(function() {
  //   // Scroll for anchor link.
  //   $('a.js-anchor-link').on('click', function (e) {
  //     e.preventDefault();
  //
  //     var target = this.hash;
  //     var $target = $(target);
  //
  //     $('html, body').animate({
  //       'scrollTop': $target.offset().top
  //     }, 1000, 'swing');
  //   });
  // });


  /**
   * Turn off iframe scrolling
   */
  // Drupal.behaviors.iframeScrolling = {
  //   attach: function (context, settings) {
  //     // set iframe scrolling to no for oembed field
  //     $('.field--media-oembed-video iframe').prop('scrolling', 'no');
  //   }
  // };
})(jQuery, Drupal);
