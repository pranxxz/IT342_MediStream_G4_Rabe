package medistream.features.consultation.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import medistream.features.consultation.dto.request.ConsultationRequest;
import medistream.features.consultation.entity.ConsultationEntity;
import medistream.features.consultation.service.ConsultationService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {
    
    @Autowired
    private ConsultationService cservice;

    @PostMapping("/add")
    public ConsultationEntity addConsultation(@RequestBody ConsultationRequest request) { 
        ConsultationEntity consultationEntity = new ConsultationEntity();
        
        // Mapping properties from the Request object to the Entity
        consultationEntity.setSymptoms(request.getSymptoms());
        consultationEntity.setDiagnosis(request.getDiagnosis());
        consultationEntity.setMedicinePrescribed(request.getMedicinePrescribed());
        consultationEntity.setRemarks(request.getRemarks());
        consultationEntity.setConsultationDate(request.getConsultationDate());
        
        // Pass the ID and the entity to the service
        return cservice.saveConsultation(request.getPatientId(), request.getStaffId(), consultationEntity);
    }
    
    @GetMapping("/all")
    public List<Map<String, Object>> getAllConsultations() {
        try {
            List<ConsultationEntity> list = cservice.getAllConsultations();
            return list.stream().map(c -> {
                Map<String, Object> m = new HashMap<>();
                
                // Flat properties
                m.put("consultationId", c.getConsultationId());
                m.put("diagnosis", c.getDiagnosis());
                m.put("remarks", c.getRemarks());
                m.put("consultationDate", c.getConsultationDate() != null ? c.getConsultationDate().toString() : "No Date");

                // Safely get Doctor Name
                String doctor = c.getDoctorName();
                if (c.getMedicalStaff() != null && c.getMedicalStaff().getName() != null && !c.getMedicalStaff().getName().trim().isEmpty()) {
                    doctor = c.getMedicalStaff().getName();
                }
                m.put("doctorName", doctor != null ? doctor : "Unassigned");

                // Safely get Patient details and flatten them
                if (c.getPatient() != null) {
                    m.put("patientId", c.getPatient().getPatientId());
                    m.put("age", c.getPatient().getAge());
                    
                    String fn = c.getPatient().getFirstName() != null ? c.getPatient().getFirstName().trim() : "";
                    String ln = c.getPatient().getLastName() != null ? c.getPatient().getLastName().trim() : "";
                    String fullName = (fn + " " + ln).trim();
                    
                    m.put("patientName", fullName.isEmpty() ? "Unknown Patient" : fullName);
                } else {
                    m.put("patientId", "N/A");
                    m.put("age", "-");
                    m.put("patientName", "Unknown Patient");
                }
                
                return m;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
    
    @PutMapping("/update/{id}")
    public ConsultationEntity putConsultation(@PathVariable int id, @RequestBody ConsultationEntity consultation) {
        return cservice.putConsultation(id, consultation);        
    }

    @DeleteMapping("/delete/{id}")
    public String deleteConsultation(@PathVariable int id) {
        return cservice.deleteConsultation(id);
    }

    // Get consultations for a specific patient (Synchronized with /all)
    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getConsultationsByPatient(@PathVariable int patientId) {
        try {
            List<ConsultationEntity> list = cservice.getConsultationsByPatientId(patientId);
            return list.stream().map(c -> {
                Map<String, Object> m = new HashMap<>();
                
                m.put("consultationId", c.getConsultationId());
                m.put("diagnosis", c.getDiagnosis());
                m.put("remarks", c.getRemarks());
                m.put("consultationDate", c.getConsultationDate() != null ? c.getConsultationDate().toString() : "No Date");

                String doctor = c.getDoctorName();
                if (c.getMedicalStaff() != null && c.getMedicalStaff().getName() != null && !c.getMedicalStaff().getName().trim().isEmpty()) {
                    doctor = c.getMedicalStaff().getName();
                }
                m.put("doctorName", doctor != null ? doctor : "Unassigned");

                if (c.getPatient() != null) {
                    m.put("patientId", c.getPatient().getPatientId());
                    m.put("age", c.getPatient().getAge());
                    
                    String fn = c.getPatient().getFirstName() != null ? c.getPatient().getFirstName().trim() : "";
                    String ln = c.getPatient().getLastName() != null ? c.getPatient().getLastName().trim() : "";
                    String fullName = (fn + " " + ln).trim();
                    
                    m.put("patientName", fullName.isEmpty() ? "Unknown Patient" : fullName);
                } else {
                    m.put("patientId", "N/A");
                    m.put("age", "-");
                    m.put("patientName", "Unknown Patient");
                }
                
                return m;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching consultations for patient " + patientId + ": " + e.getMessage());
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
}