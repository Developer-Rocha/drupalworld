Feature: Everything functionally related to Drupal user tests.

  @api
  Scenario: [Administrator] can visit admin
    Given I am logged in as a user with the username calibrate
    When I go to "/admin"
    Then I should get a 200 HTTP response

  Scenario: [Anonymous] gets a 403 page
    Given I am an anonymous user
    When I go to "/admin"
    Then I should get a 403 HTTP response
    And I should see "You don't have access to this page"

  Scenario: [Anonymous] gets a 404 page
    Given I am an anonymous user
    When I go to "/doesntexist"
    Then I should get a 404 HTTP response
    And I should see "The page you requested is no longer here"
