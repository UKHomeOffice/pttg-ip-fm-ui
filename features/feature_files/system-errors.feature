Feature: System errors - specify messages shown in response to (simulated) connection failures etc

  Background:
    Given the api health check response has status 200
    And Caseworker is using the Income Proving Service Case Worker Tool

  Scenario: Sensible connection timeout
    Given the api response is delayed for 40 seconds
    When the income check is performed
    Then the service displays the following page content within 32 seconds
      | Page dynamic heading | Your Keycloak session has timed out |
      | Page dynamic detail  | The page will now reload.           |

  Scenario: Coping with a garbage response
    Given the api response is garbage
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | You can’t use this service just now. The problem will be fixed as soon as possible |
      | Page dynamic detail  | Please try again later.                                                            |

  Scenario: Coping with an empty response
    Given the api response is empty
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | You can’t use this service just now. The problem will be fixed as soon as possible |
      | Page dynamic detail  | Please try again later.                                                            |

  Scenario: Coping with an unexpected HTTP response status
    Given the api response has status 503
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | You can’t use this service just now. The problem will be fixed as soon as possible |
      | Page dynamic detail  | Please try again later.                                                            |

  Scenario: Refresh page when KC timesout
    Given the api response has status 307
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | Your Keycloak session has timed out |
      | Page dynamic detail  | The page will now reload.           |

  Scenario: Refresh page when something went wrong with the service or the API went away - eg into Maintenance Mode
    Given the api response has status 404
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | Incoming Proving Service Currently Unavailable |
      | Page dynamic detail  | The page will now reload.                      |

  Scenario: Handling API server validation errors - missing parameter
    Given the api response is a validation error - missing parameter
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | You can’t use this service just now. The problem will be fixed as soon as possible |
      | Page dynamic detail  | Please try again later.                                                            |

  Scenario: Handling API server validation errors - invalid parameter
    Given the api response is a validation error - invalid parameter
    When the income check is performed
    Then the service displays the following page content
      | Page dynamic heading | You can’t use this service just now. The problem will be fixed as soon as possible |
      | Page dynamic detail  | Please try again later.                                                            |
