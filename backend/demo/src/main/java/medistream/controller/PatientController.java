package medistream.controller;

import medistream.core.entity.PatientEntity;
import medistream.entity.ConsultationEntity;
import medistream.core.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<PatientEntity> getPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientEntity> getPatient(@PathVariable int id) {
        return patientRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PatientEntity createPatient(@RequestBody PatientEntity patient) {
        if (patient.getStatus() == null || patient.getStatus().trim().isEmpty()) {
            patient.setStatus("Waiting");
        }
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientEntity> updatePatient(@PathVariable int id, @RequestBody PatientEntity updated) {
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
                return ResponseEntity.ok(patientRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
