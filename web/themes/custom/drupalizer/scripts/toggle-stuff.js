(function (document, Drupal) {

  'use strict';

  Drupal.toggle_stuff = {};

  Drupal.toggle_stuff.findParent = function(el) {
    if (el.classList && el.classList.contains('js-toggle-stuff-trigger')) {
      return el;
    }
    if (el.parentNode === null) {
      return false;
    }

    return Drupal.toggle_stuff.findParent(el.parentNode);
  };

  Drupal.toggle_stuff.findWrapper = function(el) {
    if (el.classList && el.classList.contains('js-toggle-stuff')) {
      return el;
    }
    if (el.parentNode === null) {
      return false;
    }

    return Drupal.toggle_stuff.findWrapper(el.parentNode);
  };

  Drupal.toggle_stuff.findContent = function(wrapper) {
    var el = wrapper.querySelectorAll('.js-toggle-stuff-target');
    if (el.length > 0) {
      return el[0];
    }
    return false;
  };

  Drupal.toggle_stuff.handleClick = function(e) {
    var el = Drupal.toggle_stuff.findParent(e.target || e.srcElement);
    var expanded = 'true';
    if (el.getAttribute('aria-expanded') === 'true') {
      expanded = 'false';
    }
    el.setAttribute('aria-expanded', expanded);
    Drupal.toggle_stuff.handleEl(el);
  };

  Drupal.toggle_stuff.handleEl = function(el) {
    var wrapper = Drupal.toggle_stuff.findWrapper(el);
    var content = Drupal.toggle_stuff.findContent(wrapper);

    if (el.getAttribute('aria-expanded') === 'false') {
      content.classList.add('is-hidden');
    }
    else {
        content.classList.remove('is-hidden');
      }
  };

  Drupal.behaviors.compony_toggleStuff = {
    attach: function (context) {
      var toggle = context.querySelectorAll('.js-toggle-stuff-trigger');

      if (toggle.length > 0) {
        for (var i = 0; i < toggle.length; i++) {
          toggle[i].onclick = Drupal.toggle_stuff.handleClick;
          Drupal.toggle_stuff.handleEl(toggle[i]);
        }
      }
    }
  };

})(document, Drupal);
