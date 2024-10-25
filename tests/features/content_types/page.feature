Feature: Everything functionally related to Page tests.

  Scenario Outline: [Anonymous] home
    When I go to "<node_url>"
    Then I should get a 200 HTTP response
    And I should see "<node_title>"

    Examples:
      | node_url          | node_title        |
      | /                 | Home              |
      | /disclaimer       | Disclaimer        |
      | /privacybeleid    | Privacybeleid     |
      | /contact          | Contact           |

  @javascript @api
  Scenario: [Webmaster] Create a page
    Given I am logged in as a user with the webmaster role
    When I go to "node/add/lb_page"
    And I enter "Lorem Ipsum" for "edit-title-0-value"
    And I press the "Opslaan" button
    Then I should see "Lorem Ipsum"

  @javascript @api
  Scenario: [Editor] Edit a page
    Given I am logged in as a user with the webmaster role
    When I go to "node/add/lb_page"
    And I enter "Lorem Ipsum" for "edit-title-0-value"
    And I press the "Opslaan" button
    Given I am logged in as a user with the editor role
    And I go to "/lorem-ipsum"
    And I hover over the element ".menu-item__local_tasks"
    And I click "Pagina-instellingen"
    And I enter "Lorem ipsum dolor sit amet" for "edit-title-0-value"
    And I press the "Opslaan" button
    Then I should see "Lorem ipsum dolor sit amet"

  @javascript @api
  Scenario: [Editor] Don't delete a page as editor
    Given I am logged in as a user with the webmaster role
    When I go to "node/add/lb_page"
    And I enter "Lorem Ipsum" for "edit-title-0-value"
    And I press the "Opslaan" button
    Given I am logged in as a user with the editor role
    And I go to "/lorem-ipsum"
    And I hover over the element ".menu-item__local_tasks"
    And I click "Pagina-instellingen"
    Then I should not see the text "Verwijderen"

  @javascript @api
  Scenario: [Webmaster] Delete a page as webmaster
    Given I am logged in as a user with the webmaster role
    When I go to "node/add/lb_page"
    And I enter "Lorem Ipsum" for "edit-title-0-value"
    And I press the "Opslaan" button
    And I hover over the element ".menu-item__local_tasks"
    And I click "Pagina-instellingen"
    And I click the "#edit-delete--2" element
    Then I should see the text "Weet u zeker dat u inhoudsitem Lorem Ipsum wilt verwijderen"
    And I press the "Verwijderen" button
    And I go to "/lorem Ipsum"
    Then I should see "The page you requested is no longer here"
