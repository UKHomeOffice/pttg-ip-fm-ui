package uk.gov.digital.ho.proving.income.family.cwtool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.digital.ho.proving.income.family.cwtool.audit.AuditActions;
import uk.gov.digital.ho.proving.income.family.cwtool.domain.api.ApiResponse;
import uk.gov.digital.ho.proving.income.family.cwtool.domain.api.Nino;
import uk.gov.digital.ho.proving.income.family.cwtool.domain.client.FinancialStatusResponse;
import uk.gov.digital.ho.proving.income.family.cwtool.health.ApiAvailabilityChecker;

import javax.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static java.util.Arrays.asList;
import static net.logstash.logback.argument.StructuredArguments.value;
import static org.springframework.http.HttpMethod.GET;
import static uk.gov.digital.ho.proving.income.family.cwtool.audit.AuditActions.auditEvent;
import static uk.gov.digital.ho.proving.income.family.cwtool.audit.AuditEventType.SEARCH;
import static uk.gov.digital.ho.proving.income.family.cwtool.audit.AuditEventType.SEARCH_RESULT;

@RestController
@RequestMapping("/incomeproving/v1")
@ControllerAdvice
public class Service {

    private static Logger LOGGER = LoggerFactory.getLogger(Service.class);

    @Value("${api.root}")
    private String apiRoot;

    @Value("${api.endpoint}")
    private String apiEndpoint;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ApplicationEventPublisher auditor;

    @Autowired
    private ApiAvailabilityChecker apiAvailabilityChecker;

    @Retryable(interceptor = "connectionExceptionInterceptor")
    @RequestMapping(path="/individual/{nino}/financialstatus", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity checkStatus(@Valid Nino nino,
                                      @RequestParam(value = "applicationRaisedDate", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate applicationRaisedDate,
                                      @RequestParam(value = "dependants", required = false) Integer dependants) {

        LOGGER.debug("CheckStatus: Nino - {} applicationRaisedDate - {} dependants- {}", value("nino", nino.getNino()), applicationRaisedDate, dependants);

        UUID eventId = AuditActions.nextId();
        auditor.publishEvent(auditEvent(SEARCH, eventId, auditData(nino, applicationRaisedDate, dependants)));

        ApiResponse apiResult = restTemplate.exchange(buildUrl(nino.getNino(), applicationRaisedDate, dependants), GET, entity(), ApiResponse.class).getBody();

        LOGGER.debug("Api result: {}", value("checkStatusApiResult", apiResult));

        FinancialStatusResponse response = new FinancialStatusResponse(apiResult);

        auditor.publishEvent(auditEvent(SEARCH_RESULT, eventId, auditData(response)));

        return ResponseEntity.ok(response);
    }

    private URI buildUrl(String nino, LocalDate applicationRaisedDate, Integer dependants) {
        URI uri = UriComponentsBuilder
                .fromUriString(apiRoot + apiEndpoint)
                .queryParam("applicationRaisedDate", applicationRaisedDate)
                .queryParam("dependants", dependants)
                .buildAndExpand(nino).toUri();

        LOGGER.debug("Constructed URI: {}", uri.toString());

        return uri;
    }

    private HttpEntity<Object> entity() {
        return new HttpEntity<>(getHeaders());
    }

    private HttpHeaders getHeaders() {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(asList(MediaType.APPLICATION_JSON));

        return headers;
    }

    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private Map<String, Object> auditData(Nino nino, LocalDate applicationRaisedDate, Integer dependants) {

        Map<String, Object> auditData = new HashMap<>();

        auditData.put("method", "check-financial-status");
        auditData.put("nino", nino.getNino());
        auditData.put("applicationRaisedDate", applicationRaisedDate.format(DateTimeFormatter.ISO_DATE));
        auditData.put("dependants", dependants);

        return auditData;
    }

    private Map<String, Object> auditData(FinancialStatusResponse response) {

        Map<String, Object> auditData = new HashMap<>();

        auditData.put("method", "check-financial-status");
        auditData.put("response", response);

        return auditData;
    }

    @RequestMapping(path = "availability", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity availability(){
        return apiAvailabilityChecker.check();
    }
}