package medistream.shared.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the "uploads" directory to serve files statically
        Path uploadDirPat = Paths.get("uploads").toAbsolutePath().normalize();
        String uploadPath = uploadDirPat.toUri().toString();
        
        log.info("Registering Spring MVC Static Resource Handler:");
        log.info(" - URL Pattern: /uploads/**");
        log.info(" - Physical Path: {}", uploadPath);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
