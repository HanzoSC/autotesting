package calc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Разрешаем запросы с localhost:4200 (Angular dev server)
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("http://localhost:4201");
        
        // Разрешаем все методы
        config.addAllowedMethod("*");
        
        // Разрешаем все заголовки
        config.addAllowedHeader("*");
        
        // Разрешаем отправку credentials (если нужно)
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
