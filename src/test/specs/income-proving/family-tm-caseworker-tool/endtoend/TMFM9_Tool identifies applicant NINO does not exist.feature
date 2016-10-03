@Demo
Feature: Tool identifies applicant NINO does not exist

  Scenario: Caseworker enters a NINO where no records exist within the period stated (1)
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | RK123456C  |
      | Application Raised Date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | There is no record for RK123456C with HMRC                                                                                                 |
      | Page dynamic sub text                 | We couldn't perform the financial requirement check as no income information exists with HMRC for the National Insurance Number RK123456C. |
      | Your Search National Insurance Number | RK123456C                                                                                                                                  |
      | Your Search Application Raised Date   | 03/07/2015                                                                                                                                 |

  Scenario: Caseworker enters a NINO where no records exist within the period stated (2)
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | KR123456C  |
      | Application Raised Date | 15/12/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | There is no record for KR123456C with HMRC                                                                                                 |
      | Page dynamic sub text                 | We couldn't perform the financial requirement check as no income information exists with HMRC for the National Insurance Number KR123456C. |
      | Your Search National Insurance Number | KR123456C                                                                                                                                  |
      | Your Search Application Raised Date   | 15/12/2015                                                                                                                                 |
