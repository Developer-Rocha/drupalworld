<?php

use Drupal\DrupalExtension\Context\MessageContext;

/**
 * Defines general helper features extending MessageContext.
 */
class ExtendedMessageContext extends MessageContext {

  use SpinTrait;

  /**
   * Wait until success message( containing) :message appears.
   *
   * @Then I wait for success message( containing) :message to appear
   */
  public function iWaitForSuccessMessageToAppear($message) {
    $this->spin(function (ExtendedMessageContext $context) use ($message) {
        return $context->assertSuccessMessage($message);
    });
  }

}
