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
      | match-label     | Did IPS match the paper assessment? |
      | match-yes-label | Yes                                 |
      | match-no-label  | No                                  |
      | submit btn      | Submit and start a new search       |

  Scenario: Yes or No must be selected on the feedback form
    Given the account data for TL123456A
    And the income check is performed
    When the submit button is clicked
    Then the service displays the following result
      | match-error | Select an option |
    And the following are hidden
      | match comment              |
      | match other                |
      | combinedincome-label       |
      | multiple_employers-label   |
      | pay_frequency_change-label |

  Scenario: Yes is selected on the feedback form
    Given the account data for TL123456A
    And the income check is performed
    When the feedback form is completed
      | match | Yes |
    And the submit button is clicked
    Then the service displays the following result
      | feedbackthanks | Thank you for supplying feedback on this service. |

#  Scenario Outline: Invalid Case IDs
#    Given the account data for TL123456A
#    And the income check is performed
#    And the feedback form is completed
#      | match   | No    |
#      | caseref | <ref> |
#    When the submit button is clicked
#    Then the service displays the following result
#      | caseref-error | Enter a valid "Case ID" |
#    Examples:
#      | ref        |
#      | 1234567    |
#      | 123456789  |
#      | 222        |
#      | 2222222T   |
#      | eightchr   |
#      | 01234567   |
#      | 02345678   |
#      | 012345678  |
#      | 0234567666 |
#      | 23456789 ! |
#
#  Scenario Outline: Valid Case IDs
#    Given the account data for TL123456A
#    And the income check is performed
#    And the feedback form is completed
#      | match   | No    |
#      | caseref | <ref> |
#    When the submit button is clicked
#    Then the following are hidden
#      | caseref-error |
#    Examples:
#      | ref       |
#      | 23456789  |
#      | 29876543  |
#      | 023456789 |
#      | 029876543 |
