package medistream.features.authentication.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import medistream.features.authentication.dto.request.RegisterRequest;
import medistream.features.authentication.dto.response.AuthResponse;
import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.authentication.repository.UserAccountRepository;
import medistream.shared.security.JwtUtils;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    // AuthController injects these directly — all three must be mocked
    @MockBean private UserAccountRepository userAccountRepository;
    @MockBean private PasswordEncoder passwordEncoder;
    @MockBean private JwtUtils jwtUtils;

    // TC-01: Valid Registration — returns 201
    @Test
    @WithMockUser
    void registerWithValidData_returns201() throws Exception {
        // Email not taken
        when(userAccountRepository.findByUsername("newuser@medistream.ph"))
                .thenReturn(Optional.empty());

        // Simulate saving — return a user with an ID
        UserAccountEntity saved = new UserAccountEntity();
        saved.setUsername("newuser@medistream.ph");
        saved.setRole("staff");
        when(userAccountRepository.save(any(UserAccountEntity.class))).thenReturn(saved);

        // JWT generation
        when(jwtUtils.generateToken(any(UserAccountEntity.class))).thenReturn("mocked-jwt-token");

        var body = Map.of(
            "email", "newuser@medistream.ph",
            "password", "Secure@123",
            "firstName", "New",
            "lastName", "User",
            "role", "staff"
        );

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
                .andExpect(status().isCreated());
    }

    // TC-06: Wrong password login → 401
    @Test
    @WithMockUser
    void loginWithWrongPassword_returns401() throws Exception {
        UserAccountEntity user = new UserAccountEntity();
        user.setUsername("admin@medistream.ph");
        user.setPasswordHash("hashed-correct-password");

        when(userAccountRepository.findByUsername("admin@medistream.ph"))
                .thenReturn(Optional.of(user));

        // passwordEncoder.matches() returns false → wrong password
        when(passwordEncoder.matches("WrongPass", "hashed-correct-password"))
                .thenReturn(false);

        var body = Map.of(
            "email", "admin@medistream.ph",
            "password", "WrongPass"
        );

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }

    // TC-03: Email availability — email does NOT exist → returns false (not taken)
    @Test
    @WithMockUser
    void checkEmail_notTaken_returnsFalse() throws Exception {
        // Controller returns: exists = findByUsername(...).isPresent()
        // So for a fresh email → isPresent() = false → response body = false
        when(userAccountRepository.findByUsername("fresh@test.ph"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/auth/check-email/fresh@test.ph"))
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // plain boolean, not JSON object
    }

    // TC-04: Email already taken → returns true
    @Test
    @WithMockUser
    void checkEmail_alreadyTaken_returnsTrue() throws Exception {
        UserAccountEntity existing = new UserAccountEntity();
        existing.setUsername("taken@medistream.ph");

        when(userAccountRepository.findByUsername("taken@medistream.ph"))
                .thenReturn(Optional.of(existing));

        mockMvc.perform(get("/api/auth/check-email/taken@medistream.ph"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    // TC-09: Health check endpoint
    @Test
    @WithMockUser
    void healthCheck_returnsUp() throws Exception {
        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}