Feature: Capabilities required for platform integration and support eg healthchecks, logging, auditing

  Scenario: Readiness check shows UP even when API server not reachable
    Given the api is unreachable
    Then the readiness response status should be 200

  Scenario: Liveness check responds with success as long as the app is running, even if the api is unreachable
    Given the api is unreachable
    Then the liveness response status should be 200

#  ## Warning message when unavailalble ##
#  Scenario: Out of order message is shown on Student type page when the '/availability' end point reports an issue
#    Given the api is unreachable
#    And Caseworker is using the Income Proving Service Case Worker Tool
#    Then the service displays the following result
#      | availability-heading | You can’t use this service just now |
#    And the submit button should be disabled
#
#
#  ## Warning should not be shown when available ##
#  Scenario: Out of order message is NOT shown on Student type page when the '/availability' end point reports OK
#    Given the api health check response has status 200
#    And Caseworker is using the Income Proving Service Case Worker Tool
#    Then the availability warning box should not be shown
#    And the submit button should be enabled
#
#
#  ## Warning should go away when system comes back up ##
#  Scenario: Out of order message disappears when availability changes to OK
#    Given the api health check response has status 503
#    And Caseworker is using the Income Proving Service Case Worker Tool
#    And the service displays the following result
#      | availability-heading | You can’t use this service just now |
#    And the submit button should be disabled
#    When the api health check response has status 200
#    And after at least 2 seconds
#    Then the availability warning box should not be shown
#    And the submit button should be enabled
#
