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
      | Page sub title | Individual's details |

  Scenario Outline: Invalid Case IDs
    #Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for TL123456A
    And the income check is performed
    And the feedback form is completed
      | match   | No    |
      | caseref | <ref> |
    When the submit button is clicked
    Then the service displays the following result
      | caseref-error | Enter a valid "Case ID" |
    Examples:
      | ref       |
      | 1234567   |
      | 123456789 |
      | 222       |
      | 2222222T  |
      | eightchr  |
      | 01234567  |
      | 02345678  |
      | 012345678 |
      | 0234567666 |
      | 23456789 ! |

  Scenario Outline: Valid Case IDs
    #Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for TL123456A
    And the income check is performed
    And the feedback form is completed
      | match   | No    |
      | caseref | <ref> |
    When the submit button is clicked
    Then the following are hidden
      | caseref-error |
    Examples:
      | ref        |
      | 23456789   |
      | 29876543   |
      | 023456789  |
      | 029876543  |
      

    #### PASSED ####

  Scenario: When No is selected and result is Passed then case reference and text area should be displayed
    Given the account data for TL123456A
    And the income check is performed
    When the feedback form is completed
      | match | No |
    Then the following are visible
      | caseref       |
      | match comment |
    And the service displays the following result
      | caseref-label       | Case ID                                                                  |
      | match comment-label | Why do you think that the paper assessment did not match the IPS result? |
    And the following are hidden
      | match other                |
      | combinedincome-label       |
      | multiple_employers-label   |
      | pay_frequency_change-label |


  Scenario: Validate that a case ref and comment are left
    Given the account data for TL123456A
    And the income check is performed
    And the feedback form is completed
      | match | No |
    When the submit button is clicked
    Then the service displays the following result
      | caseref-error       | Enter a valid "Case ID" |
      | match comment-error | Please provide comments |


    #### NOT PASSED ####

  Scenario: When No is selected and result is NOT Passed then case reference, checkboxes and text area should be displayed
    Given the account data for BS123456B
    And the income check is performed
    When the feedback form is completed
      | match | No |
    Then the following are visible
      | match other                |
      | combinedincome-label       |
      | multiple_employers-label   |
      | pay_frequency_change-label |
    And the service displays the following result
      | combinedincome-label       | Combined income (applicant and sponsor) |
      | multiple_employers-label   | Multiple employers                      |
      | pay_frequency_change-label | Payment frequency changes               |

  Scenario: Other is only required when no checkbox is selected
    Given the account data for BS123456B
    And the income check is performed
    When the feedback form is completed
      | match          | No      |
      | combinedincome | checked |
    And the submit button is clicked
    Then the following are hidden
      | match other-error |


  Scenario: Validate that a case ref and comment are left
    Given the account data for BS123456B
    And the income check is performed
    And the feedback form is completed
      | match | No |
    When the submit button is clicked
    Then the service displays the following result
      | whynot-error      | Select one or more from below |
      | match other-error | Please provide comments       |
