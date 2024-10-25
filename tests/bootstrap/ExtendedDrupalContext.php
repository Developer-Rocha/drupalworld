<?php

use Drupal\DrupalExtension\Context\DrupalContext;

/**
 * Defines general helper features extending DrupalContext.
 */
class ExtendedDrupalContext extends DrupalContext {

  /**
   * Keep track of intended user names so they can be cleaned up.
   *
   * @var array
   */
  protected $intendedUserNames = [];

  /**
   * Stores the user's name in $this->intendedUserNames.
   *
   * This goes before a register form manipulation and submission.
   *
   * @Given I intend to create a user named :name
   *
   * @see cleanUsers()
   */
  public function intendUserName($name) {
    $this->intendedUserNames[] = $name;
  }

  /**
   * Add intended users for clean up.
   *
   * Load users by name, add to user manager to allow parent to clean up.
   *
   * @afterScenario
   */
  public function cleanUsers() {
    if (!empty($this->intendedUserNames)) {
      foreach ($this->intendedUserNames as $name) {
        $user_obj = user_load_by_name($name);

        // Parent's userManager takes a simple object for user.
        $user = (object) [
          'name' => $user_obj->get('name')->value,
          'email' => $user_obj->get('mail')->value,
          'pass' => $user_obj->get('pass')->value,
          'status' => $user_obj->get('status')->value,
          'uid' => $user_obj->get('uid')->value,
        ];
        $this->userManager->addUser($user);
      }
    }
  }

  /**
   * Logs in as :username.
   *
   * @Given I am logged in as a user with the username :username
   */
  public function assertAuthenticatedByUserName($username) {
    // Check if logged in and logout.
    if ($this->loggedIn()) {
      $this->logout();
    }

    $account = user_load_by_name($username);
    $reset_url = user_pass_reset_url($account) . '/login';
    $this->getSession()->visit($reset_url);
  }

}
