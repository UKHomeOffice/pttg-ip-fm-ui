package uk.gov.digital.ho.proving.income.family.cwtool.domain.api

import nl.jqno.equalsverifier.EqualsVerifier
import nl.jqno.equalsverifier.Warning
import spock.lang.Specification

import java.time.LocalDate

/**
 * @Author Home Office Digital
 */
class CategoryCheckSpec  extends Specification {

    def "generates meaningful toString instead of just a hash"() {

        given:
        def instance = new CategoryCheck(true, "reason", LocalDate.now(), LocalDate.now(), 0)

        when:
        def output = instance.toString()

        then:
        output.contains("failureReason='$instance.failureReason'")

        and:
        !output.contains('CategoryCheck@')
    }

    def 'has valid hashcode and equals'() {

        when:
        EqualsVerifier.forClass(CategoryCheck).suppress(Warning.NONFINAL_FIELDS).verify()

        then:
        noExceptionThrown()
    }
}
