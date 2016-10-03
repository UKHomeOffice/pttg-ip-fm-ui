@Demo
Feature: Failure - Category A Financial Requirement (with dependents - monthly pay)

  Requirement to meet Category A
  Applicant or Sponsor has received < 6 consecutive monthly payments from the same employer over the 182 day period prior to the Application Raised Date

  Financial income regulation to pass this Feature File
  Income required Amount no Dependent Child = £18600 (£1550 per month or above)
  Additional funds for 1 Dependent Child = £3800 on top of employment threshold
  Additional funds for EVERY subsequent dependent child = £2400 on top of employment threshold per child

  Financial income calculation to pass this Feature File
  Income required amount + 1 dependant amount + (Additional dependant amount * number of dependants)/12 = Gross Monthly Income is < Threshold in any one of the 6 payments in the 182 days prior to the Application Raised Date

  1 Dependent Child - £18600+£3800/12 = £1866.67
  2 Dependent Children - £18600+£3800+£2400/12 = £2066.67
  3 Dependent Children - £18600+£3800+(£2400*2)/12 = £2266.67
  4 Dependent Children - £18600+£3800+(£2400*3)/12 = £2466.67
  5 Dependent Children - £18600+£3800+(£2400*4)/12 = £2666.67
  7 Dependent Children - £18600+£3800+(£2400*6)/12 = £3066.67
  ETC

  Scenario: Shelly does not meet the Category A Financial Requirement (She has earned < the Cat A financial threshold)
  Pay date 15th of the month
  Before day of Application Raised Date
  She has 4 Canadian dependants
  She earns £2250.00 Monthly Gross Income EVERY of the 6 months
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | SP123456B  |
      | Application Raised Date | 03/02/2015 |
      | Dependants              | 4          |
    Then the service displays the following result
      | Page dynamic heading                  | Shelly Patel doesn't meet the Category A requirement |
      | Page dynamic detail       | they haven't met the required monthly amount.        |
      | Your Search Individual Name           | Shelly Patel                                         |
      | Your Search Dependants                | 4                                                    |
      | Your Search National Insurance Number | SP123456B                                            |
      | Your Search Application Raised Date   | 03/02/2015                                           |

  Scenario: Brian does not meet the Category A Financial Requirement (He has earned < the Cat A financial threshold)
  Pay date 10th of the month
  On the same day of Application Raised Date
  He has 2 Thai dependants
  He earns £1416.67 Monthly Gross Income EVERY of the 6 months prior to the Application Raised Date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | BS123456B  |
      | Application Raised Date | 10/02/2015 |
      | Dependants              | 2          |
    Then the service displays the following result
      | Page dynamic heading                  | Brian Sinclair doesn't meet the Category A requirement |
      | Page dynamic detail       | they haven't met the required monthly amount.          |
      | Your Search Individual Name           | Brian Sinclair                                         |
      | Your Search Dependants                | 2                                                      |
      | Your Search National Insurance Number | BS123456B                                              |
      | Your Search Application Raised Date   | 10/02/2015                                             |

  Scenario: Steve does not meet the Category A employment duration Requirement (He has worked for his current employer for only 5 months)
  Pay date 3rd of the month
  On same day of Application Raised Date
  He has 3 Thai dependants
  He earns £2916.67 Monthly Gross Income BUT for only 5 months prior to the Application Received Date
  He worked for a different employer before his current employer
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | SY987654C  |
      | Application Raised Date | 03/09/2015 |
      | Dependants              | 3          |
    Then the service displays the following result
      | Page dynamic heading                  | Steve Yu doesn't meet the Category A requirement            |
      | Page dynamic detail       | they haven't been with their current employer for 6 months. |
      | Your Search Individual Name           | Steve Yu                                                    |
      | Your Search Dependants                | 3                                                           |
      | Your Search National Insurance Number | SY987654C                                                   |
      | Your Search Application Raised Date   | 03/09/2015                                                  |
