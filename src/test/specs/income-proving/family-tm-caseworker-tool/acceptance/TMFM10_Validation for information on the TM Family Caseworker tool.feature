Feature: Input validation
  National Insurance Numbers (NINO) - Format and Security: A NINO is made up of two letters, six numbers and a final letter (which is always A, B, C, or D)
  Date formats: Format should be dd/mm/yyyy or d/m/yyyy

  Background:
    Given Caseworker is using the Income Proving Service Case Worker Tool
    And the default details are
      | NINO                    | AA123456A  |
      | Application Raised Date | 01/05/2015 |
      | Dependants              | 0          |

    #### NINO VALIDATION ####

  Scenario: Caseworker does NOT enter a National Insurance Number
    When Robert submits a query
      | NINO                    |            |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance number |

  Scenario: Caseworker enters incorrect National Insurance Number prefixed with two characters
    When Robert submits a query
      | NINO                    | 11123456A  |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance number |

  Scenario: Caseworker enters incorrect National Insurance Number with two characters in the middle
    When Robert submits a query
      | NINO                    | QQ12HR56A  |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance number |

  Scenario: Caseworker enters incorrect National Insurance Number with the last digit being a number
    When Robert submits a query
      | NINO                    | QQ1235560  |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance number |

  Scenario: Caseworker enters incorrect National Insurance Number is not 9 characters
    When Robert submits a query
      | NINO                    | QQ12545    |
    Then the service displays the following result
      | nino-error | Enter a valid National Insurance number |


    #### Application raised date ####

  Scenario: Caseworker enters an incorrect Application Raised Date
    When Robert submits a query
      | Application Raised Date | 85/01/2015 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters an incorrect Application Raised Date
    When Robert submits a query
      | Application Raised Date | 01/13/2015 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters an incorrect Application Raised date
    When Robert submits a query
      | Application Raised Date | 01/01/201k |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker enters a blank Application Raised Date
    When Robert submits a query
      | Application Raised Date |           |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |

  Scenario: Caseworker is prevented from entering a future date as the Application Raised Date
    When Robert submits a query
      | Application Raised Date | 01/01/2099 |
    Then the service displays the following result
      | application raised date-error | Enter a valid application raised date |



    #### Number of dependants
  Scenario: Caseworker enters incorrect number of dependants: blank
    When Robert submits a query
      | Dependants                    | |
    Then the service displays the following result
      | dependants-error | Enter a valid number of dependants |

  Scenario: Caseworker enters incorrect number of dependants: negative
    When Robert submits a query
      | Dependants                    | -9 |
    Then the service displays the following result
      | dependants-error | Enter a valid number of dependants |

  Scenario: Caseworker enters incorrect number of dependants: alpha
    When Robert submits a query
      | Dependants                    | a9 |
    Then the service displays the following result
      | dependants-error | Enter a valid number of dependants |