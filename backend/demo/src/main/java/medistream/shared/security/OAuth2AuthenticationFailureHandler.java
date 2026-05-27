package medistream.shared.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                       AuthenticationException exception) throws IOException, ServletException {
        
        String errorMessage = exception != null ? exception.getMessage() : "Unknown error";
        String errorCode = "oauth2_failed";
        
        // Log the error
        System.err.println("❌ OAuth2 Authentication Failed: " + errorMessage);
        
        // Check for specific error types
        if (errorMessage != null && errorMessage.contains("access_denied")) {
            errorCode = "access_denied";
            errorMessage = "You cancelled the Google sign-in";
        }
        
        // Prefer redirecting back to an explicit return URL stored in a short-lived cookie (set by /api/auth/google)
        String returnUrl = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie c : request.getCookies()) {
                if ("oauth_return".equals(c.getName())) {
                    try {
                        returnUrl = java.net.URLDecoder.decode(c.getValue(), java.nio.charset.StandardCharsets.UTF_8);
                    } catch (Exception ex) {
                        returnUrl = c.getValue();
                    }
                    // clear cookie
                    jakarta.servlet.http.Cookie clear = new jakarta.servlet.http.Cookie("oauth_return", "");
                    clear.setMaxAge(0);
                    clear.setPath("/");
                    response.addCookie(clear);
                    break;
                }
            }
        }

        if (returnUrl != null && !returnUrl.isEmpty()) {
            // append error info
            String redirectUrl = UriComponentsBuilder.fromUriString(returnUrl)
                    .queryParam("error", errorCode)
                    .queryParam("message", errorMessage)
                    .build()
                    .toUriString();
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            return;
        }

        // Fallback: send to login or register depending on mode/referrer
        String targetPage = "login";
        String modeParam = request.getParameter("mode");
        if (modeParam != null && modeParam.equalsIgnoreCase("register")) {
            targetPage = "register";
        } else {
            String referer = request.getHeader("Referer");
            if (referer != null && referer.contains("mode=register")) {
                targetPage = "register";
            }
        }

        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/" + targetPage)
                .queryParam("error", errorCode)
                .queryParam("message", errorMessage)
                .build()
                .toUriString();
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
