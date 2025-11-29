package com.unsport.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desactivamos CSRF porque es una API REST y usaremos tokens en el futuro,
            // no cookies de sesión de navegador tradicionales.
            .csrf(csrf -> csrf.disable())
            
            // Configuramos quién puede entrar a dónde
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso a test Y a profiles (solo por ahora, para probar)
                .requestMatchers("/api/test/**", "/api/profiles/**", "/api/announcements/**").permitAll()
                
                // Cualquier otra petición requiere estar autenticado
                .anyRequest().authenticated()
            );

        return http.build();
    }
}