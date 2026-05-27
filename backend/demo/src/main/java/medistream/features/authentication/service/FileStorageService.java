package medistream.features.authentication.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Validates and stores a profile picture.
     *
     * @param file   the multipart file to store
     * @param userId the ID of the user uploading the file
     * @return the relative path of the stored file
     */
    public String storeFile(MultipartFile file, Integer userId) {
        log.info("Starting file storage process for user ID: {}", userId);

        // Validate that file is not empty
        if (file.isEmpty()) {
            log.error("Failed to store empty file for user ID: {}", userId);
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        // Validate MIME type
        String contentType = file.getContentType();
        log.debug("File content type: {}", contentType);
        if (contentType == null || (!contentType.equals("image/jpeg") && 
                                    !contentType.equals("image/png") && 
                                    !contentType.equals("image/webp"))) {
            log.error("Invalid content type '{}' for user ID: {}", contentType, userId);
            throw new IllegalArgumentException("Only image/jpeg, image/png, and image/webp formats are allowed.");
        }

        // Extract original file extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            // Fallback extension based on content type
            if (contentType.equals("image/png")) {
                extension = ".png";
            } else if (contentType.equals("image/webp")) {
                extension = ".webp";
            } else {
                extension = ".jpg";
            }
        }

        // Generate unique filename using UUID
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        log.debug("Generated unique filename: {}", uniqueFilename);

        try {
            // Ensure target directory exists using java.nio.file
            Path targetDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
            log.debug("Target directory path: {}", targetDirectory);
            
            if (!Files.exists(targetDirectory)) {
                log.info("Creating upload directory: {}", targetDirectory);
                Files.createDirectories(targetDirectory);
            }

            // Path to the target file
            Path targetLocation = targetDirectory.resolve(uniqueFilename);
            log.info("Saving file to location: {}", targetLocation);

            // Copy file stream using java.nio.file.Files
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative file path (e.g. uploads/profile-pictures/uuid.png)
            String storedPath = uploadDir + "/" + uniqueFilename;
            log.info("File successfully stored for user ID: {}. Path: {}", userId, storedPath);
            return storedPath;

        } catch (IOException ex) {
            log.error("Could not store file for user ID: {}. File I/O exception occurred.", userId, ex);
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
}
