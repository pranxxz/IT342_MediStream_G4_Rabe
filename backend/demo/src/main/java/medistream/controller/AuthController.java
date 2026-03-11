package medistream.controller;

import medistream.dto.request.LoginRequest;
import medistream.dto.request.RegisterRequest;
import medistream.dto.response.AuthResponse;
import medistream.entity.UserAccountEntity;
import medistream.entity.MedicalStaffEntity;
import medistream.repository.UserAccountRepository;
import medistream.security.JwtUtils;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Backend is working! Time: " + System.currentTimeMillis());
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
            System.out.println("🔐 Login attempt for: " + request.getEmail());
            
            // Validate
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password is required"));
            }
            
            // Find user
            Optional<UserAccountEntity> userOpt = userAccountRepository.findByUsername(request.getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));
            }

            UserAccountEntity user = userOpt.get();
            
            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));
            }

            String jwtToken = jwtUtils.generateToken(user);

            // Create response
            Map<String, Object> userData = createUserResponse(user);
            return ResponseEntity.ok(AuthResponse.success("Login successful", jwtToken, userData));
            
        } catch (Exception e) {
            System.err.println("🔥 Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.error("Login failed: " + e.getMessage()));
        }
    }

    // Register endpoint WITH EMAIL CHECK
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("📝 Registration attempt: " + request.getEmail());
            
            // Validate
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password is required"));
            }
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("First name is required"));
            }
            
            // ✅ CHECK IF EMAIL ALREADY EXISTS
            Optional<UserAccountEntity> existingUser = userAccountRepository.findByUsername(request.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthResponse.error("Email already registered. Please use a different email."));
            }

            // Hash password
            String hashedPassword = passwordEncoder.encode(request.getPassword());

            // Create new user
            UserAccountEntity newUser = new UserAccountEntity();
            newUser.setUsername(request.getEmail());
            newUser.setPasswordHash(hashedPassword);
            newUser.setRole(request.getRole() != null ? request.getRole() : "staff");
            
            // Create medical staff if not patient
            String role = request.getRole() != null ? request.getRole().toLowerCase() : "staff";
            if (!role.equals("patient")) {
                MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
                medicalStaff.setName(request.getFirstName() + " " + request.getLastName());
                medicalStaff.setRole(role);
                medicalStaff.setContactNo("");
                medicalStaff.setSpecialty("");
                medicalStaff.setUserAccount(newUser);
                newUser.setMedicalStaff(medicalStaff);
            }
            
            // Save to database
            UserAccountEntity savedUser = userAccountRepository.save(newUser);

            String jwtToken = jwtUtils.generateToken(savedUser);

            // Create response
            Map<String, Object> userData = createUserResponse(savedUser);
            userData.put("firstName", request.getFirstName());
            userData.put("lastName", request.getLastName());
            
           return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.success("Registration successful", jwtToken, userData));
            
        } catch (Exception e) {
            System.err.println("🔥 Registration error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    // Helper method
    private Map<String, Object> createUserResponse(UserAccountEntity user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getAccountID());
        response.put("email", user.getUsername());
        response.put("role", user.getRole());
        response.put("username", user.getUsername());
        
        if (user.getMedicalStaff() != null) {
            Map<String, Object> staffInfo = new HashMap<>();
            staffInfo.put("name", user.getMedicalStaff().getName());
            staffInfo.put("role", user.getMedicalStaff().getRole());
            staffInfo.put("specialty", user.getMedicalStaff().getSpecialty());
            staffInfo.put("contactNo", user.getMedicalStaff().getContactNo());
            response.put("medicalStaff", staffInfo);
        }
        
        return response;
    }

    // Simple redirect from frontend button to Spring's OAuth2 authorization endpoint.
    // We accept an optional mode parameter so the UI can distinguish login vs register.
    @GetMapping("/google")
    public void googleRedirect(@RequestParam(value = "mode", required = false) String mode,
                            @RequestParam(value = "prompt", required = false) String prompt,
                            @RequestParam(value = "returnTo", required = false) String returnTo,
                            HttpServletRequest request,     // ← This is automatically injected by Spring
                            HttpServletResponse response) 
                            throws java.io.IOException {
        
        System.out.println("🔍 /google endpoint called - mode: " + mode + ", prompt: " + prompt);
        
        String redirectUrl = "/oauth2/authorization/google";
        
        // Determine return URL (where to go back if user cancels)
        String returnUrl = null;
        if (returnTo != null && !returnTo.isEmpty()) {
            returnUrl = returnTo;
        } else {
            String referer = request.getHeader("Referer");
            if (referer != null && !referer.isEmpty()) {
                returnUrl = referer;
            }
        }

        // If we have a return URL, store it in a short-lived cookie so the failure handler can pick it up
        if (returnUrl != null && !returnUrl.isEmpty()) {
            String encoded = java.net.URLEncoder.encode(returnUrl, java.nio.charset.StandardCharsets.UTF_8);
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("oauth_return", encoded);              cookie.setPath("/");
            cookie.setMaxAge(300); // 5 minutes
            response.addCookie(cookie);
        }

        // Build query parameters
        java.util.Map<String, String> params = new java.util.HashMap<>();
        
        // Force account selection - this is the key parameter
        String promptValue = (prompt != null && !prompt.isEmpty()) ? prompt : "select_account";
        params.put("prompt", promptValue);
        System.out.println("✅ Using prompt: " + promptValue);
        
        if (mode != null) {
            params.put("mode", mode);
        }
        
        // Add anti-cache parameter
        params.put("_", String.valueOf(System.currentTimeMillis()));
        
        // Build URL with parameters
        if (!params.isEmpty()) {
            redirectUrl += "?" + params.entrySet().stream()
                .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                .collect(java.util.stream.Collectors.joining("&"));
        }
        
        System.out.println("➡️ Redirecting to: " + redirectUrl);
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
