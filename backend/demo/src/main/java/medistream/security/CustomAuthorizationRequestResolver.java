package medistream.security;

import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public CustomAuthorizationRequestResolver(ClientRegistrationRepository repo) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, "/oauth2/authorization");
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
        return customizeAuthorizationRequest(request, req);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
        return customizeAuthorizationRequest(request, req);
    }

    private OAuth2AuthorizationRequest customizeAuthorizationRequest(HttpServletRequest request, OAuth2AuthorizationRequest req) {
        if (req == null) return null;

        Map<String, Object> additionalParameters = new HashMap<>(req.getAdditionalParameters());

        // force account selection by default for Google
        String prompt = request.getParameter("prompt");
        if (prompt == null || prompt.isBlank()) {
            additionalParameters.put("prompt", "select_account");
        } else {
            additionalParameters.put("prompt", prompt);
        }

        // pass through a mode parameter so handlers/frontend can know register vs login
        String mode = request.getParameter("mode");
        if (mode != null && !mode.isBlank()) {
            additionalParameters.put("mode", mode);
        }

        return OAuth2AuthorizationRequest.from(req)
                .additionalParameters(additionalParameters)
                .build();
    }
}
