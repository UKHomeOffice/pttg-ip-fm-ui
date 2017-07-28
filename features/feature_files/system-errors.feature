Feature: System errors - specify messages shown in response to (simulated) connection failures etc

    Background:
        Given the api health check response has status 200
        And Caseworker is using the Income Proving Service Case Worker Tool

    Scenario: Sensible connection timeout
        Given the api response is delayed for 10 seconds
        When the income check is performed
        Then the service displays the following page content within 6 seconds
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

    Scenario: Coping with a garbage response
        Given the api response is garbage
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

    Scenario: Coping with an empty response
        Given the api response is empty
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

    Scenario: Coping with an unexpected HTTP response status
        Given the api response has status 503
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

    Scenario: Refresh page when KC timesout
        Given the api response has status 307
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | Your Keycloak session has timed out |
            | Page dynamic detail         | The page will now reload.           |

#    Scenario: Coping when the API is down
#        Given the api is unreachable
#        When the income check is performed
#        Then the service displays the following page content
#            | Availability-heading        | You can’t use this service just now |

    Scenario: Handling API server validation errors - missing parameter
        Given the api response is a validation error - missing parameter
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

    Scenario: Handling API server validation errors - invalid parameter
        Given the api response is a validation error - invalid parameter
        When the income check is performed
        Then the service displays the following page content
            | Page dynamic heading        | You can’t use this service just now. The problem will be fixed as soon as possible |
            | Page dynamic detail         | Please try again later.                                                            |

#    @Slow
#    Scenario: Don't retry for error responses from the API
#    If the API responds with a valid HTTP response, whether success, client error, server error, we don't retry.
#    Note that we have to pause the scenario before verifying the number of calls, to allow for any retry attempts (that shouldn't not happen)
#        Given the api response has status 503
#        When the income check is performed
#        And after at least 4 seconds
#        Then the connection attempt count should be 1
#        And after at least 2 seconds
#        # NB Above line is a temp fix to stop the following test failing.
#
#    @Slow
#    Scenario: Retrying after an API connection timeout
#    Retry the API call if there is a refused connection or a connection timeout
#    Delay the API response for long enough that the timeout occurs. The API request should retry a certain number of times.
#    The values for timeout and number of attempts is found in application-test.properties.
#    Note that we have to pause the scenario for long enough for all the retries to happen before we try to verify the count.
#        Given the api response is delayed for 2 seconds
#        When the income check is performed
#        And after at least 4 seconds
#        Then the connection attempt count should be 2
