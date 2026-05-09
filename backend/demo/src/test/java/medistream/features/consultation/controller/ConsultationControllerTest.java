package medistream.features.consultation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import medistream.features.consultation.entity.ConsultationEntity;
import medistream.features.consultation.service.ConsultationService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConsultationController.class)
class ConsultationControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private ConsultationService cservice;

    // TC-21: Create consultation
    // Note: addConsultation() returns ConsultationEntity directly (no ResponseEntity),
    // so Spring defaults to 200 OK — test reflects the actual controller behavior
    @Test
    @WithMockUser
    void createConsultation_validPayload_returns200() throws Exception {
        ConsultationEntity saved = new ConsultationEntity();
        saved.setSymptoms("Fever");
        saved.setDiagnosis("Flu");
        saved.setRemarks("Rest and fluids");

        when(cservice.saveConsultation(anyInt(), anyInt(), any(ConsultationEntity.class)))
                .thenReturn(saved);

        var payload = new HashMap<String, Object>();
            payload.put("patientId", 1);
            payload.put("staffId", 2);
            payload.put("symptoms", "Fever");
            payload.put("diagnosis", "Flu");
            payload.put("medicinePrescribed", "Paracetamol");
            payload.put("remarks", "Rest and fluids");
            payload.put("consultationDate", "2026-05-07T10:00:00+08:00"); 

        mockMvc.perform(post("/api/consultations/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(payload)))
                .andExpect(status().isOk()); // controller returns 200, not 201
    }

    // TC-23: List all consultations
    @Test
    @WithMockUser
    void getAllConsultations_returnsOkAndList() throws Exception {
        // Service returns empty list — controller wraps it; no DB needed
        when(cservice.getAllConsultations()).thenReturn(List.of());

        mockMvc.perform(get("/api/consultations/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // TC-24: Query consultations by patient ID
    @Test
    @WithMockUser
    void getByPatient_validId_returnsOk() throws Exception {
        when(cservice.getConsultationsByPatientId(1)).thenReturn(List.of());

        mockMvc.perform(get("/api/consultations/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // TC-25: Query non-existent patient — service returns empty list, controller returns 200 []
    @Test
    @WithMockUser
    void getByPatient_nonExistent_returnsEmptyList() throws Exception {
        when(cservice.getConsultationsByPatientId(99999)).thenReturn(List.of());

        mockMvc.perform(get("/api/consultations/patient/99999"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}