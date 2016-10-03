@Demo
Feature: Pass - Category A Financial Requirement (with no dependents - weekly pay)

  Requirement to meet Category A
  Applicant or Sponsor has received 26 payments from the same employer over 182 day period prior to the Application Raised Date

  Financial employment income regulation to pass this Feature File
  Applicant or Sponsor has received 26 weekly Gross Income payments of => £357.69 in the 182 day period prior to the Application Raised Date

  Scenario: Molly Henry meets the Category A Financial Requirement
  He has received 26 Weekly Gross Income payments of £470.43
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | MH123456A  |
      | Application Raised date | 29/11/2015 |
    Then the service displays the following result
      | Outcome                               | Success     |
      | Outcome Box Individual Name           | Molly Henry |
      | Outcome From Date                     | 31/05/2015  |
      | Outcome To Date                       | 29/11/2015  |
      | Your Search Individual Name           | Molly Henry |
      | Your Search National Insurance Number | MH123456A   |
      | Your Search Application Raised Date   | 29/11/2015  |

  Scenario: Fernando Sanchez meets the Category A Financial Requirement
  He has received 26 Weekly Gross Income payments of £357.69
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | FS123456C  |
      | Application Raised date | 09/10/2015 |
    Then the service displays the following result
      | Outcome                               | Success          |
      | Outcome Box Individual Name           | Fernando Sanchez |
      | Outcome From Date                     | 10/04/2015       |
      | Outcome To Date                       | 09/10/2015       |
      | Your Search Individual Name           | Fernando Sanchez |
      | Your Search National Insurance Number | FS123456C        |
      | Your Search Application Raised Date   | 09/10/2015       |

  Scenario: John Odometey meets the Category A Financial Requirement
  He has received 26 Weekly Gross Income payments of £1000.00
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | JO123456A  |
      | Application Raised date | 28/06/2015 |
    Then the service displays the following result
      | Outcome                               | Success       |
      | Outcome Box Individual Name           | John Odometey |
      | Outcome From Date                     | 28/12/2014    |
      | Outcome To Date                       | 28/06/2015    |
      | Your Search Individual Name           | John Odometey |
      | Your Search National Insurance Number | JO123456A     |
      | Your Search Application Raised Date   | 28/06/2015    |
