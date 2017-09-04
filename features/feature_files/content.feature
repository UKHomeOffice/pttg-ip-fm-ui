Feature: Page content

  Background: # Name of applicant is John Smith
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | NINO                    | AA123456A  |
      | Application Raised Date | 23/01/2015 |
      | Dependants              | 0          |
      | Forename                | Mar        |
      | Surname                 | Jon        |
      | Date Of Birth           | 07/07/1976 |

  Scenario: Check for important text on the page
    Given the account data for JL123456A
    When caseworker submits a query
      | NINO          | JL123456A  |
      | Forename      | Jil        |
      | Last name     | Lew        |
      | date of birth | 08/08/1980 |
    Then the service displays the following result
      | Page dynamic detail         | Jill Lewondoski doesn't meet the Category A requirement                                        |
      | Page dynamic reason         | They haven't met the required monthly amount.                                                  |
      | What to do next heading     | What to do next                                                                                |
      | What to do next sub heading | You should consider if the applicant meets the financial requirement under any other category. |

  Scenario: Page checks for appendix link
    Given the account data for TL123456A
    When caseworker submits a query
      | NINO          | TL123456A  |
      | Forename      | Ton        |
      | Last name     | Led        |
      | Date Of Birth | 05/05/1980 |
    Then the service displays the following result
      | Page appendix title | Where can I find the appendix?                         |
      | Chapter 8 link      | Chapter 8 of the immigration directorate instructions. |
      | FM 1_7 link         | Appendix FM 1.7                                        |

  Scenario: Input Page checks for Category A financial text write up
    Then the service displays the following result
      | Page sub title | Individual's details                                                                            |
      | Page sub text  | You can check an individual meets the Category A requirement using a National Insurance number. |

  Scenario: Show failure when payment frequency is inconsistent
    Given the account data for PAY_FREQUENCY_CHANGE
    When the income check is performed
    Then the service displays the following result
      | Page dynamic detail | Percy Frank-Carter doesn't meet the Category A requirement |
      | Page dynamic reason | Change in payment frequency.                               |

  Scenario: Show failure message when payments from multiple employers is seen
    Given the account data for MULTIPLE_EMPLOYERS
    When the income check is performed
    Then the service displays the following result
      | Page dynamic detail | Martin Elton doesn't meet the Category A requirement |
      | Page dynamic reason | Payments from multiple employers.                    |

  Scenario: Show failure message when a payment frequency cannot be determined
    Given the account data for UNKNOWN_PAY_FREQUENCY
    When the income check is performed
    Then the service displays the following result
      | Page dynamic detail | Unwin Pat-Frank doesn't meet the Category A requirement |
      | Page dynamic reason | Unable to calculate a payment frequency.                |