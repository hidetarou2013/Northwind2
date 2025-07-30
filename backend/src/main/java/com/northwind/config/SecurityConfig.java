package com.northwind.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Swagger UI関連のパスを許可
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", "/v3/api-docs/**").permitAll()
                // H2コンソールを許可
                .requestMatchers("/h2-console/**").permitAll()
                // ヘルスチェックを許可
                .requestMatchers("/actuator/**").permitAll()
                // APIエンドポイントを許可
                .requestMatchers("/api/**").permitAll()
                // その他すべてのリクエストを許可
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions().disable()); // H2コンソール用

        return http.build();
    }
} 