Feature: Input validation
  National Insurance Numbers (NINO) - Format and Security: A NINO is made up of two letters, six numbers and a final letter (which is always A, B, C, or D)
  Date formats: Format should be dd/mm/yyyy or d/m/yyyy

  Scenario: Caseworker does NOT enter a National Insurance Number
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    |            |
      | Application Raised Date | 01/01/2015 |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance Number |

  Scenario: Caseworker enters incorrect National Insurance Number prefixed with two characters
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | 11123456A  |
      | Application Raised Date | 01/01/2015 |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance Number |

  Scenario: Caseworker enters incorrect National Insurance Number with two characters in the middle
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ12HR56A  |
      | Application Raised Date | 01/01/2015 |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance Number |

  Scenario: Caseworker enters incorrect National Insurance Number with the last digit being a number
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ1235560  |
      | Application Raised Date | 01/01/2015 |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance Number |

  Scenario: Caseworker enters incorrect National Insurance Number is not 9 characters
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ12545    |
      | Application Raised Date | 01/01/2015 |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance Number |

  Scenario: Caseworker enters an incorrect Application Raised Date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ129956A  |
      | Application Raised Date | 85/01/2015 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters an incorrect Application Raised Date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ128856A  |
      | Application Raised Date | 01/13/2015 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters an incorrect Application Raised date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ128856A  |
      | Application Raised Date | 01/01/201k |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters a blank Application Raised Date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ128856A |
      | Application Raised Date |           |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker is prevented from entering a future date as the Application Raised Date
    Given Caseworker is using the Income Proving Service Case Worker Tool
    When Robert submits a query
      | NINO                    | QQ125556A  |
      | Application Raised Date | 01/01/2017 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |