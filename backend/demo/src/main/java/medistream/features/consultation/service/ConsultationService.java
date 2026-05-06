package medistream.features.consultation.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medistream.entity.MedicalStaffEntity;
import medistream.features.consultation.entity.ConsultationEntity;
import medistream.features.consultation.repository.ConsultationRepository;
import medistream.core.entity.PatientEntity;
import medistream.repository.MedicalStaffRepository;
import medistream.core.repository.PatientRepository;

@Service
public class ConsultationService {
    @Autowired
    private ConsultationRepository crepo;

    @Autowired
    private PatientRepository prepo;

    @Autowired
    private MedicalStaffRepository srepo;

    public ConsultationEntity saveConsultation(int patientId, int staffId, ConsultationEntity consultation) {
        
        // 1. Fetch Patient
        PatientEntity patient = prepo.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. Fetch Doctor/Staff
        MedicalStaffEntity staff = srepo.findById(staffId)
            .orElseThrow(() -> new RuntimeException("Staff not found"));

        // 3. Set Relationships
        consultation.setPatient(patient);
        consultation.setMedicalStaff(staff);

        // 4. Save
        return crepo.save(consultation);
    }

    //read
    public List<ConsultationEntity> getAllConsultations() {
        return crepo.findAll();
    }

    // Fetch consultations for a specific patient (most recent first)
    public List<ConsultationEntity> getConsultationsByPatientId(int patientId) {
        return crepo.findByPatient_PatientIdOrderByConsultationDateTimeDesc(patientId);
    }

    //update
    @SuppressWarnings("finally")
    public ConsultationEntity putConsultation(int id, ConsultationEntity newConsultationDetails) { 
        ConsultationEntity consultation = new ConsultationEntity();
        try{
            consultation = crepo.findById(id).get();
            consultation.setSymptoms(newConsultationDetails.getSymptoms());
            consultation.setDiagnosis(newConsultationDetails.getDiagnosis());
            consultation.setMedicinePrescribed(newConsultationDetails.getMedicinePrescribed());
            consultation.setRemarks(newConsultationDetails.getRemarks());
            consultation.setConsultationDate(newConsultationDetails.getConsultationDate());
        } catch (NoSuchElementException e){
            System.out.println("Consultation " + id + " does not exist");
        } finally {
            return crepo.save(consultation);
        }
    }

    //delete
    public String deleteConsultation(int consultationId) {
        crepo.deleteById(consultationId);
        return "Consultation removed! " + consultationId;
    }

}