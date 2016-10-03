Feature: Category A Financial Requirement

  Scenario: Does not meet the Category A employment duration Requirement (with current employer for only 3 months)
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for KS123456C
    When Robert submits a query
      | NINO                    | KS123456C  |
      | Application Raised Date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Kumar Sangakkara Dilshan doesn't meet the Category A requirement |
      | Page dynamic detail                   | they haven't been with their current employer for 6 months.      |
      | Your Search Individual Name           | Kumar Sangakkara Dilshan                                         |
      | Your Search National Insurance Number | KS123456C                                                        |
      | Your Search Application Raised Date   | 03/07/2015                                                       |

  Scenario: Does not meet the Category A Financial Requirement (earned < the Cat A financial threshold)
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for BS123456B
    When Robert submits a query
      | NINO                    | BS123456B  |
      | Application Raised Date | 10/02/2015 |
      | Dependants              | 2          |
    Then the service displays the following result
      | Page dynamic heading                  | Brian Sinclair doesn't meet the Category A requirement |
      | Page dynamic detail                   | they haven't met the required monthly amount.          |
      | Your Search Individual Name           | Brian Sinclair                                         |
      | Your Search Dependants                | 2                                                      |
      | Your Search National Insurance Number | BS123456B                                              |
      | Your Search Application Raised Date   | 10/02/2015                                             |

  Scenario: Meets the Category A Financial Requirement with 1 dependant
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for TL123456A
    When Robert submits a query
      | NINO                    | TL123456A  |
      | Application Raised Date | 03/01/2015 |
      | Dependants              | 1          |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Tony Ledo  |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 03/01/2015 |
      | Your Search Individual Name           | Tony Ledo  |
      | Your Search Dependants                | 1          |
      | Your Search National Insurance Number | TL123456A  |
      | Your Search Application Raised Date   | 03/01/2015 |

  Scenario:  Caseworker enters the National Insurance Number with spaces
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for TL123456A
    When Robert submits a query
      | NINO                    | TL 12 34 56 A |
      | Application Raised Date | 03/01/2015    |
      | Dependants              | 1             |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Tony Ledo  |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 03/01/2015 |
      | Your Search Individual Name           | Tony Ledo  |
      | Your Search Dependants                | 1          |
      | Your Search National Insurance Number | TL123456A  |
      | Your Search Application Raised Date   | 03/01/2015 |

  Scenario:  Caseworker enters the Application Raised Date with single numbers for the day and month
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given the account data for TL123456A
    When Robert submits a query
      | NINO                    | TL123456A |
      | Application Raised Date | 3/1/2015  |
      | Dependants              | 1         |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Tony Ledo  |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 03/01/2015 |
      | Your Search Individual Name           | Tony Ledo  |
      | Your Search Dependants                | 1          |
      | Your Search National Insurance Number | TL123456A  |
      | Your Search Application Raised Date   | 03/01/2015 |

  Scenario: Caseworker enters a NINO where no records exist within the period stated
    Given Caseworker is using the Income Proving Service Case Worker Tool
    Given no record for RK123456C
    When Robert submits a query
      | NINO                    | RK123456C  |
      | Application Raised Date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | There is no record for RK123456C with HMRC                                                                                                 |
      | Page dynamic detail                 | We couldn't perform the financial requirement check as no income information exists with HMRC for the National Insurance Number RK123456C. |
      | Your Search National Insurance Number | RK123456C                                                                                                                                  |
      | Your Search Application Raised Date   | 03/07/2015                                                                                                                                 |

