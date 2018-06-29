Feature: Category A Financial Requirement

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | Dependants              | 0          |
      | NINO                    | KS123456C  |
      | Application Raised Date | 03/07/2015 |
      | Forename                | Kumar      |
      | Surname                 | Sangakkara |
      | Date Of Birth           | 01/01/1978 |


  Scenario: Does not meet the Category A employment duration Requirement (with current employer for only 3 months)
    Given the account data for KS123456C
    When caseworker submits a query
    Then the service displays the following result
      | Page dynamic heading | Not passed                                                         |
      | Outcome box summary  | Kumar Sangakkara does not meet the Income Proving requirement |
    And the service displays the following result table
      | Kumar Sangakkara |                 |
      | Employers        | Pizza Ltd       |
      |                  | Morrisons       |
      |                  | The Home Office |
    And the service displays the following search table
      | First name                | Kumar      |
      | Surname                   | Sangakkara |
      | Date of birth             | 01/01/1978 |
      | National Insurance number | KS123456C  |
      | Dependants                | 0          |
      | Application raised        | 03/07/2015 |

  Scenario: Does not meet the Category A Financial Requirement (earned < the Cat A financial threshold)
    Given the account data for BS123456B
    When caseworker submits a query
      | NINO                    | BS123456B  |
      | Forename                | Brian      |
      | Surname                 | Sinclair   |
      | Date Of Birth           | 06/06/1970 |
      | Application Raised Date | 10/02/2015 |
      | Dependants              | 2          |
    Then the service displays the following result
      | Page dynamic heading | Not passed                                                       |
      | Outcome box summary  | Brian Sinclair does not meet the Income Proving requirement |
    And the service displays the following result table
      | Brian Sinclair |                 |
      | Employers      | The Home Office |
    And the service displays the following search table
      | First name                | Brian      |
      | Surname                   | Sinclair   |
      | Date of birth             | 06/06/1970 |
      | National Insurance number | BS123456B  |
      | Dependants                | 2          |
      | Application raised        | 10/02/2015 |


  Scenario: Meets the Category A Financial Requirement with 1 dependant
    Given the account data for TL123456A
    When caseworker submits a query
      | NINO                    | TL123456A  |
      | Forename                | Tony       |
      | Surname                 | Ledo       |
      | Date Of Birth           | 04/05/1980 |
      | Application Raised Date | 03/01/2015 |
      | Dependants              | 1          |
    Then the service displays the following result
      | Page dynamic heading | Passed                                     |
      | Outcome Box Summary  | Tony Ledo meets the Income Proving requirement |
    And the service displays the following result table
      | Tony Ledo                |                         |
      | Income within date range | 03/07/2014 - 03/01/2015 |
      | Employers                | ZX Spectrum 48K         |
    And the service displays the following search table
      | First name                | Tony       |
      | Surname                   | Ledo       |
      | Date of birth             | 04/05/1980 |
      | National Insurance number | TL123456A  |
      | Dependants                | 1          |
      | Application raised        | 03/01/2015 |


  Scenario: Caseworker enters the National Insurance Number with spaces
    Given the account data for TL123456A
    When Robert submits a query
      | NINO                    | TL 12 34 56 A |
      | Forename                | Tony          |
      | Surname                 | Ledo          |
      | Date Of Birth           | 04/05/1980    |
      | Application Raised Date | 03/01/2015    |
      | Dependants              | 1             |
    Then the service displays the following result
      | Page dynamic heading | Passed                                     |
      | Outcome Box Summary  | Tony Ledo meets the Income Proving requirement |
    And the service displays the following result table
      | Tony Ledo                |                         |
      | Income within date range | 03/07/2014 - 03/01/2015 |
      | Employers                | ZX Spectrum 48K         |
    And the service displays the following search table
      | First name                | Tony       |
      | Surname                   | Ledo       |
      | Date of birth             | 04/05/1980 |
      | National Insurance number | TL123456A  |
      | Dependants                | 1          |
      | Application raised        | 03/01/2015 |


  Scenario: Caseworker enters the Application Raised Date with single numbers for the day and month
    Given the account data for TL123456A
    When Robert submits a query
      | NINO                    | TL123456A  |
      | Forename                | Tony       |
      | Surname                 | Ledo       |
      | Date Of Birth           | 04/05/1980 |
      | Application Raised Date | 3/1/2015   |
      | Dependants              | 1          |
    Then the service displays the following result
      | Page dynamic heading | Passed                                     |
      | Outcome Box Summary  | Tony Ledo meets the Income Proving requirement |
    And the service displays the following result table
      | Tony Ledo                |                         |
      | Income within date range | 03/07/2014 - 03/01/2015 |
      | Employers                | ZX Spectrum 48K         |
    And the service displays the following search table
      | First name                | Tony       |
      | Surname                   | Ledo       |
      | Date of birth             | 04/05/1980 |
      | National Insurance number | TL123456A  |
      | Dependants                | 1          |
      | Application raised        | 03/01/2015 |

  Scenario: Caseworker enters a NINO where no records exist within the period stated
    Given no record for RK123456C
    When Caseworker submits a query
      | NINO                    | RK123456C  |
      | Application Raised Date | 03/07/2015 |
      | Dependants              | 0          |
    Then the service displays the following result
      | Page dynamic heading | There is no record for RK123456C with HMRC                                                     |
      | Page dynamic detail  | We couldn't perform the financial requirement check as no income information exists with HMRC. |
    And the service displays the following search table
      | First name                            | Kumar      |
      | Surname                               | Sangakkara |
      | Date of birth                         | 01/01/1978 |
      | National Insurance number             | RK123456C  |
      | Dependants                            | 0          |
      | Application raised                    | 03/07/2015 |


  Scenario: edit search button is clicked
    Given the account data for BS123456B
    When Caseworker submits a query
      | NINO                    | BS123456B  |
      | Forename                | Brian      |
      | Surname                 | Sinclair   |
      | Date Of Birth           | 01/01/1969 |
      | Application Raised Date | 10/02/2015 |
      | Dependants              | 2          |
    And the edit search button is clicked
    Then the inputs will be populated with
      | Forename                | Brian      |
      | Surname                 | Sinclair   |
      | Date Of Birth           | 01/01/1969 |
      | NINO                    | BS123456B  |
      | Application Raised Date | 10/02/2015 |
      | Dependants              | 2          |
