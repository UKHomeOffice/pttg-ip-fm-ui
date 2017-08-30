Feature: Feedback form

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | NINO                    | KS123456C  |
      | Application Raised Date | 03/07/2015 |
      | Forename                | Kumar      |
      | Surname                 | Sangakkara |
      | Date Of Birth           | 01/01/1978 |
      | Dependants              | 0          |

  Scenario: Feedback form is present on result page
    Given the account data for TL123456A
    When the income check is performed
    Then the service displays the following result
      | feedbackheading | Feedback                            |
      | match           | Did IPS match the paper assessment? |
      | match-yes-label | Yes                                 |
      | match-no-label  | No                                  |
      | submit btn      | Submit and start a new search       |

  Scenario: Yes or No must be selected on the feedback form
    Given the account data for TL123456A
    And the income check is performed
    When the submit button is clicked
    Then the service displays the following result
      | match-error | Select an option |

  Scenario: When No is selected when result is Passed then case reference and textarea should be displayed
    Given the account data for TL123456A
    And the income check is performed
    When the feedback form is completed
      | match | No |
    Then the following are visible
      | caseref       |
      | match comment |

  Scenario: When No is selected when result is NOT Passed then case reference and textarea should be displayed
    Given the account data for BS123456B
    And the income check is performed
    When the feedback form is completed
      | match | No |
    Then the following are visible
      | caseref     |
      | match other |


