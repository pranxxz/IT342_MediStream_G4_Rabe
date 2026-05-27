package medistream.features.queue.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import medistream.features.queue.entity.Queue;
import medistream.features.queue.service.QueueService;
import medistream.features.patient.entity.PatientEntity;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QueueController.class)
class QueueControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private QueueService queueService;

    // TC-28: Patient joins queue
    // joinQueue() expects PatientQueueRequest body with patient info fields,
    // and returns { queueNumber, patientName, status, estimatedTime }
    @Test
    @WithMockUser
    void joinQueue_validRequest_returns200WithQueueNumber() throws Exception {
        // Build a mock Queue response matching what the controller builds
        PatientEntity patient = new PatientEntity();
        patient.setFullName("Juan Dela Cruz");

        Queue mockQueue = new Queue();
        mockQueue.setQueueNumber("Q-001");
        mockQueue.setStatus("WAITING");
        mockQueue.setPatient(patient);

        when(queueService.joinQueue(any())).thenReturn(mockQueue);

        // Fields match PatientQueueRequest fields used in QueueService.joinQueue()
        var body = Map.of(
            "firstName", "Juan",
            "lastName", "Dela Cruz",
            "age", 30,
            "gender", "Male",
            "contactNumber", "09123456789",
            "address", "Cebu City"
        );

        mockMvc.perform(post("/api/queue/join")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.queueNumber").value("Q-001"))
                .andExpect(jsonPath("$.status").value("WAITING"))
                .andExpect(jsonPath("$.estimatedTime").value("15 mins"));
    }

    // TC-30: Staff views all queues
    @Test
    @WithMockUser
    void getAllQueues_returnsOkAndList() throws Exception {
        when(queueService.getAllQueues()).thenReturn(List.of());

        mockMvc.perform(get("/api/queue"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // TC-31: Queue join fails gracefully when service throws
    @Test
    @WithMockUser
    void joinQueue_serviceThrows_returnsBadRequest() throws Exception {
        when(queueService.joinQueue(any()))
                .thenThrow(new RuntimeException("Patient not found"));

        var body = Map.of(
            "firstName", "Unknown",
            "lastName", "Patient",
            "age", 0,
            "gender", "Male",
            "contactNumber", "",
            "address", ""
        );

        mockMvc.perform(post("/api/queue/join")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}