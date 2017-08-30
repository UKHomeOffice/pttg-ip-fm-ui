Feature: Category A Financial Requirement

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

  Scenario: Does not meet the Category A employment duration Requirement (with current employer for only 3 months)
    Given the account data for KS123456C
    When caseworker submits a query
      | Dependants | 0 |
    Then the service displays the following result
      | Page dynamic heading                  | Not passed                                                  |
      | Page dynamic detail                   | Kumar Sangakkara doesn't meet the Category A requirement    |
      | Page dynamic reason                   | They haven't been with their current employer for 6 months. |
      | Threshold                             | £123.45                                                     |
      | Employer0                             | Pizza Ltd                                                   |
      | Employer1                             | Morrisons                                                   |
      | Employer2                             | The Home Office                                             |
      | Your Search Individual Name           | Kumar Sangakkara                                            |
      | Your Search National Insurance Number | KS123456C                                                   |
      | Your Search Application Raised Date   | 03/07/2015                                                  |

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
      | Page dynamic heading                  | Not passed                                             |
      | Page dynamic detail                   | Brian Sinclair doesn't meet the Category A requirement |
      | Page dynamic reason                   | They haven't met the required monthly amount.          |
      | Your Search Individual Name           | Brian Sinclair                                         |
      | Your Search Dependants                | 2                                                      |
      | Your Search National Insurance Number | BS123456B                                              |
      | Your Search Application Raised Date   | 10/02/2015                                             |
      | Threshold                             | £999.99                                                |
      | Employer0                             | The Home Office                                        |


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
      | Page dynamic heading                  | Passed          |
      | Outcome Box Individual Name           | Tony Ledo       |
      | Outcome From Date                     | 03/07/2014      |
      | Outcome To Date                       | 03/01/2015      |
      | Your Search Individual Name           | Tony Ledo       |
      | Your Search Dependants                | 1               |
      | Your Search National Insurance Number | TL123456A       |
      | Your Search Application Raised Date   | 03/01/2015      |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

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
      | Page dynamic heading                  | Passed          |
      | Outcome Box Individual Name           | Tony Ledo       |
      | Outcome From Date                     | 03/07/2014      |
      | Outcome To Date                       | 03/01/2015      |
      | Your Search Individual Name           | Tony Ledo       |
      | Your Search Dependants                | 1               |
      | Your Search National Insurance Number | TL123456A       |
      | Your Search Application Raised Date   | 03/01/2015      |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

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
      | Page dynamic heading                  | Passed          |
      | Outcome Box Individual Name           | Tony Ledo       |
      | Outcome From Date                     | 03/07/2014      |
      | Outcome To Date                       | 03/01/2015      |
      | Your Search Individual Name           | Tony Ledo       |
      | Your Search Dependants                | 1               |
      | Your Search National Insurance Number | TL123456A       |
      | Your Search Application Raised Date   | 03/01/2015      |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

  Scenario: Caseworker enters a NINO where no records exist within the period stated
    Given no record for RK123456C
    When Caseworker submits a query
      | NINO                    | RK123456C  |
      | Application Raised Date | 03/07/2015 |
      | Dependants              | 0          |
    Then the service displays the following result
      | Page dynamic heading                  | There is no record for RK123456C with HMRC                                                     |
      | Page dynamic detail                   | We couldn't perform the financial requirement check as no income information exists with HMRC. |
      | Your Search National Insurance Number | RK123456C                                                                                      |
      | Your Search Application Raised Date   | 03/07/2015                                                                                     |

  Scenario: Caseworker clicks on the feedback button in query result page
    Given the account data for BS123456B
    And the income check is performed
    When the feedback button is clicked
    Then the service displays the following result
      | Page title | Feedback |

#  Scenario: Caseworker clicks on the start a new search button in query result page
#    Given the account data for BS123456B
#    And the income check is performed
#    When the new search button is clicked
#    Then the service displays the following result
#      | Page sub heading | Family Migration     |
#      | Page sub title   | Individual's details |

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

  Scenario: Caseworker clicks on the feedback button then the start a new search button
    Given the account data for BS123456B
    And the income check is performed
    And the feedback button is clicked
    And the feedback form is completed
      | Correct Individual | Yes |
      | Match              | Yes |
    When the new search button is clicked
    Then the service displays the following result
      | Page sub heading | Family Migration     |
      | Page sub title   | Individual's details |
