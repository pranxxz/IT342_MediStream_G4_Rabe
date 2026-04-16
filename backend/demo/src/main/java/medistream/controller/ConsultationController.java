package medistream.controller;

import medistream.entity.ConsultationEntity;
import medistream.entity.PatientEntity;
import medistream.repository.ConsultationRepository;
import medistream.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<ConsultationEntity> getConsultations() {
        return consultationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ConsultationEntity> createConsultation(@RequestBody ConsultationEntity consultation) {
        try {
            if (consultation.getPatient() != null && consultation.getPatient().getPatientId() > 0) {
                PatientEntity patient = patientRepository.findById(consultation.getPatient().getPatientId())
                        .orElse(null);
                if (patient != null) {
                    consultation.setPatient(patient);
                }
            }
            
            if (consultation.getStatus() == null || consultation.getStatus().trim().isEmpty()) {
                consultation.setStatus("Completed");
            }
            
            ConsultationEntity saved = consultationRepository.save(consultation);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
