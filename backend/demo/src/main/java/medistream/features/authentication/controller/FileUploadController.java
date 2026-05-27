package medistream.features.authentication.controller;

import lombok.extern.slf4j.Slf4j;
import medistream.features.authentication.entity.UserAccountEntity;
import medistream.features.authentication.repository.UserAccountRepository;
import medistream.features.authentication.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Slf4j
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    /**
     * Upload profile picture for user.
     * POST /api/users/{userId}/profile-picture
     */
    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {

        log.info("Received request to upload profile picture for user ID: {}", userId);

        // Verify if user exists
        Optional<UserAccountEntity> userOpt = userAccountRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.error("User not found with ID: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with ID: " + userId));
        }

        UserAccountEntity user = userOpt.get();

        try {
            // Save file and get relative path
            String storedPath = fileStorageService.storeFile(file, userId);

            // Update user record in DB
            user.setProfilePicturePath(storedPath);
            userAccountRepository.save(user);
            log.info("Successfully updated profilePicturePath in DB for user ID: {}", userId);

            // Generate file URL (using the GET endpoint we expose below)
            String fileUrl = "/api/users/" + userId + "/profile-picture";
            
            // Build response payload
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile picture uploaded successfully!");
            response.put("url", fileUrl);
            response.put("path", storedPath);
            
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid file input during profile upload for user ID: {}", userId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error occurred while processing profile upload for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not upload profile picture: " + e.getMessage()));
        }
    }

    /**
     * Serve profile picture as resource.
     * GET /api/users/{userId}/profile-picture
     */
    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable Integer userId) {
        log.info("Received request to fetch profile picture for user ID: {}", userId);

        // Fetch user from database
        Optional<UserAccountEntity> userOpt = userAccountRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getProfilePicturePath() == null) {
            log.warn("Profile picture not found for user ID: {}", userId);
            return ResponseEntity.notFound().build();
        }

        String storedPath = userOpt.get().getProfilePicturePath();
        log.debug("Found stored profile picture path in DB: {}", storedPath);

        try {
            // Resolve file path using NIO Paths
            Path filePath = Paths.get(storedPath).toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type dynamically
                String contentType = "image/jpeg"; // default fallback
                String filename = filePath.getFileName().toString().toLowerCase();
                
                if (filename.endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.endsWith(".webp")) {
                    contentType = "image/webp";
                }

                log.info("Serving profile picture file '{}' with Content-Type: {}", filename, contentType);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.error("File exists in DB path but is not readable or missing on disk: {}", storedPath);
                return ResponseEntity.notFound().build();
            }

        } catch (MalformedURLException e) {
            log.error("Malformed URL exception reading profile picture for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
