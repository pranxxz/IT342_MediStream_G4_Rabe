package medistream.features.consultation.entity;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.patient.entity.PatientEntity;

@Entity
@Table(name = "consultation")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer","handler"}, ignoreUnknown = true)
public class ConsultationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int consultationId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"consultations"})
    private PatientEntity patient;

    private String doctorName;
    @Column(name = "consultation_date")
    private OffsetDateTime consultationDateTime;
    private String symptoms;
    private String diagnosis;
    private String prescription;
    private String remarks;
    private String status;

    @ManyToOne
    @JoinColumn(name = "staff_id") 
    private MedicalStaffEntity medicalStaff; 

    public void setMedicalStaff(MedicalStaffEntity medicalStaff) {
        this.medicalStaff = medicalStaff;
    }

    public MedicalStaffEntity getMedicalStaff() {
        return medicalStaff;
    }

    public int getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(int consultationId) {
        this.consultationId = consultationId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public OffsetDateTime getConsultationDate() {
        return consultationDateTime;
    }

    public void setConsultationDate(OffsetDateTime consultationDateTime) {
        this.consultationDateTime = consultationDateTime;
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
        return prescription;
    }

    public void setMedicinePrescribed(String medicinePrescribed) {
        this.prescription = medicinePrescribed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}