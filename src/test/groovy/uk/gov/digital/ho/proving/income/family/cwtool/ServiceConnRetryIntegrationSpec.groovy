package uk.gov.digital.ho.proving.income.family.cwtool

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification
import spock.lang.Timeout
import steps.WireMockTestDataLoader
import uk.gov.digital.ho.proving.income.family.cwtool.domain.ResponseDetails

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static java.util.concurrent.TimeUnit.SECONDS
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @Author Home Office Digital
 */
@ContextConfiguration
@SpringBootTest(
        webEnvironment = RANDOM_PORT,
        classes = [ServiceRunner.class],
        properties = [
                "api.root=http://localhost:8989",
                "rest.connection.connection-request-timeout=200",
                "rest.connection.connect-timeout=200",
                "rest.connection.read-timeout=200",
                "connectionRetryDelay=200",
                "connectionAttemptCount=3"
        ])
class ServiceConnRetryIntegrationSpec extends Specification {

    def path = "/incomeproving/v1/individual/AA121212A/financialstatus?"
    def params = "applicationRaisedDate=2014-12-01&dependants=0"
    def url

    @Autowired
    TestRestTemplate restTemplate

    def apiServerMock
    def incomeUrlRegex = "/incomeproving/v1/individual/AA121212A/financialstatus*"

    def setup() {
        url = path + params

        apiServerMock = new WireMockTestDataLoader(8989)
    }

    def cleanup(){
        apiServerMock.stop()
    }

    @Timeout(value = 4, unit = SECONDS) // ensure it doesn't accidentally run forever...
    def 'retries API calls when Connection timeout'() {

        given:
        apiServerMock.withDelayedResponse(incomeUrlRegex, 2)

        when:
        restTemplate.getForEntity(url, ResponseDetails.class)

        then:
        verify(3, getRequestedFor(urlPathMatching(incomeUrlRegex)))
    }
}
