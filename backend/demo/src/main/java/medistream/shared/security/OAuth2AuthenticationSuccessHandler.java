package medistream.shared.security;

import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.authentication.repository.UserAccountRepository;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                       Authentication authentication) throws IOException, ServletException {
        
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        
        System.out.println("✅ OAuth2 Success - Email: " + email);
        System.out.println("🔍 Request URL: " + request.getRequestURL());
        System.out.println("🔍 Request URI: " + request.getRequestURI());
        
        try {
            Optional<UserAccountEntity> userOpt = userAccountRepository.findByUsername(email);
            UserAccountEntity user;
            
            if (userOpt.isEmpty()) {
                user = new UserAccountEntity();
                user.setUsername(email);
                user.setPasswordHash("oauth2_" + System.currentTimeMillis());
                user.setRole("staff");

                MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
                medicalStaff.setName(name != null ? name : email);
                medicalStaff.setRole("staff");
                medicalStaff.setContactNo("");
                medicalStaff.setSpecialty("");
                medicalStaff.setUserAccount(user);
                user.setMedicalStaff(medicalStaff);

                user = userAccountRepository.save(user);
                System.out.println("✅ New OAuth2 user created: " + email);
            } else {
                user = userOpt.get();
                System.out.println("✅ Existing OAuth2 user logged in: " + email);
            }
            
            String jwtToken = jwtUtils.generateToken(user);
            System.out.println("✅ JWT Token generated");
            
            // include mode parameter if present (login vs register)
        String mode = request.getParameter("mode");
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth/callback")
                    .queryParam("token", jwtToken)
                    .queryParam("email", email)
                    .queryParam("role", user.getRole())
                    .queryParam("name", name != null ? java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8.toString()) : "")
                    .queryParam("accountId", user.getAccountID())
                    .queryParam("staffId", user.getMedicalStaff() != null ? user.getMedicalStaff().getStaffID() : "");
        if (mode != null && !mode.isEmpty()) {
            builder.queryParam("mode", mode);
        }
        String redirectUrl = builder.build().toUriString();
            
            System.out.println("➡️ Redirecting to: " + redirectUrl);
            
            // Clear any existing authentication
            response.setStatus(HttpServletResponse.SC_FOUND);
            response.setHeader("Location", redirectUrl);
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            System.err.println("🔥 OAuth2 Error: " + e.getMessage());
            e.printStackTrace();
            
            String errorUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                    .queryParam("error", "oauth2_failed")
                    .queryParam("message", e.getMessage())
                    .build()
                    .toUriString();
            
            response.sendRedirect(errorUrl);
        }
    }
}
