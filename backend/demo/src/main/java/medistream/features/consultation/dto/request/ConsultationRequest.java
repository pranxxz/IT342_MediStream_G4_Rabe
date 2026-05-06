package medistream.features.consultation.dto.request;

import java.time.OffsetDateTime;

public class ConsultationRequest {
    private int patientId;
    private int staffId;
    
    private String symptoms;
    private String diagnosis;
    private String medicinePrescribed;
    private String remarks;
    private OffsetDateTime consultationDate;

    public int getStaffId() {
        return staffId;
    }

    public void setStaffId(int staffId) {
        this.staffId = staffId;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getMedicinePrescribed() {
        return medicinePrescribed;
    }

    public void setMedicinePrescribed(String medicinePrescribed) {
        this.medicinePrescribed = medicinePrescribed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public OffsetDateTime getConsultationDate() {
        return consultationDate;
    }

    public void setConsultationDate(OffsetDateTime consultationDate) {
        this.consultationDate = consultationDate;
    }
}