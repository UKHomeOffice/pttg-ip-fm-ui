Feature: Joint applicants

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | Dependants              | 5          |
      | NINO                    | ES123456A  |
      | Application Raised Date | 03/07/2015 |
      | Forename                | Edard      |
      | Surname                 | Stark      |
      | Date Of Birth           | 01/01/1974 |


  Scenario: Toggle the add second individual function
    Given the form is filled in
    And the service displays the following page content
      | second individual btn | Add a second individual |
    And the following are hidden
      | Partner forename      |
      | Partner surname       |
      | Partner date of birth |
      | Partner nino          |
    When the second individual link is clicked
    Then the following are visible
      | Partner forename      |
      | Partner surname       |
      | Partner date of birth |
      | Partner nino          |
    And the service displays the following page content
      | second individual btn | Remove second individual |
    When the second individual link is clicked
    Then the service displays the following page content
      | second individual btn | Add a second individual |
    Then the following are hidden
      | Partner forename      |
      | Partner surname       |
      | Partner date of birth |
      | Partner nino          |

  Scenario: Complete a passing joint income application
    Given the account data for JOINT_PASS
    And the second individual link is clicked
    When applicant submits a query
      | Partner forename      | Jon        |
      | Partner surname       | Snow       |
      | Partner date of birth | 13/05/2002 |
      | Partner nino          | JS123456A  |
    Then the service displays the following result
      | Page dynamic heading | Passed                                           |
      | Outcome box summary  | Edard Stark meets the Income Proving requirement |
    And the service displays the following result table
      | Edard Stark              |                         |
      | Income within date range | 25/03/2015 - 03/07/2015 |
      | Employers                | Winterfell              |
      |                          | Kings Landing           |
      | Jon Snow                 |                         |
      | Income within date range | 25/03/2015 - 03/07/2015 |
      | Employers                | Winterfell              |
      |                          | The Knights' Watch      |
      |                          | Kaleesi                 |
    And the service displays the following search table
      | First name                                    | Edard      |
      | Surname                                       | Stark      |
      | Date of birth                                 | 01/01/1974 |
      | National Insurance number                     | ES123456A  |
      | Second individual's first name                | Jon        |
      | Second individual's surname                   | Snow       |
      | Second individual's date of birth             | 13/05/2002 |
      | Second individual's national Insurance number | JS123456A  |
      | Dependants                                    | 5          |
      | Application raised                            | 03/07/2015 |

  Scenario: Complete a NOT passing joint income application
    Given the account data for JOINT_FAIL
    And the second individual link is clicked
    When applicant submits a query
      | Forename              | Ramsey     |
      | Surname               | Snow       |
      | Date of birth         | 01/01/1974 |
      | Nino                  | RS123456A  |
      | Partner forename      | Theon      |
      | Partner surname       | Greyjoy    |
      | Partner date of birth | 13/05/1974 |
      | Partner nino          | TG123456A  |
      | Dependants            | 0          |
    Then the service displays the following result
      | Page dynamic heading | Not passed                                               |
      | Outcome box summary  | Ramsey Snow does not meet the Income Proving requirement |
    And the service displays the following result table
      | Ramsey Snow   |            |
      | Employers     | Bolton     |
      | Theon Greyjoy |            |
      | Employers     | Winterfell |
      |               | Traitor    |
      |               | Sansa      |
    And the service displays the following search table
      | First name                                    | Ramsey     |
      | Surname                                       | Snow       |
      | Date of birth                                 | 01/01/1974 |
      | National Insurance number                     | RS123456A  |
      | Second individual's first name                | Theon      |
      | Second individual's surname                   | Greyjoy    |
      | Second individual's date of birth             | 13/05/1974 |
      | Second individual's national Insurance number | TG123456A  |
      | Dependants                                    | 0          |
      | Application raised                            | 03/07/2015 |

  Scenario: Partner nino not found
    Given no record for TG123456A
    And the second individual link is clicked
    When applicant submits a query
      | Forename              | Ramsey     |
      | Surname               | Snow       |
      | Date of birth         | 01/01/1974 |
      | Nino                  | RS123456A  |
      | Partner forename      | Theon      |
      | Partner surname       | Greyjoy    |
      | Partner date of birth | 13/05/1974 |
      | Partner nino          | TG123456A  |
      | Dependants            | 0          |
    Then the service displays the following result
      | Page dynamic heading | There is no record for TG123456A with HMRC |
    And the service displays the following search table
      | First name                                    | Ramsey     |
      | Surname                                       | Snow       |
      | Date of birth                                 | 01/01/1974 |
      | National Insurance number                     | RS123456A  |
      | Second individual's first name                | Theon      |
      | Second individual's surname                   | Greyjoy    |
      | Second individual's date of birth             | 13/05/1974 |
      | Second individual's national Insurance number | TG123456A  |
      | Dependants                                    | 0          |
      | Application raised                            | 03/07/2015 |