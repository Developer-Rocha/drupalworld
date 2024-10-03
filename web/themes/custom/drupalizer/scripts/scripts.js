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
   * Variables
   */

    // Focusable elements
  var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
  var focusedElementBefore;

  function setFocusToFirstItemInContainer(obj) {
    var o = obj.find('*');
    o.filter(focusableElementsString).filter(':visible').first().focus();
  }

  function trapEscapeKey(obj, btn, e) {
    if (e.which == 27) {
      var o = obj.find('*');
      var cancelElement;
      cancelElement = o.filter(btn);
      cancelElement.click();
      e.preventDefault();
    }
  }

  function checkViewportSize() {
    const bodyElement = document.body;

    if (window.innerWidth < 992 || bodyElement.classList.contains('is-always-mobile-nav')) {
      bodyElement.classList.add('is-mobile-nav');
    } else {
      bodyElement.classList.remove('is-mobile-nav');
    }
  }

  // Focus Trap
  Drupal.trapFocus = {};

  // Trap
  // Drupal.trapFocus.trap = function(element, trigger)
  // Example: Drupal.trapFocus.trap(ELEMENT);
  // Use only the argument 'element' if focus should be trapped in a container with an exit option
  // eg: fixed position modals
  // Use the argument 'trigger' if focus should be trapped in a container without exit options
  // eg: dopdown elements
  Drupal.trapFocus.trap = function(element, trigger) {
    var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    var firstFocusableEl = focusableEls[0];
    var lastFocusableEl = focusableEls[focusableEls.length - 1];
    var KEYCODE_TAB = 9;
    var KEYCODE_ESC = 27;
    var hasTrigger = false;

    firstFocusableEl.focus();

    if (typeof trigger !== "undefined") {
      hasTrigger = true;
    }

    if (hasTrigger) {

      trigger.addEventListener('keydown', function(e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
          return;
        }

        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === trigger) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        }

        // Tab
        else {
          if (document.activeElement === trigger) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      });
    }

    element.addEventListener('keydown', function(e) {
      var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

      if (!isTabPressed) {
        return;
      }

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          if (!hasTrigger) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        }
      }

      // Tab
      else {
        if (document.activeElement === lastFocusableEl) {
          if (hasTrigger) {
            trigger.focus();
            e.preventDefault();
          }
          else {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      }
    });

    document.body.addEventListener('keyup', function(e) {
      var isEscPressed = (e.key === 'Escape' || e.keyCode === KEYCODE_ESC);

      if (isEscPressed) {
        if (hasTrigger) {
          trigger.focus();
        }
        else {
          focusableEls[focusableEls.length - 1].focus();
        }
      }
    },{once: true});
  }

  Drupal.behaviors.addMobileClass = {
    attach: function (context, settings) {
      $(once('add-mobile-class', 'body', context)).each(function () {
        checkViewportSize();

        window.addEventListener('resize', checkViewportSize);
      });
    }
  };

  // Untrap
  // Drupal.trapFocus.untrap = function(trigger)
  // Example: Drupal.trapFocus.untrap(ELEMENT);
  // Use untrap to escape from containers without exit options.
  // eg: non fixed positioned dopdowns
  Drupal.trapFocus.untrap = function(trigger) {

    console.log('In Untrap focus');

    var focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    var visibleFocusableEls = [];
    var KEYCODE_TAB = 9;
    var KEYCODE_ESC = 27;

    trigger.focus();

    for (var i = 0; i < focusableEls.length; i++) {
      // If elements are not hidden
      // @todo: make this work for fixed position elements
      // @see: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
      // @see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
      if (focusableEls[i].offsetParent !== null) {
        visibleFocusableEls.filter(':visible').push(focusableEls[i]);
      }
    }

    for (var j = 0; j < visibleFocusableEls.length; j++) {
      if (visibleFocusableEls[j] == trigger) {

        console.log('result prev: ', visibleFocusableEls[j-1]);
        console.log('result next: ', visibleFocusableEls[j+1]);

        trigger.addEventListener('keydown', function(e) {
          var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

          if (!isTabPressed) {
            return;
          }

          // Shift + Tab
          if (e.shiftKey) {
            if (document.activeElement === trigger) {
              visibleFocusableEls[j-1].focus();
              e.preventDefault();
            }
          }

          // Tab
          else {
            if (document.activeElement === trigger) {
              visibleFocusableEls[j+1].focus();
              e.preventDefault();
            }
          }
        });
      }
    }

    document.body.addEventListener('keyup', function(e) {
      var isEscPressed = (e.key === 'Escape' || e.keyCode === KEYCODE_ESC);

      if (isEscPressed) {
        if (trigger) {
          trigger.focus();
        }
      }
    },{once: true});
  }

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
   * Search menu
   */
  var $search_menu = {};
  var $search_menu_anchor = {};
  var $search_menu_close = {};

  Drupal.behaviors.searchMenu = {
    attach: function (context, settings) {
      // Assign global jQuery objects
      $search_menu = $('#search-menu');
      $search_menu_anchor = $('#search-menu-anchor');
      $search_menu_close = $('.search-menu__close');

      // Event listeners
      $(once('search-menu-anchor', '#search-menu-anchor', context)).each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          Drupal.behaviors.searchMenu.toggle();
        });
      });
      $(once('search-menu-close', '.search-menu__close', context)).each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          Drupal.behaviors.searchMenu.hide();
        });
      });
      document.body.addEventListener('keyup', function(e) {
        if(e.key && e.key === 'Escape') {
          $('.js-language-selector-trigger').attr('aria-expanded', 'false');
          Drupal.behaviors.searchMenu.hide(true);
        }
      });
      // General class for links opening the search popup.
      $('.link--open-search').each(function () {
        $(once('link-open-search', this, context)).click(function (e) {
          e.preventDefault();
          Drupal.behaviors.searchMenu.show(true);
        });
      });
    },
    toggle: function(animate) {
      animate = typeof animate !== 'undefined' ? animate : true;
      if(!$search_menu.is(':visible')) {
        Drupal.behaviors.searchMenu.show(animate);
      } else {
        Drupal.behaviors.searchMenu.hide(animate);
      }
    },
    show: function(animate) {
      var trapThis = document.querySelector("#search-menu");

      animate = typeof animate !== 'undefined' ? animate : true;
      $search_menu_anchor.addClass('active');
      $search_menu_anchor.attr('aria-expanded', true);
      Drupal.trapFocus.trap(trapThis);
      // Drupal.behaviors.mobileMenu.hide(false);
      if(animate) {
        $search_menu.slideDown(function() {
          setFocusToFirstItemInContainer($search_menu);
        });
      } else {
        $search_menu.show(function() {
          setFocusToFirstItemInContainer($search_menu);
        });
      }
    },
    hide: function(animate) {
      animate = typeof animate !== 'undefined' ? animate : true;
      $search_menu_anchor.removeClass('active');
      $search_menu_anchor.attr('aria-expanded', false);
      if(animate) {
        $search_menu.slideUp();
      } else {
        $search_menu.hide();
      }
    }
  };

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
