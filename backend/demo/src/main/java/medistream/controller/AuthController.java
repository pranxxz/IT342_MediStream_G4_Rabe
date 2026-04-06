package medistream.controller;

import medistream.dto.request.LoginRequest;
import medistream.dto.request.RegisterRequest;
import medistream.dto.response.AuthResponse;
import medistream.entity.UserAccountEntity;
import medistream.entity.MedicalStaffEntity;
import medistream.repository.UserAccountRepository;
import medistream.security.JwtUtils;
import medistream.service.AuthFacade;

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

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Backend is working!");
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        return ResponseEntity.ok(authFacade.emailExists(email));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authFacade.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authFacade.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    // // Helper method
    // private Map<String, Object> createUserResponse(UserAccountEntity user) {
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("id", user.getAccountID());
    //     response.put("email", user.getUsername());
    //     response.put("role", user.getRole());
    //     response.put("username", user.getUsername());
        
    //     if (user.getMedicalStaff() != null) {
    //         Map<String, Object> staffInfo = new HashMap<>();
    //         staffInfo.put("name", user.getMedicalStaff().getName());
    //         staffInfo.put("role", user.getMedicalStaff().getRole());
    //         staffInfo.put("specialty", user.getMedicalStaff().getSpecialty());
    //         staffInfo.put("contactNo", user.getMedicalStaff().getContactNo());
    //         response.put("medicalStaff", staffInfo);
    //     }
        
    //     return response;
    // }

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
