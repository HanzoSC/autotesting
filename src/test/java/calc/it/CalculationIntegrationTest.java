package calc.it;

import calc.domain.Calculation;
import calc.repo.CalculationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
public class CalculationIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CalculationRepository calculationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @org.springframework.test.context.DynamicPropertySource
    static void registerProps(org.springframework.test.context.DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
    }

    @BeforeEach
    void setupData() throws Exception {
        try (InputStream is = getClass().getResourceAsStream("/fixtures/seed-calculations.json")) {
            if (is != null) {
                List<Calculation> items = objectMapper.readValue(is, new TypeReference<List<Calculation>>(){});
                calculationRepository.saveAll(items);
            }
        }
    }

    @Test
    void compute_and_search() throws Exception {
        String baseUrl = "http://localhost:" + port + "/api/calculations";

        // ожидаемый результат из json
        try (InputStream expectedIs = getClass().getResourceAsStream("/fixtures/expected-compute.json")) {
            var expected = objectMapper.readTree(expectedIs);

        ResponseEntity<Calculation> resp = restTemplate.postForEntity(
                baseUrl + "/compute?a=1010&aBase=2&b=7&bBase=10&op=ADD",
                null,
                Calculation.class);
        assert resp.getStatusCode().is2xxSuccessful();
        Calculation created = resp.getBody();
        assert created != null;
        assert created.getResultValue().equals(expected.get("resultValue").asText());
        assert created.getFirstValue().equals(expected.get("firstValue").asText());
        assert created.getSecondValue().equals(expected.get("secondValue").asText());
        }

        LocalDateTime from = LocalDateTime.now().minusDays(1);
        LocalDateTime to = LocalDateTime.now().plusDays(1);
        ResponseEntity<Calculation[]> listResp = restTemplate.getForEntity(
                baseUrl + String.format("?from=%s&to=%s&op=ADD", from, to),
                Calculation[].class);
        assert listResp.getStatusCode().is2xxSuccessful();
        assert listResp.getBody() != null && listResp.getBody().length >= 1;
    }

    @Test
    void compute_subtract_and_verify() throws Exception {
        String baseUrl = "http://localhost:" + port + "/api/calculations";
        try (InputStream expectedIs = getClass().getResourceAsStream("/fixtures/expected-subtract.json")) {
            var expected = objectMapper.readTree(expectedIs);
            ResponseEntity<Calculation> resp = restTemplate.postForEntity(
                    baseUrl + "/compute?a=1111&aBase=2&b=7&bBase=10&op=SUBTRACT",
                    null,
                    Calculation.class);
            assert resp.getStatusCode().is2xxSuccessful();
            Calculation created = resp.getBody();
            assert created != null;
            assert created.getResultValue().equals(expected.get("resultValue").asText());
        }
    }

    @Test
    void compute_multiply_and_verify() throws Exception {
        String baseUrl = "http://localhost:" + port + "/api/calculations";
        try (InputStream expectedIs = getClass().getResourceAsStream("/fixtures/expected-multiply.json")) {
            var expected = objectMapper.readTree(expectedIs);
            ResponseEntity<Calculation> resp = restTemplate.postForEntity(
                    baseUrl + "/compute?a=A&aBase=16&b=10&bBase=10&op=MULTIPLY",
                    null,
                    Calculation.class);
            assert resp.getStatusCode().is2xxSuccessful();
            Calculation created = resp.getBody();
            assert created != null;
            assert created.getResultValue().equals(expected.get("resultValue").asText());
        }
    }

    @Test
    void compute_divide_and_verify() throws Exception {
        String baseUrl = "http://localhost:" + port + "/api/calculations";
        try (InputStream expectedIs = getClass().getResourceAsStream("/fixtures/expected-divide.json")) {
            var expected = objectMapper.readTree(expectedIs);
            ResponseEntity<Calculation> resp = restTemplate.postForEntity(
                    baseUrl + "/compute?a=FF&aBase=16&b=3&bBase=10&op=DIVIDE",
                    null,
                    Calculation.class);
            assert resp.getStatusCode().is2xxSuccessful();
            Calculation created = resp.getBody();
            assert created != null;
            assert created.getResultValue().equals(expected.get("resultValue").asText());
        }
    }

    @Test
    void compute_divide_by_zero_returns_server_error() {
        String baseUrl = "http://localhost:" + port + "/api/calculations";
        ResponseEntity<String> resp = restTemplate.postForEntity(
                baseUrl + "/compute?a=10&aBase=10&b=0&bBase=10&op=DIVIDE",
                null,
                String.class);
        assert resp.getStatusCode().is5xxServerError();
    }
}


