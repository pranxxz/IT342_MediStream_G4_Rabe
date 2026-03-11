package medistream.security;

import medistream.entity.UserAccountEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    // ⚠️ IMPORTANT: In a real app, store this in application.properties
    // This key must be at least 256 bits (32 characters) long
    private static final String SECRET_KEY = "ClinicaFlowSuperSecretKeyForPatientQueueSystem2025";

    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    // Generate token for user
    public String generateToken(UserAccountEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("id", user.getAccountID());
        
        return createToken(claims, user.getUsername());
    }

    // Create the token
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Usually the email/username
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Get the signing key
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(SECRET_KEY.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
