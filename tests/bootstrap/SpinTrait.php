<?php

/**
 * Trait SpinTrait.
 *
 * Contains a helper function that retries an assertion until it validates.
 * Based on https://docs.behat.org/en/v2.5/cookbook/using_spin_functions.html .
 */
trait SpinTrait {

  /**
   * Retry function $lambda for $wait seconds until it returns TRUE.
   *
   * @param $lambda
   * @param int $wait
   *
   * @return bool
   * @throws \Exception
   */
  public function spin($lambda, $wait = 20) {
    for ($i = 0; $i < $wait; $i++) {
      try {
        if ($lambda($this)) {
          return TRUE;
        }
      }
      catch (Exception $e) {
        // Do nothing.
      }
      sleep(1);
    }
    return FALSE;
  }

}
