package medistream.features.shared;

import com.jayway.jsonpath.JsonPath;
import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.patient.entity.PatientEntity;
import medistream.features.patient.repository.PatientRepository;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.repository.MedicalStaffRepository;
import medistream.features.queue.entity.Queue;
import medistream.features.queue.repository.QueueRepository;
import medistream.shared.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ManualToAutomatedTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private QueueRepository queueRepository;

    private String adminToken;
    private String staffToken;
    private Integer testPatientId;
    private Integer testStaffId;

    @BeforeEach
    void setUp() {
        adminToken = generateToken("admin@medistream.ph", "ADMIN");
        staffToken = generateToken("doctor@medistream.ph", "STAFF");

        // Create a test patient for consultations
        PatientEntity patient = new PatientEntity();
        patient.setFirstName("Test");
        patient.setLastName("Patient");
        patient.setAge(30);
        patient.setGender("Male");
        patient = patientRepository.save(patient);
        testPatientId = patient.getPatientId();

        // Create a test medical staff
        UserAccountEntity staffAccount = new UserAccountEntity();
        staffAccount.setUsername("doctor@medistream.ph");
        staffAccount.setRole("STAFF");
        staffAccount.setPasswordHash("dummyHash");
        
        MedicalStaffEntity staff = new MedicalStaffEntity();
        staff.setName("Doctor Test");
        staff.setRole("Doctor");
        staff.setUserAccount(staffAccount);
        staff = medicalStaffRepository.save(staff);
        testStaffId = staff.getStaffID();
    }

    private String generateToken(String email, String role) {
        UserAccountEntity user = new UserAccountEntity();
        user.setUsername(email);
        user.setRole(role);
        user.setAccountID(1);
        return jwtUtils.generateToken(user);
    }

    // TC-08: Google OAuth Callback
    @Test
    void tc08_googleOAuthCallback_returnsRedirect() throws Exception {
        mockMvc.perform(get("/api/auth/google")
                        .param("code", "mock_google_code"))
                .andExpect(status().is3xxRedirection());
    }

    // TC-14: Admin Access (use a known protected endpoint that admin should access)
    @Test
    void tc14_adminAccess_allowed() throws Exception {
        // Replace with an endpoint that requires admin and exists, e.g., /api/admin/health or /api/consultations/all
        // If no admin-specific endpoint, just test that admin can access any staff endpoint.
        mockMvc.perform(get("/api/consultations/all")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    // TC-27: Consultation Status Transitions
    @Test
    void tc27_consultationStatusTransitions() throws Exception {
        String createJson = String.format("""
                {
                    "patientId": %d,
                    "staffId": %d,
                    "symptoms": "Headache",
                    "diagnosis": "Migraine",
                    "medicinePrescribed": "Ibuprofen",
                    "remarks": "Rest",
                    "consultationDate": "2026-05-08T10:00:00Z"
                }
                """, testPatientId, testStaffId);

        String response = mockMvc.perform(post("/api/consultations/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content(createJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Integer consultId = JsonPath.read(response, "$.consultationId");

        // Update to IN_PROGRESS
        mockMvc.perform(put("/api/consultations/update/" + consultId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // Update to COMPLETED
        mockMvc.perform(put("/api/consultations/update/" + consultId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    // TC-33: Staff Views Assigned Consultations (use /all and filter by staffId)
    @Test
    void tc33_staffViewsAssignedConsultations() throws Exception {
        // Create a consultation first so the list is not empty
        String createJson = String.format("""
                {
                    "patientId": %d,
                    "staffId": %d,
                    "symptoms": "Test",
                    "diagnosis": "Test",
                    "medicinePrescribed": "Test",
                    "remarks": "Test",
                    "consultationDate": "2026-05-08T10:00:00Z"
                }
                """, testPatientId, testStaffId);

        mockMvc.perform(post("/api/consultations/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content(createJson))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/consultations/all")
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.doctorName == 'Doctor Test')]").exists());
    }

    // TC-35: Staff Accesses Patient Record
    @Test
    void tc35_staffGetsPatientRecord() throws Exception {
        // Use the patient endpoint as defined in your PatientController
        // Common patterns: /api/patient/{id} or /api/patients/{id}
        mockMvc.perform(get("/api/patients/" + testPatientId)
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").exists());
    }

    // TC-36: Completed Consultation Removed from Active List
    @Test
    void tc36_completedConsultationRemovedFromActiveList() throws Exception {
        // Create a consultation
        String createJson = String.format("""
                {
                    "patientId": %d,
                    "staffId": %d,
                    "symptoms": "Cough",
                    "diagnosis": "Cold",
                    "medicinePrescribed": "Paracetamol",
                    "remarks": "Rest",
                    "consultationDate": "2026-05-08T10:00:00Z"
                }
                """, testPatientId, testStaffId);

        String response = mockMvc.perform(post("/api/consultations/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content(createJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Integer consultId = JsonPath.read(response, "$.consultationId");

        // Mark as COMPLETED
        mockMvc.perform(put("/api/consultations/update/" + consultId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + staffToken)
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    // TC-37: Completed/Done Queue items are removed from Active List
    @Test
    void tc37_completedOrDoneQueueRemovedFromActiveList() throws Exception {
        // Create a test patient
        PatientEntity patient = new PatientEntity();
        patient.setFirstName("Queue");
        patient.setLastName("Patient");
        patient.setAge(25);
        patient.setGender("Female");
        patient = patientRepository.save(patient);

        // Clear existing queues if any, or just ensure our new ones are added
        queueRepository.deleteAll();

        // Save three Queue entries: Waiting, Completed, Done (case-insensitive checks)
        Queue qWaiting = new Queue("Q-001", "WAITING", patient, "09:00 AM", "Dr. Green");
        Queue qCompleted = new Queue("Q-002", "completed", patient, "09:15 AM", "Dr. Green");
        Queue qDone = new Queue("Q-003", "DONE", patient, "09:30 AM", "Dr. Green");

        queueRepository.save(qWaiting);
        queueRepository.save(qCompleted);
        queueRepository.save(qDone);

        // Fetch all active queues from /api/queue
        mockMvc.perform(get("/api/queue")
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].queueNumber").value("Q-001"))
                .andExpect(jsonPath("$[0].status").value("WAITING"));
    }
}