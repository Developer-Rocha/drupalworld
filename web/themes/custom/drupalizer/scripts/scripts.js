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

  /**
   * Language dropdown
   */
  Drupal.behaviors.languageSelectorTrigger = {
    attach: function (context, settings) {
      $(once('js-language-selector-trigger', '.js-language-selector-trigger', context)).each(function () {
        var allLangDropdowns = $('.js-language-selector-trigger');
        $(this).on('click', function() {
          if($(this).attr('aria-expanded') === 'true') {
            $(this).attr('aria-expanded', 'false');
          } else {
            allLangDropdowns.attr('aria-expanded', 'false');
            $(this).attr('aria-expanded', 'true');
          }
        });
      });
      document.body.addEventListener('keyup', function(e) {
        if(e.key && e.key === 'Escape') {
          $('.js-language-selector-trigger').attr('aria-expanded', 'false');
        }
      });

      document.body.addEventListener('click', function(e) {
        if(!$(e.target).parents('.js-language-selector').length) {
          $('.js-language-selector-trigger').attr('aria-expanded', 'false');
        }
      });
    }
  };

  Drupal.behaviors.languageLastWord = {
    attach: function (context, settings) {
      $(once('language-switcher__dropdown', '.language-switcher__dropdown .language-switcher__item', context)).each(function () {
        var heading = $(this).find('a');
        var word_array, last_part, first_word, language_code;

        word_array = heading.text().split(/\s+/);
        first_word = word_array.shift();        // pop the last word
        last_part = word_array.join(' ');        // rejoin the first words together
        language_code = heading.attr('hreflang');

        $(this).addClass(language_code);
        heading.html([' <span class="first-word">',first_word, '</span>',' <span class="last-word">', last_part, '</span>'].join(''));
      });
    }
  };

  Drupal.behaviors.languageBarBtn = {
    attach: function (context, settings) {
      $(once('site-language-bar__close-btn', '.site-language-bar__close-btn', context)).each(function () {
        $(this).on('click', function() {
          var banner = $(this).parents('.site-language-bar');
          banner.slideUp("slow", function() {
            banner.remove();
          });
        });
      });
    }
  };

  Drupal.behaviors.languageBar = {
    attach: function (context, settings) {

      var language_link = $('.links.language-switcher__items .is-active a').attr('href');

      $('.site-language-bar .language-switcher__dropdown a').on('click', function(event) {
        event.preventDefault();
        var language_name, language_code, filter;

        language_link = $(this).attr('href');
        language_name = $(this).html();
        language_code = $(this).attr('hreflang');
        filter = 'language-switcher__anchor--';

        $(this).parents('.language-switcher').find('.language-switcher__anchor').removeClass(function (index, className) {
          return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ')
        });
        $(this).parents('.language-switcher').find('.language-switcher__anchor').attr('aria-expanded','false');
        $(this).parents('.language-switcher').find('.language-switcher__label').html(language_name);
        $(this).parents('.language-switcher').find('.language-switcher__anchor').addClass('language-switcher__anchor--'+language_code);
      });

      $('.site-language-bar .site-language-bar__submit-btn').on('click', function() {
        if (!language_link) {
          var active_lang_link = $('.site-language-bar .language-switcher').find('.language-link.is-active').attr('href');
          if (!active_lang_link) {
            language_link = '/en/homepage';
          } else {
            language_link = active_lang_link;
          }
        }
        window.location.href = language_link;
      });

      var allLangDropdowns = $('.js-language-selector-trigger');
      $('#block-languageswitcher-banner .js-language-selector-trigger').on('click', function() {
        allLangDropdowns.attr('aria-expanded', 'false');
        $(this).attr('aria-expanded', 'true');
      });
    }
  };
})(jQuery, Drupal);
