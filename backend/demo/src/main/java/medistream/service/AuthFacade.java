package medistream.service;

import medistream.dto.request.LoginRequest;
import medistream.dto.request.RegisterRequest;
import medistream.dto.response.AuthResponse;
import medistream.entity.MedicalStaffEntity;
import medistream.entity.UserAccountEntity;
import medistream.repository.UserAccountRepository;
import medistream.repository.MedicalStaffRepository;
import medistream.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthFacade {

    private final UserAccountRepository userAccountRepository;
    private final MedicalStaffRepository medicalStaffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthFacade(UserAccountRepository userAccountRepository,
                      MedicalStaffRepository medicalStaffRepository,
                      PasswordEncoder passwordEncoder,
                      JwtUtils jwtUtils) {
        this.userAccountRepository = userAccountRepository;
        this.medicalStaffRepository = medicalStaffRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        // Validation
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.error("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return AuthResponse.error("Password is required");
        }
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            return AuthResponse.error("First name is required");
        }

        // Check existing email
        if (userAccountRepository.findByUsername(request.getEmail()).isPresent()) {
            return AuthResponse.error("Email already registered");
        }

        // Create user
        UserAccountEntity newUser = new UserAccountEntity();
        newUser.setUsername(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole() != null ? request.getRole() : "staff");

        // Create medical staff if not patient
        String role = newUser.getRole().toLowerCase();
        if (!role.equals("patient")) {
            MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
            medicalStaff.setName(request.getFirstName() + " " + request.getLastName());
            medicalStaff.setRole(role);
            medicalStaff.setContactNo("");
            medicalStaff.setSpecialty("");
            medicalStaff.setUserAccount(newUser);
            newUser.setMedicalStaff(medicalStaff);
        }

        UserAccountEntity savedUser = userAccountRepository.save(newUser);
        String token = jwtUtils.generateToken(savedUser);

        Map<String, Object> userData = buildUserData(savedUser, request.getFirstName(), request.getLastName());
        return AuthResponse.success("Registration successful", token, userData);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.error("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return AuthResponse.error("Password is required");
        }

        Optional<UserAccountEntity> userOpt = userAccountRepository.findByUsername(request.getEmail());
        if (userOpt.isEmpty()) {
            return AuthResponse.error("Invalid email or password");
        }

        UserAccountEntity user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return AuthResponse.error("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user);
        Map<String, Object> userData = buildUserData(user, null, null);
        return AuthResponse.success("Login successful", token, userData);
    }

    public boolean emailExists(String email) {
        return userAccountRepository.findByUsername(email).isPresent();
    }

    @Transactional
    public boolean changePassword(String username, String currentPassword, String newPassword, Integer accountId) {
        Optional<UserAccountEntity> userOpt = (accountId != null) ?
                userAccountRepository.findById(accountId) :
                userAccountRepository.findByUsername(username);

        if (userOpt.isEmpty()) return false;

        UserAccountEntity user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) return false;
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) return false;
        if (newPassword.length() < 6) return false;

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userAccountRepository.save(user);
        return true;
    }

    private Map<String, Object> buildUserData(UserAccountEntity user, String firstName, String lastName) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getAccountID());
        data.put("email", user.getUsername());
        data.put("role", user.getRole());
        if (firstName != null) data.put("firstName", firstName);
        if (lastName != null) data.put("lastName", lastName);
        if (user.getMedicalStaff() != null) {
            Map<String, Object> staffInfo = new HashMap<>();
            staffInfo.put("name", user.getMedicalStaff().getName());
            staffInfo.put("role", user.getMedicalStaff().getRole());
            data.put("medicalStaff", staffInfo);
        }
        return data;
    }
}