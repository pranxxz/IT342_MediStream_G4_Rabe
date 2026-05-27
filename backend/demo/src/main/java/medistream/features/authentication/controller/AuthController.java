package medistream.features.authentication.controller;

import medistream.features.authentication.dto.request.LoginRequest;
import medistream.features.authentication.dto.request.RegisterRequest;
import medistream.features.authentication.dto.response.AuthResponse;
import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.authentication.repository.UserAccountRepository;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.repository.MedicalStaffRepository;
import medistream.shared.security.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // ✅ Allows emulator (10.0.2.2) and any origin
public class AuthController {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working! Time: " + System.currentTimeMillis());
    }

    // Check if email exists
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        boolean exists = userAccountRepository.findByUsername(email).isPresent();
        return ResponseEntity.ok(exists);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for: " + request.getEmail());

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password is required"));
            }

            Optional<UserAccountEntity> userOpt = userAccountRepository.findByUsername(request.getEmail().trim());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));
            }

            UserAccountEntity user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));
            }

            // ✅ generateToken only after user is confirmed valid
            String jwtToken = jwtUtils.generateToken(user);
            Map<String, Object> userData = createUserResponse(user);
            return ResponseEntity.ok(AuthResponse.success("Login successful", jwtToken, userData));

        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            System.err.println("Login error: " + msg);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.error("Login failed: " + msg));
        }
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("Registration attempt: " + request.getEmail());

            // Validate required fields
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password is required"));
            }
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("First name is required"));
            }

            // Check duplicate email
            Optional<UserAccountEntity> existingUser = userAccountRepository.findByUsername(request.getEmail().trim());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthResponse.error("Email already registered. Please use a different email."));
            }

            // Hash password
            String hashedPassword = passwordEncoder.encode(request.getPassword());

            // Build user entity
            UserAccountEntity newUser = new UserAccountEntity();
            newUser.setUsername(request.getEmail().trim());
            newUser.setPasswordHash(hashedPassword);

            String role = (request.getRole() != null && !request.getRole().trim().isEmpty())
                ? request.getRole().trim().toLowerCase()
                : "staff";
            newUser.setRole(role);

            // Build medical staff if not patient
            if (!role.equals("patient")) {
                MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
                
                int nextStaffId;
                if (request.getIdNumber() != null && request.getIdNumber() > 0) {
                    if (medicalStaffRepository.existsById(request.getIdNumber())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(AuthResponse.error("Staff ID already exists. Please use a unique Staff ID."));
                    }
                    nextStaffId = request.getIdNumber();
                } else {
                    nextStaffId = medicalStaffRepository.getMaxStaffID() + 1;
                }
                medicalStaff.setStaffID(nextStaffId);

                String firstName = request.getFirstName() != null ? request.getFirstName().trim() : "";
                String lastName = request.getLastName() != null ? request.getLastName().trim() : "";
                medicalStaff.setName((firstName + " " + lastName).trim());
                medicalStaff.setRole(role);
                medicalStaff.setContactNo("");
                medicalStaff.setSpecialty("");
                medicalStaff.setUserAccount(newUser);
                newUser.setMedicalStaff(medicalStaff);
            }

            // ✅ Save first so the entity gets its DB-generated ID
            UserAccountEntity savedUser = userAccountRepository.save(newUser);

            // ✅ Generate JWT only after save so ID is never null
            String jwtToken = jwtUtils.generateToken(savedUser);

            Map<String, Object> userData = createUserResponse(savedUser);
            userData.put("firstName", request.getFirstName() != null ? request.getFirstName().trim() : "");
            userData.put("lastName", request.getLastName() != null ? request.getLastName().trim() : "");

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.success("Registration successful", jwtToken, userData));

        } catch (Exception e) {
            // ✅ Never swallow a null message — always show the real exception type
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            System.err.println("Registration error: " + msg);
            e.printStackTrace(); // Full stack trace in Spring Boot console — check this!
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.error("Registration failed: " + msg));
        }
    }

    // Helper
    private Map<String, Object> createUserResponse(UserAccountEntity user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getAccountID());
        response.put("email", user.getUsername());
        response.put("role", user.getRole());
        response.put("username", user.getUsername());
        response.put("profilePicturePath", user.getProfilePicturePath());
        if (user.getProfilePicturePath() != null) {
            response.put("profilePictureUrl", "/api/users/" + user.getAccountID() + "/profile-picture");
        } else {
            response.put("profilePictureUrl", null);
        }

        if (user.getMedicalStaff() != null) {
            Map<String, Object> staffInfo = new HashMap<>();
            staffInfo.put("staffID", user.getMedicalStaff().getStaffID());
            staffInfo.put("name", user.getMedicalStaff().getName());
            staffInfo.put("role", user.getMedicalStaff().getRole());
            staffInfo.put("specialty", user.getMedicalStaff().getSpecialty());
            staffInfo.put("contactNo", user.getMedicalStaff().getContactNo());
            response.put("medicalStaff", staffInfo);
        }

        return response;
    }

    // Google OAuth redirect
    @GetMapping("/google")
    public void googleRedirect(@RequestParam(value = "mode", required = false) String mode,
                               @RequestParam(value = "prompt", required = false) String prompt,
                               @RequestParam(value = "returnTo", required = false) String returnTo,
                               HttpServletRequest request,
                               HttpServletResponse response)
                               throws java.io.IOException {

        String redirectUrl = "/oauth2/authorization/google";

        String returnUrl = null;
        if (returnTo != null && !returnTo.isEmpty()) {
            returnUrl = returnTo;
        } else {
            String referer = request.getHeader("Referer");
            if (referer != null && !referer.isEmpty()) {
                returnUrl = referer;
            }
        }

        if (returnUrl != null && !returnUrl.isEmpty()) {
            String encoded = java.net.URLEncoder.encode(returnUrl, java.nio.charset.StandardCharsets.UTF_8);
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("oauth_return", encoded);
            cookie.setPath("/");
            cookie.setMaxAge(300);
            response.addCookie(cookie);
        }

        java.util.Map<String, String> params = new java.util.HashMap<>();
        String promptValue = (prompt != null && !prompt.isEmpty()) ? prompt : "select_account";
        params.put("prompt", promptValue);

        if (mode != null) {
            params.put("mode", mode);
        }

        params.put("_", String.valueOf(System.currentTimeMillis()));

        redirectUrl += "?" + params.entrySet().stream()
            .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
            .collect(java.util.stream.Collectors.joining("&"));

        response.sendRedirect(redirectUrl);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Authentication Service");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}