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

  Scenario: If No match then a reason must be supplied
    Given the account data for TL123456A
    And the income check is performed
    When the feedback form is completed
      | match | No |
    And the submit button is clicked
    Then the service displays the following result
      | whynot-error | Select an option |


Scenario: If No match then a reason OR other must be completed
    Given the account data for TL123456A
    And the income check is performed
    When the feedback form is completed
      | match       | No    |
      | match other | hello |
    And the submit button is clicked
    Then the service displays the following result
      | feedbackthanks | Thank you for supplying feedback on this service. |

  Scenario: If the service errors then the feedback form is not displayed
    Given the api response is garbage
    When Caseworker submits a query
      | NINO                    | RK123456C  |
      | Application Raised Date | 03/07/2015 |
      | Dependants              | 0          |
    Then the feedback form is not displayed
