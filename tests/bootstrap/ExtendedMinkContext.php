<?php

use Behat\Mink\Driver\Selenium2Driver;
use Drupal\DrupalExtension\Context\MinkContext;

/**
 * Defines general helper features extending MinkContext.
 */
class ExtendedMinkContext extends MinkContext {

  use SpinTrait;

  /**
   * Workaround for browser size.
   *
   * @BeforeStep
   */
  public function resizeWindowStep() {
    if ($this->getSession()->getDriver() instanceof Selenium2Driver) {
      $is_session = $this->getMink()->isSessionStarted();
      if (!$is_session) {
        $this->getMink()->getSession()->start();
      }
      $this->getSession()->resizeWindow(1920, 1080, 'current');
    }
  }

  /**
   * Click an element identified by selector :selector.
   *
   * @Given I click the :selector element
   *
   * @throws \Exception
   */
  public function iClickTheElement($selector) {
    $page = $this->getSession()->getPage();
    $element = $page->find('css', $selector);

    if (empty($element)) {
      throw new Exception("No html element found for the selector ('$selector')");
    }

    $element->click();
  }

  /**
   * Wait :seconds.
   *
   * @Given I wait :seconds seconds
   */
  public function iWaitSeconds($seconds) {
    sleep($seconds);
  }

  /**
   * Wait until :text appears.
   *
   * @When I wait for :text to appear
   * @Then I should see :text appear
   */
  public function iWaitForTextToAppear($text) {
    $this->spin(function (ExtendedMinkContext $context) use ($text) {
        return $context->assertPageContainsText($text);
    });
  }

  /**
   * Hover over an element.
   *
   * @When /^I hover over the element "([^"]*)"$/
   */
  public function iHoverOverTheElement($locator) {
    $session = $this->getSession();
    $element = $session->getPage()->find('css', $locator);

    // Errors must not pass silently.
    if ($element === NULL) {
      throw new \InvalidArgumentException(sprintf('Could not evaluate CSS selector: "%s"', $locator));
    }

    $element->mouseOver();
  }

}
