package medistream.features.patient.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medistream.features.patient.entity.PatientEntity;
import medistream.features.patient.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public PatientEntity createPatient(PatientEntity patient) {
        if (patient.getStatus() == null || patient.getStatus().trim().isEmpty()) {
            patient.setStatus("Waiting");
        }
        return patientRepository.save(patient);
    }

    public List<PatientEntity> getAllPatients() {
        return patientRepository.findAll();
    }

    public PatientEntity getPatientById(int id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public PatientEntity updatePatient(int id, PatientEntity updated) {
        return patientRepository.findById(id)
            .map(existing -> {
                existing.setFirstName(updated.getFirstName());
                existing.setLastName(updated.getLastName());
                existing.setAge(updated.getAge());
                existing.setGender(updated.getGender());
                existing.setAddress(updated.getAddress());
                existing.setContactNumber(updated.getContactNumber());
                existing.setStatus(updated.getStatus());
                existing.setAssignedDoctor(updated.getAssignedDoctor());
                existing.setLastVisit(updated.getLastVisit());
                return patientRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void deletePatient(int id) {
        patientRepository.deleteById(id);
    }

    public PatientEntity savePatient(PatientEntity patient) {
        return patientRepository.save(patient);
    }
}
