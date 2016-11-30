package uk.gov.digital.ho.proving.income.family.cwtool.domain.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * @Author Home Office Digital
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public final class CategoryCheck {

    private boolean passed;
    private String failureReason;

    @JsonSerialize(using = LocalDateSerializer.class)
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate applicationRaisedDate;

    @JsonSerialize(using = LocalDateSerializer.class)
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate assessmentStartDate;

    private BigDecimal threshold;

    public CategoryCheck() {
    }

    public CategoryCheck(boolean passed, String failureReason, LocalDate applicationRaisedDate, LocalDate assessmentStartDate, BigDecimal threhsold) {
        this.passed = passed;
        this.failureReason = failureReason;
        this.applicationRaisedDate = applicationRaisedDate;
        this.assessmentStartDate = assessmentStartDate;
        this.threshold = threshold;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public LocalDate getApplicationRaisedDate() {
        return applicationRaisedDate;
    }

    public void setApplicationRaisedDate(LocalDate applicationRaisedDate) {
        this.applicationRaisedDate = applicationRaisedDate;
    }

    public LocalDate getAssessmentStartDate() {
        return assessmentStartDate;
    }

    public void setAssessmentStartDate(LocalDate assessmentStartDate) {
        this.assessmentStartDate = assessmentStartDate;
    }

    public BigDecimal getThreshold() {
        return threshold;
    }

    public void setThreshold(BigDecimal threshold) {
        this.threshold = threshold;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryCheck that = (CategoryCheck) o;
        return passed == that.passed &&
                Objects.equals(failureReason, that.failureReason) &&
                Objects.equals(applicationRaisedDate, that.applicationRaisedDate) &&
                Objects.equals(assessmentStartDate, that.assessmentStartDate) &&
                Objects.equals(threshold, that.threshold);
    }

    @Override
    public int hashCode() {
        return Objects.hash(passed, failureReason, applicationRaisedDate, assessmentStartDate, threshold);
    }

    @Override
    public String toString() {
        return "CategoryCheck{" +
                "passed=" + passed +
                ", failureReason='" + failureReason + '\'' +
                ", applicationRaisedDate=" + applicationRaisedDate +
                ", assessmentStartDate=" + assessmentStartDate +
                ", threshold=" + threshold +
                '}';
    }
}
