package mth.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class Jwtservice {

    private final SecretKey key;
    private final long expirationMs;

    public Jwtservice(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.expirationMs = expirationMs;
    }

    /**
     * Generate a JWT token with user information.
     * Claims match the FastAPI gateway format: sub=email, user_id, role
     */
    public String generateJWT(String email, Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", email);
        claims.put("user_id", userId);
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Validate a JWT token and return the claims.
     */
    public Map<String, Object> validateJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Date expiration = claims.getExpiration();
            if (expiration == null || expiration.before(new Date())) {
                return null;
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("email", claims.get("sub"));
            payload.put("user_id", claims.get("user_id"));
            payload.put("role", claims.get("role"));
            return payload;
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Extract email (subject) from token.
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("sub", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Check if token is valid (not expired and well-formed).
     */
    public boolean isTokenValid(String token) {
        return validateJWT(token) != null;
    }
}
