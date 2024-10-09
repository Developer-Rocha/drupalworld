/**
 * @file
 * Drupalizer custom scripts.
 */

(function ($, Drupal) {

  'use strict';

  var options = {};
  if(drupalSettings.calibr8_easytheme != undefined) {
    var options = $.extend({
      breakpoints: {
        'sm': drupalSettings.calibr8_easytheme.breakpoints['sm'],
        'md': drupalSettings.calibr8_easytheme.breakpoints['md'],
        'lg': drupalSettings.calibr8_easytheme.breakpoints['lg'],
        'xl': drupalSettings.calibr8_easytheme.breakpoints['xl']
      }
    }, drupalSettings.calibr8);
  } else {
    // default breakpoints
    var options = {
      breakpoints: {
        'sm': 'screen and (min-width: 392px)',
        'md': 'screen and (min-width: 692px)',
        'lg': 'screen and (min-width: 992px)',
        'xl': 'screen and (min-width: 992px)'
      }
    }
  }

  // Extract the pixel value from the breakpoint.
  function bpExtract($bp) {
    return $bp.substring($bp.lastIndexOf(": ")+1,$bp.lastIndexOf("px"));
  }

  /**
   * Object fit fallback for IE
   */
  $(document).ready(function() {
    // Scroll for anchor link.
    $('a.js-anchor-link').on('click', function (e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);

      $('html, body').animate({
        'scrollTop': $target.offset().top
      }, 1000, 'swing');
    });
  });

  /**
   * Media Queries
   */
  var mobileQuery = 'screen and (max-width:' + (bpExtract(options.breakpoints.lg) - 1) + 'px)';
  var nonMobileQuery = options.breakpoints.md;

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
   * Mobile menu
   */
  var $main_menu = {};
  var $secondary_menu = {};
  var $mobile_menu_anchor = {};
  var $mobile_menu_close_btn = {};
  var $mobile_menu = {};
  var mobile_menu_active = false;
  var $mobile_active_trail = {};

  Drupal.behaviors.mobileMenu = {
    attach: function (context, settings) {
      // Assign global jQuery objects
      $main_menu = $('.site-header .block--menu--main');
      $secondary_menu = $('.site-header .block--menu--secondary');
      $mobile_menu_anchor = $('#mobile-menu-anchor');
      $mobile_menu_close_btn = $('#mobile-menu-btn');
      $mobile_menu = $('#mobile-menu');
      $mobile_active_trail = '#mobile-menu .main-menu__items--sub-menu .js-active-trail';
      // Init
      $(once('mobile-menu', '#mobile-menu', context)).each(function () {
        // Initial state.
        if($(window).width() <= (bpExtract(options.breakpoints.lg) - 1)) {
          Drupal.behaviors.mobileMenu.activate();
        } else {
          Drupal.behaviors.mobileMenu.deactivate();
        }
        // Resize handler
        $(window).resize(function() {
          Drupal.behaviors.mobileMenu.resize();
        });
        $(window).resize();
      });
      // Event listeners
      $(once('mobile-menu', '#mobile-menu-anchor', context)).each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          Drupal.behaviors.mobileMenu.toggle();
        });
      });
      $(once('mobile-menu-btn', '#mobile-menu-btn', context)).each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          Drupal.behaviors.mobileMenu.toggle();
        });
      });
      $('body').on('mouseup touchstart', function (e) {
        if (!$mobile_menu.is(e.target) && $mobile_menu.has(e.target).length === 0) {
          Drupal.behaviors.mobileMenu.hide();
        }
      });

      document.body.addEventListener('keyup', function(e) {
        if(e.key && e.key === 'Escape') {
          $('.mobile-menu__button').attr('aria-expanded', 'false');
          Drupal.behaviors.mobileMenu.hide(true);
        }
      });

      $($mobile_active_trail, context).each(function () {
        $(this).parents('.main-menu__items--sub-menu').siblings('button').attr('aria-expanded', 'true');
        $(this).parents('.main-menu__items--sub-menu').removeClass('is-hidden');
      });
    },
    resize: function() {

      // Always show mobile menu on mobile breakpoint
      if($(window).width() <= (bpExtract(options.breakpoints.lg) - 1)) {
        Drupal.behaviors.mobileMenu.activate();

        // Check if main menu items fit in one row.
      } else {
        var container_width = 0;
        var menu_items_width = 0;
        if ($main_menu.is(':visible')) {
          // Main menu is visible, count width of separate items
          container_width = $main_menu.innerWidth();
          $('> ul.menu > li', $main_menu).each(function (index, element) {
            menu_items_width += $(element).outerWidth();
          });
        } else {
          // Main menu is hidden, show temporary and count width of separate items
          var main_menu_was_hidden = false;
          if (!$main_menu.is(':visible')) {
            main_menu_was_hidden = true;
            $main_menu.attr('style', 'display: block;');
          }
          container_width = $main_menu.innerWidth();
          $('> ul.menu > li', $main_menu).each(function (index, element) {
            menu_items_width += $(element).outerWidth();
          });
          // Hide the menu again
          if (main_menu_was_hidden) {
            $main_menu.attr('style', '');
          }
        }
        // console.log('items width: ' + menu_items_width + '   container width: ' + (container_width - $('.header-anchors').width() - 32));
        if (menu_items_width > (container_width - $('.header-anchors').width() - 32) && container_width > 0) {
          Drupal.behaviors.mobileMenu.activate();
        } else {
          Drupal.behaviors.mobileMenu.deactivate();
        }
      }
    },
    activate: function() {
      mobile_menu_active = true;
      $('body').removeClass('mobile-menu--disabled');
      $('body').addClass('mobile-menu--enabled');
    },
    deactivate: function() {
      mobile_menu_active = false;
      $('body').removeClass('mobile-menu--enabled');
      $('body').addClass('mobile-menu--disabled');
      Drupal.behaviors.mobileMenu.hide();
    },
    toggle: function(animate) {
      animate = typeof animate !== 'undefined' ? animate : true;
      if(!$mobile_menu.is(':visible')) {
        Drupal.behaviors.mobileMenu.show(animate);
        $('html').css('overflow','hidden');
      } else {
        Drupal.behaviors.mobileMenu.hide(animate);
        $('html').css('overflow','auto');
      }
    },
    show: function(animate) {
      animate = typeof animate !== 'undefined' ? animate : true;
      $mobile_menu_anchor.addClass('active');
      $mobile_menu_anchor.attr('aria-expanded', true);
      Drupal.behaviors.searchMenu.hide(false);
      if(animate) {
        $mobile_menu.slideDown(function() {
          setFocusToFirstItemInContainer($mobile_menu);
        });
      } else {
        $mobile_menu.show(function(){
          setFocusToFirstItemInContainer($mobile_menu);
        });
      }
    },
    hide: function(animate) {
      animate = typeof animate !== 'undefined' ? animate : true;
      $mobile_menu_anchor.removeClass('active');
      $mobile_menu_anchor.attr('aria-expanded', false);
      if(animate) {
        $mobile_menu.slideUp();
      } else {
        $mobile_menu.hide();
      }
    }
  };

  /**
   * Search menu
   */
  var $search_menu = {};
  var $search_menu_anchor = {};
  var $search_menu_close = {};

  var $video_menu = {};
  var $video_menu_anchor = {};
  var $video_menu_close = {};

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
      Drupal.behaviors.mobileMenu.hide(false);
      if(animate && mobile_menu_active) {
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
      if(animate && mobile_menu_active) {
        $search_menu.slideUp();
      } else {
        $search_menu.hide();
      }
    }
  };

  /**
   * Mobile menu accordion
   */
  var $mobile_menu_main = $('#mobile-menu .block--menu--main');

  Drupal.behaviors.mobileMenuAccordeon = {
    attach: function (context, settings) {
      $(once('mobile-menu-main', '#mobile-menu .block--menu--main', context)).each(function() {
        $('.menu-item--active-trail', $mobile_menu_main).each(function() {
          $(this).addClass('menu-item--active-js');
        });
        $('.menu-item--expanded', $mobile_menu_main).each(function() {
          $('> a', this).after('<span class="anchor"></span>');
          $('.anchor', this).bind('click', function (e) {
            e.preventDefault();
            var $menu = $(this).closest('#mobile-menu .block--menu--main > ul');
            var is_active = $(this).closest('.menu-item').hasClass('menu-item--active-js');
            // close all trees
            $('.menu-item', $menu).removeClass('menu-item--active-js');
            // open parent tree
            $(this).parents('.menu-item').addClass('menu-item--active-js');
            // toggle this item
            if(is_active) {
              $(this).closest('.menu-item').removeClass('menu-item--active-js');
            }
          });
        });
      });
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

  Drupal.behaviors.searchFocus = {
    attach: function (context, settings) {
      $("input", context).focus(function(index){
        if($(this).parents('form').find('.form--inline')){
          $(this).parents('form').find('.form--inline').addClass('is-focus');
        }
      });

      $("input", context).focusout(function () {
        if($(this).parents('form').find('.is-focus')){
          $(this).parents('form').find('.form--inline').removeClass('is-focus');
        }
      });
    }
  };

  Drupal.behaviors.MainMenuAccessible = {
    attach: function (context, settings) {
      var main_menu = '.main-navigation .main-menu__items';
      var expand_btn = '.main-menu__expand-trigger';
      var level_n_hidden = '.main-menu__items--sub-menu--level-1:not(.is-hidden)';

      $(main_menu, context).each(function () {
        $(this).find(expand_btn).focus(function () {
          $(this).addClass('is-active');
        });

        $(this).find('.main-menu__item--ground > a').focus(function () {
          if($(this).parents(main_menu).find(expand_btn).hasClass('is-active')) {
            $(this).parents(main_menu).find('.main-menu__expand-trigger.is-active').removeClass('is-active');
          }

          if($(this).parents(main_menu).find(level_n_hidden)) {
            $(this).parents(main_menu).find(level_n_hidden).siblings(expand_btn).attr('aria-expanded','false');
            $(this).parents(main_menu).find(level_n_hidden).addClass('is-hidden');
          }
        });
      });
    }
  };

})(jQuery, Drupal);
