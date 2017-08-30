Feature: Copy results to paste buffer

########################################################################################################################

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | NINO                    | TL123456A  |
      | Forename                | Ton        |
      | Surname                 | Led        |
      | Date Of Birth           | 04/05/1980 |
      | Application Raised Date | 01/01/2015 |
      | Dependants              | 1          |

    ## test the content that appears above the 'copy' button when the test passed
  Scenario: summary copy text
    Given the account data for TL123456A
    When Caseworker submits a query
      | NINO | TL123456A |
    Then the service displays the following result
      | Copy summary | Tony Ledo meets the Category A requirement |

        ## test the content that appears above the 'copy' button when the test failed
  Scenario: summary copy text
    Given the account data for BS123456B
    When Caseworker submits a query
      | NINO                    | BS123456B  |
      | Forename                | Bri        |
      | Last name               | Sin        |
      | Date Of Birth           | 06/06/1970 |
      | Application Raised Date | 01/02/2015 |
    Then the service displays the following result
      | Copy summary | Brian Sinclair does not meet the Category A requirement |