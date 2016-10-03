@Demo
Feature: Pass - Category A Financial Requirement (with no dependents - monthly pay)

  Requirement to meet Category A
  Applicant or Sponsor has received 6 consecutive monthly payments from the same employer over the 182 day period prior to the Application Raised Date

  Financial employment income regulation to pass this Feature File
  Applicant or Sponsor has earned 6 monthly payments => £1550 Monthly Gross Income in the 182 days prior to the Application Raised Date

  Scenario: Jon meets the Category A Financial Requirement (1)
  Pay date 15th of the month
  Before day of Application Raised Date
  He earns £1600 Monthly Gross Income EVERY of the 6Jonathan months
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | AA345678A  |
      | Application Raised Date | 23/01/2015 |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Jon Taylor |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 23/01/2015 |
      | Your Search Individual Name           | Jon Taylor |
      | Your Search National Insurance Number | AA345678A  |
      | Your Search Application Raised Date   | 23/01/2015 |

  Scenario: Jon meets the Category A Financial Requirement (Caseworker enters the National Insurance Number with spaces)
  Pay date 1st of the month
  Before day of Application Raised Date
  He earns £1550 Monthly Gross Income EVERY of the 6 months
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | AA 12 34 56 B |
      | Application Raised Date | 10/01/2015    |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Jon Taylor |
      | Outcome From Date                     | 12/07/2014 |
      | Outcome To Date                       | 10/01/2015 |
      | Your Search Individual Name           | Jon Taylor |
      | Your Search National Insurance Number | AA123456B  |
      | Your Search Application Raised Date   | 10/01/2015 |

  Scenario: Jon meets the Category A Financial Requirement (2)
  Pay date 28th of the month
  After day of Application Raised Date
  He earns £2240 Monthly Gross Income EVERY of the 6 months
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | BB123456B  |
      | Application Raised Date | 23/01/2015 |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Jon Taylor |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 23/01/2015 |
      | Your Search Individual Name           | Jon Taylor |
      | Your Search National Insurance Number | BB123456B  |
      | Your Search Application Raised Date   | 23/01/2015 |

  Scenario: Jon meets the Category A Financial Requirement (3)
  Pay date 23rd of the month
  On same day of Application Raised Date
  He earns £1551 Monthly Gross Income EVERY of the 6
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | CC123456C  |
      | Application Raised Date | 23/01/2015 |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Jon Taylor |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 23/01/2015 |
      | Your Search Individual Name           | Jon Taylor |
      | Your Search National Insurance Number | CC123456C  |
      | Your Search Application Raised Date   | 23/01/2015 |

  Scenario: Jon meets the Category A Financial Requirement (Caseworker enters the Application Raised Date with single numbers for the day and month)
  Pay date 1st of the month
  After day of Application Raised Date
  He earns £3210 Monthly Gross Income EVERY of the 6
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | CC123456B |
      | Application Raised Date | 9/1/2015  |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Jon Taylor |
      | Outcome From Date                     | 11/07/2014 |
      | Outcome To Date                       | 09/01/2015 |
      | Your Search Individual Name           | Jon Taylor |
      | Your Search National Insurance Number | CC123456B  |
      | Your Search Application Raised Date   | 09/01/2015 |


  Scenario: Mark meets the Category A Financial Requirement
  Pay date 17th, for December 2014
  Pay date 30th, for October 2014
  Pay date 15th for all other months
  On different day of Application Raised Date
  He earns £1600 Monthly Gross Income EVERY of the 6
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | AA123456A  |
      | Application Raised Date | 23/01/2015 |
    Then the service displays the following result
      | Outcome                               | Success    |
      | Outcome Box Individual Name           | Mark Jones |
      | Outcome From Date                     | 25/07/2014 |
      | Outcome To Date                       | 23/01/2015 |
      | Your Search Individual Name           | Mark Jones |
      | Your Search National Insurance Number | AA123456A  |
      | Your Search Application Raised Date   | 23/01/2015 |
