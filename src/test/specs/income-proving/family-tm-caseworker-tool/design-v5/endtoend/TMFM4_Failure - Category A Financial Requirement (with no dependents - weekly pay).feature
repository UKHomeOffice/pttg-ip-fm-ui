@Demo
Feature: Failure - Category A Financial Requirement (with no dependents - weekly pay)

  Requirement to meet Category A
  Applicant or Sponsor has received < 26 payments from the same employer over 182 day period prior to the Application Raised Date

  Financial employment income regulation to pass this Feature File
  Applicant or Sponsor has received 26 weekly Gross Income payments of < £357.69 in the 182 day period prior to the Application Raised Date

  Scenario: Davina Love does not meet the Category A Financial Requirement (She has earned < the Cat A financial threshold)
  She earns £300.11 weekly Gross Income EVERY of the 26 weeks
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | DV123456A  |
      | Application raised Date | 15/01/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Davina Love doesn't meet the Category A requirement |
      | Page dynamic detail       | they haven't met the required weekly amount.        |
      | Your Search Individual Name           | Davina Love                                         |
      | Your Search National Insurance Number | DV123456A                                           |
      | Your Search Application raised Date   | 15/01/2015                                          |

  Scenario: Xavier Snow does not meet the Category A Financial Requirement (She has earned < the Cat A financial threshold)
  He earns £30.99 weekly Gross Income EVERY of the 26 weeks
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | XS123456B  |
      | Application raised Date | 15/01/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Xavier Snow doesn't meet the Category A requirement |
      | Page dynamic detail       | they haven't met the required weekly amount.        |
      | Your Search Individual Name           | Xavier Snow                                         |
      | Your Search National Insurance Number | XS123456B                                           |
      | Your Search Application raised Date   | 15/01/2015                                          |

  Scenario: Paul Young does not meet the Category A Financial Requirement (He has earned < the Cat A financial threshold)
  He earns £400.99 weekly Gross Income EVERY of the 24 weeks
  and he earns £300.99 weekly Gross Income for the LAST 2 weeks (total 26 weeks with the same employer)
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | PY123456B  |
      | Application raised Date | 15/01/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Paul Young doesn't meet the Category A requirement |
      | Page dynamic detail       | they haven't met the required weekly amount.       |
      | Your Search Individual Name           | Paul Young                                         |
      | Your Search National Insurance Number | PY123456B                                          |
      | Your Search Application raised Date   | 15/01/2015                                         |

  Scenario: Raj Patel does not meet the Category A employment duration Requirement (He has worked for his current employer for only 3 months)
  He earns £600 a Week Gross Income BUT for only 12 weeks
  He worked for a different employer before his current employer
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | RP123456C  |
      | Application raised date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Raj Patel doesn't meet the Category A requirement           |
      | Page dynamic detail       | they haven't been with their current employer for 6 months. |
      | Your Search Individual Name           | Raj Patel                                                   |
      | Your Search National Insurance Number | RP123456C                                                   |
      | Your Search Application raised Date   | 03/07/2015                                                  |

  Scenario: John James does not meet the Category A employment duration Requirement (He has worked for his current employer for 6 months)
  He earns £357.70 a Week Gross Income BUT for 25 weeks and £357 on week 26
  He worked for a different employer before his current employer
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | JJ123456A  |
      | Application raised date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | John James doesn't meet the Category A requirement          |
      | Page dynamic detail       | they haven't been with their current employer for 6 months. |
      | Your Search Individual Name           | John James                                                  |
      | Your Search National Insurance Number | JJ123456A                                                   |
      | Your Search Application raised Date   | 03/07/2015                                                  |

  Scenario: Peter Jones does not meet the Category A employment duration Requirement (He has worked for his current employer for 6 months)

  He earns £658.50 a Week Gross Income BUT for 25 weeks and £357 on week 26
  He worked for a different employer before his current employer
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | PJ123456A  |
      | Application raised date | 03/07/2015 |
    Then the service displays the following result
      | Page dynamic heading                  | Peter Jones doesn't meet the Category A requirement         |
      | Page dynamic detail       | they haven't been with their current employer for 6 months. |
      | Your Search Individual Name           | Peter Jones                                                 |
      | Your Search National Insurance Number | PJ123456A                                                   |
      | Your Search Application raised Date   | 03/07/2015                                                  |
