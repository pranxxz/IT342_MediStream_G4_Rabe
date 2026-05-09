package medistream.features.consultation.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import medistream.features.consultation.entity.ConsultationEntity;
import medistream.features.consultation.repository.ConsultationRepository;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.repository.MedicalStaffRepository;
import medistream.features.patient.entity.PatientEntity;
import medistream.features.patient.service.PatientService;

@Service
public class ConsultationService {
    @Autowired
    private ConsultationRepository crepo;

    @Autowired
    private PatientService patientService;

    @Autowired
    private MedicalStaffRepository srepo;

    @Transactional // Ensures the record is committed to the DB
    public ConsultationEntity saveConsultation(int patientId, int staffId, ConsultationEntity consultation) {
        // 1. Fetch Patient - Ensure this isn't returning null!
        PatientEntity patient = patientService.getPatientById(patientId);
        if (patient == null)
            throw new RuntimeException("Patient ID " + patientId + " not found");

        // 2. Fetch Staff
        MedicalStaffEntity staff = srepo.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff ID " + staffId + " not found"));

        // 3. Set Relationships
        consultation.setPatient(patient);
        consultation.setMedicalStaff(staff);

        // 4. Save and return
        return crepo.save(consultation);
    }

    @Transactional
    public ConsultationEntity putConsultation(int id, ConsultationEntity details) {
        return crepo.findById(id).map(existing -> {
            existing.setSymptoms(details.getSymptoms());
            existing.setDiagnosis(details.getDiagnosis());
            existing.setMedicinePrescribed(details.getMedicinePrescribed());
            existing.setRemarks(details.getRemarks());
            existing.setConsultationDate(details.getConsultationDate());
            if (details.getStatus() != null) {
                existing.setStatus(details.getStatus());
            }
            return crepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Consultation not found with id " + id));
    }

    // read
    public List<ConsultationEntity> getAllConsultations() {
        return crepo.findAll();
    }

    // Fetch consultations for a specific patient (most recent first)
    public List<ConsultationEntity> getConsultationsByPatientId(int patientId) {
        return crepo.findByPatient_PatientIdOrderByConsultationDateTimeDesc(patientId);
    }

    // delete
    public String deleteConsultation(int consultationId) {
        crepo.deleteById(consultationId);
        return "Consultation removed! " + consultationId;
    }

}