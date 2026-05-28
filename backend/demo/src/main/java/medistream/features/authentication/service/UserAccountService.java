package medistream.features.authentication.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import medistream.features.authentication.dto.request.LoginRequest;
import medistream.features.authentication.dto.request.RegisterRequest;
import medistream.features.authentication.dto.response.AuthResponse;
import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.authentication.repository.UserAccountRepository;
import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.repository.MedicalStaffRepository;
import medistream.shared.security.JwtUtils;
import jakarta.transaction.Transactional;

@Service
public class UserAccountService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;
   
    public Optional<UserAccountEntity> findByUsername(String username) {
        return userAccountRepository.findByUsername(username);
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        try {
            // Check if username/email already exists
            if (userAccountRepository.findByUsername(registerRequest.getEmail()).isPresent()) {
                return AuthResponse.error("Email already registered");
            }

            // Create new user account
            UserAccountEntity userAccount = new UserAccountEntity();
            userAccount.setUsername(registerRequest.getEmail());
            userAccount.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
            userAccount.setRole(registerRequest.getRole());

            // Save to database
            UserAccountEntity savedUser = userAccountRepository.save(userAccount);

            String role = registerRequest.getRole().toLowerCase();
            if ("doctor".equals(role) || "nurse".equals(role)) {
                MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
                
                int nextStaffId;
                if (registerRequest.getIdNumber() != null && registerRequest.getIdNumber() > 0) {
                    if (medicalStaffRepository.existsById(registerRequest.getIdNumber())) {
                        return AuthResponse.error("Staff ID already exists");
                    }
                    nextStaffId = registerRequest.getIdNumber();
                } else {
                    nextStaffId = medicalStaffRepository.getMaxStaffID() + 1;
                }
                medicalStaff.setStaffID(nextStaffId);

                medicalStaff.setName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
                medicalStaff.setRole(registerRequest.getRole());
                medicalStaff.setSpecialty(""); 
                medicalStaff.setContactNo(registerRequest.getContactNo() != null ? registerRequest.getContactNo().trim() : ""); 
                medicalStaff.setUserAccount(savedUser);
                
                medicalStaffRepository.save(medicalStaff);
            }

            String jwtToken = jwtUtils.generateToken(savedUser);

            // Create response data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", savedUser.getAccountID());
            userData.put("email", savedUser.getUsername());
            userData.put("role", savedUser.getRole());
            userData.put("firstName", registerRequest.getFirstName());
            userData.put("lastName", registerRequest.getLastName());

            return AuthResponse.success("Registration successful", jwtToken, userData);
        } catch (Exception e) {
            e.printStackTrace();
            return AuthResponse.error("Registration failed: " + e.getMessage());
        }
    }

    // Login user
    public AuthResponse loginUser(LoginRequest loginRequest) {
        try {
            Optional<UserAccountEntity> userOptional = userAccountRepository.findByUsername(loginRequest.getEmail());
            
            if (userOptional.isEmpty()) {
                return AuthResponse.error("Invalid email or password");
            }

            UserAccountEntity user = userOptional.get();

            // Check password using PasswordEncoder
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return AuthResponse.error("Invalid email or password");
            }

            String jwtToken = jwtUtils.generateToken(user);

            // Create response data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getAccountID());
            userData.put("email", user.getUsername());
            userData.put("role", user.getRole());
            
            // Include medical staff info if exists
            if (user.getMedicalStaff() != null) {
                Map<String, Object> staffInfo = new HashMap<>();
                staffInfo.put("name", user.getMedicalStaff().getName());
                staffInfo.put("specialty", user.getMedicalStaff().getSpecialty());
                userData.put("medicalStaff", staffInfo);
            }

            return AuthResponse.success("Login successful", jwtToken, userData);
        } catch (Exception e) {
            e.printStackTrace();
            return AuthResponse.error("Login failed: " + e.getMessage());
        }
    }

    // Check if email exists - NO CHANGES
    public boolean emailExists(String email) {
        return userAccountRepository.findByUsername(email).isPresent();
    }

    // CHANGE PASSWORD - ADD THIS METHOD
    @Transactional
    public boolean changePassword(String username, String currentPassword, String newPassword, Integer accountId) {
        try {
            Optional<UserAccountEntity> userOptional;
            
            // Find user by account ID (preferred) or username
            if (accountId != null) {
                userOptional = userAccountRepository.findById(accountId);
            } else {
                userOptional = userAccountRepository.findByUsername(username);
            }
            
            if (userOptional.isEmpty()) {
                System.out.println("❌ User not found: username=" + username + ", accountId=" + accountId);
                return false;
            }
            
            UserAccountEntity user = userOptional.get();
            System.out.println("✅ Found user: " + user.getUsername() + ", ID: " + user.getAccountID());
            
            // Verify current password using PasswordEncoder (BCrypt)
            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                System.out.println("❌ Current password doesn't match");
                return false;
            }
            
            // Check if new password is same as current
            if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
                System.out.println("❌ New password must be different from current password");
                return false;
            }
            
            // Check password length
            if (newPassword.length() < 6) {
                System.out.println("❌ New password must be at least 6 characters");
                return false;
            }
            
            // Update password with BCrypt encoding
            String encodedNewPassword = passwordEncoder.encode(newPassword);
            user.setPasswordHash(encodedNewPassword);
            userAccountRepository.save(user);
            
            System.out.println("✅ Password updated successfully for user: " + user.getUsername());
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Error in changePassword: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error changing password: " + e.getMessage());
        }
    }

    // ========== YOUR EXISTING CRUD METHODS ==========
    
    // CREATE - NO CHANGES
    public UserAccountEntity addAccount(UserAccountEntity account) {
        // Encrypt password before saving
        if (account.getPasswordHash() != null && !account.getPasswordHash().startsWith("$2a$")) {
            account.setPasswordHash(passwordEncoder.encode(account.getPasswordHash()));
        }
        
        if (account.getMedicalStaff() != null) {
            MedicalStaffEntity medicalStaff = account.getMedicalStaff();
            if (medicalStaff.getStaffID() <= 0) {
                medicalStaff.setStaffID(medicalStaffRepository.getMaxStaffID() + 1);
            }
            medicalStaff.setUserAccount(account);
        }
        
        return userAccountRepository.save(account);
    }

    // CREATE with staff details - NO CHANGES (but consider updating it too)
    public UserAccountEntity createAccountWithStaff(UserAccountEntity account, String staffName, 
                                                   String staffRole, String contactNo, String specialty) {
        // Encrypt password
        if (account.getPasswordHash() != null && !account.getPasswordHash().startsWith("$2a$")) {
            account.setPasswordHash(passwordEncoder.encode(account.getPasswordHash()));
        }
        
        MedicalStaffEntity medicalStaff = new MedicalStaffEntity();
        medicalStaff.setStaffID(medicalStaffRepository.getMaxStaffID() + 1);
        medicalStaff.setName(staffName);
        medicalStaff.setRole(staffRole);
        medicalStaff.setContactNo(contactNo);
        medicalStaff.setSpecialty(specialty);    
        medicalStaff.setUserAccount(account);
        account.setMedicalStaff(medicalStaff);
        
        return userAccountRepository.save(account);
    }

    // READ ALL - NO CHANGES
    public List<UserAccountEntity> getAllAccounts() {
        return userAccountRepository.findAll();
    }

    // READ ONE - NO CHANGES
    public Optional<UserAccountEntity> getAccountById(int id) {
        return userAccountRepository.findById(id);
    }

    // READ by username - NO CHANGES
    public Optional<UserAccountEntity> getAccountByUsername(String username) {
        return userAccountRepository.findByUsername(username);
    }

    // UPDATE - NO CHANGES
    public UserAccountEntity updateAccount(int id, UserAccountEntity updatedAccount) {
        return userAccountRepository.findById(id).map(account -> {
            account.setUsername(updatedAccount.getUsername());
            
            // Only update password if provided and not already encrypted
            if (updatedAccount.getPasswordHash() != null && 
                !updatedAccount.getPasswordHash().startsWith("$2a$")) {
                account.setPasswordHash(passwordEncoder.encode(updatedAccount.getPasswordHash()));
            } else if (updatedAccount.getPasswordHash() != null) {
                account.setPasswordHash(updatedAccount.getPasswordHash());
            }
            
            account.setRole(updatedAccount.getRole());
            
            return userAccountRepository.save(account);
        }).orElse(null);
    }

    // DELETE - NO CHANGES
    public void deleteAccount(int id) {
        userAccountRepository.deleteById(id);
    }
}