Feature: Category A Financial Requirement

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    When Caseworker submits query
      | NINO                    | KS123456C  |
      | Application Raised Date | 03/07/2015 |
      | First name              |Har         |############
      | Surname                 |For         |############
      | Date of birth           |01/01/1969  |############

  Scenario: Does not meet the Category A employment duration Requirement (with current employer for only 3 months)
    #Given the account data for KS123456C#
    And
      |dependents             | 0 |
    Then the service displays the following result
      | Page dynamic heading                  | Not passed                                                       |
      | Page dynamic detail                   | Harrison Ford doesn't meet the Category A requirement               |
      | Page dynamic reason                   | They haven't been with their current employer for 6 months.      |
      | Threshold                             | £123.45                                                          |
      | Employer0                             | Pizza Ltd                                                        |
      | Employer1                             | Morrisons                                                        |
      | Employer2                             | The Home Office                                                  |
      | Your Search Individual Name           | Harrison Ford                                                       |
      | Your Search National Insurance Number | KS123456C                                                        |
      | Your Search Application Raised Date   | 03/07/2015                                                       |

  Scenario: Does not meet the Category A Financial Requirement (earned < the Cat A financial threshold)
    #Given the account data for BS123456B
   # When Robert submits a query
      #| NINO                    | BS123456B  | #####
      #| Application Raised Date | 10/02/2015 |#####
      And ###
        | Dependants              | 2          |#####

    Then the service displays the following result
      | Page dynamic heading                  | Not passed                                             |
      | Page dynamic detail                   | Harrison Ford doesn't meet the Category A requirement |
      | Page dynamic reason                   | They haven't met the required monthly amount.          |
      | Your Search Individual Name           | Harrison Ford                                         |
      | Your Search Dependants                | 2                                                      |
      #| Your Search National Insurance Number | BS123456B                                              |#
      | Your Search National Insurance Number | KS123456C                                              |#
      | Your Search Application Raised Date   | 03/07/2015                                             |
      | Threshold                             | £999.99                                                |
      | Employer0                             | The Home Office                                        |


  Scenario: Meets the Category A Financial Requirement with 1 dependant
    #Given the account data for TL123456A
    And
      #| NINO                    | TL123456A  |
      #| Application Raised Date | 03/01/2015 |
      | Dependants              | 1          |
    Then the service displays the following result
      | Page dynamic heading                  | Passed          |
      | Outcome Box Individual Name           | Harrison Ford   |
      | Outcome From Date                     | 25/01/2015      |#
      | Outcome To Date                       | 03/07/2015      |#
      | Your Search Individual Name           | Harrison Ford   |
      | Your Search Dependants                | 1               |
      #| Your Search National Insurance Number | TL123456A       |
      | Your Search National Insurance Number | KS123456C       |#
      | Your Search Application Raised Date   | 03/07/2015      |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

  Scenario:  Caseworker enters the National Insurance Number with spaces
    Given the account data for TL123456A
    When Robert submits a query
      #| NINO                    | TL 12 34 56 A |
      #| Application Raised Date | 03/01/2015    |
      And
        | Dependants              | 1             |
    Then the service displays the following result
      | Page dynamic heading                  | Passed     |
      | Outcome Box Individual Name           | Harrison Ford  |
      | Outcome From Date                     | 25/05/2014 |
      | Outcome To Date                       | 03/01/2015 |
      | Your Search Individual Name           | Harrison Ford  |
      | Your Search Dependants                | 1          |
      #| Your Search National Insurance Number | TL123456A  |
      | Your Search National Insurance Number | KS123456C   |#
      | Your Search Application Raised Date   | 03/01/2015 |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

  Scenario:  Caseworker enters the Application Raised Date with single numbers for the day and month
    Given the account data for TL123456A
    When Robert submits a query
      #| NINO                    | TL123456A |
      #| Application Raised Date | 03/01/2015  |
      And
      | Dependants              | 1         |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Harrison Ford  |
      | Outcome From Date                     | 25/06/2014 |
      | Outcome To Date                       | 03/01/2015 |
      | Your Search Individual Name           | Harrison Ford  |
      | Your Search Dependants                | 1          |
      #| Your Search National Insurance Number | TL123456A  |
      | Your Search National Insurance Number | KS123456C   |#
      | Your Search Application Raised Date   | 03/01/2015 |
      | Threshold                             | £128.64         |
      | Employer0                             | ZX Spectrum 48K |

  Scenario: Caseworker enters a NINO where no records exist within the period stated
    Given no record for KS123456C
    When Caseworker submits a query
      #| NINO                    | RK123456C  |
      #| Application Raised Date | 03/07/2015 |
      And
        | Dependants              | 0          |
    Then the service displays the following result
      | Page dynamic heading                  | There is no record for KS123456C with HMRC                                                     |
      | Page dynamic detail                   | We couldn't perform the financial requirement check as no income information exists with HMRC. |
      | Your Search National Insurance Number | KS123456C                                                                                      |
      | Your Search Application Raised Date   | 03/07/2015                                                                                     |

  Scenario: Caseworker clicks on the start a new search button in query result page
    Given the income check is performed
    When the new search button is clicked
    Then the service displays the following result
      | Page sub heading | Family Migration     |
      | Page sub title   | Individual's details |

  Scenario: edit search button is clicked
    Given the account data for KS123456C
    Given Caseworker submits a query
      #| NINO                    | BS123456B  |
      #| Application Raised Date | 10/02/2015 |
      And                                         #
        | Dependants              | 2          |
    When the edit search button is clicked
    Then the inputs will be populated with
      | First name              |Har         |############
      | Surname                 |For         |############
      | Date of birth           |01/01/1969  |############
      | NINO                    | KS123456C  |
      | Application Raised Date | 03/07/2015 |
      | Dependants              | 2          |