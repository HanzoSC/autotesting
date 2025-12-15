package calc.bdd;

import calc.domain.Calculation;
import calc.repo.CalculationRepository;
import calc.service.CalculationService;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.DataTableType;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public class CalculatorStepDefs extends CucumberSpringConfig {

    @Autowired
    private CalculationService calculationService;

    @Autowired
    private CalculationRepository calculationRepository;

    private final List<String> computedResults = new ArrayList<>();
    private List<Calculation> searchResults;

    @Given("база данных очищена и подготовлена начальными данными")
    @Transactional
    public void resetDbWithSeed() {
        calculationRepository.deleteAll();
        Calculation seed = new Calculation();
        seed.setFirstValue("A");
        seed.setFirstBase(16);
        seed.setSecondValue("10");
        seed.setSecondBase(10);
        seed.setOperation(Calculation.Operation.ADD);
        seed.setResultValue("20");
        seed.setExecutedAt(LocalDateTime.parse("2024-01-01T12:00:00"));
        calculationRepository.save(seed);
    }

    @When("я вычисляю операцию {word} для {string} в базе {int} и {string} в базе {int}")
    public void computeSingle(String opStr, String a, int aBase, String b, int bBase) {
        Calculation.Operation operation = Calculation.Operation.valueOf(opStr);
        Calculation calc = calculationService.computeAndSave(a, aBase, b, bBase, operation);
        computedResults.add(calc.getResultValue());
    }

    @Then("результат должен быть {string}")
    public void assertSingle(String expected) {
        if (computedResults.isEmpty()) throw new AssertionError("No results computed");
        String actual = computedResults.get(computedResults.size() - 1);
        if (!expected.equals(actual)) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    @When("я последовательно вычисляю операции")
    public void computeBatch(DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        for (Map<String, String> row : rows) {
            String a = row.get("a");
            int aBase = Integer.parseInt(row.get("aBase"));
            String b = row.get("b");
            int bBase = Integer.parseInt(row.get("bBase"));
            Calculation.Operation op = Calculation.Operation.valueOf(row.get("op"));
            String expected = row.get("expected");
            Calculation calc = calculationService.computeAndSave(a, aBase, b, bBase, op);
            computedResults.add(calc.getResultValue());
            if (!calc.getResultValue().equals(expected)) {
                throw new AssertionError("Expected " + expected + " but got " + calc.getResultValue());
            }
        }
    }

    public static class OperationDto {
        public String a;
        public int aBase;
        public String b;
        public int bBase;
        public String op;
        public String expected;
    }

    @DataTableType
    public OperationDto operationDtoEntry(Map<String, String> row) {
        OperationDto dto = new OperationDto();
        dto.a = row.get("a");
        dto.aBase = Integer.parseInt(row.get("aBase"));
        dto.b = row.get("b");
        dto.bBase = Integer.parseInt(row.get("bBase"));
        dto.op = row.get("op");
        dto.expected = row.get("expected");
        return dto;
    }

    @When("я вычисляю следующий набор операций как объекты")
    public void computeAsObjects(DataTable table) {
        List<OperationDto> operations = table.asList(OperationDto.class);
        for (OperationDto dto : operations) {
            Calculation.Operation op = Calculation.Operation.valueOf(dto.op);
            Calculation calc = calculationService.computeAndSave(dto.a, dto.aBase, dto.b, dto.bBase, op);
            computedResults.add(calc.getResultValue());
            if (!calc.getResultValue().equals(dto.expected)) {
                throw new AssertionError("Expected " + dto.expected + " but got " + calc.getResultValue());
            }
        }
    }

    @Then("все результаты должны соответствовать ожиданиям")
    public void allResultsMatch() {
    }

    @When("я вычисляю сумму для списка пар {string} с разделителем {string}")
    public void computeWithCustomDelimiter(String pairs, String delimiter) {
        String[] items = pairs.split(java.util.regex.Pattern.quote(delimiter));
        for (String item : items) {
            String[] parts = item.trim().split("-");
            String[] left = parts[0].split(":");
            String[] right = parts[1].split(":");
            String a = left[0];
            int aBase = Integer.parseInt(left[1]);
            String b = right[0];
            int bBase = Integer.parseInt(right[1]);
            Calculation calc = calculationService.computeAndSave(a, aBase, b, bBase, Calculation.Operation.ADD);
            computedResults.add(calc.getResultValue());
        }
    }

    @Then("результаты должны быть {string}")
    public void assertList(String expectedCsv) {
        String actualCsv = String.join(",", computedResults);
        if (!expectedCsv.equals(actualCsv)) {
            throw new AssertionError("Expected " + expectedCsv + " but got " + actualCsv);
        }
    }

    @Given("в базе есть результаты вычислений")
    public void ensureData() {
        if (calculationRepository.count() == 0) {
            resetDbWithSeed();
        }
    }

    @Given("- в базе есть результаты вычислений")
    public void ensureDataWithHyphen() {
        ensureData();
    }

    @When("я запрашиваю операции с {string} по {string} с фильтром op={word}, firstBase={int}, secondBase={int}")
    public void searchWithFilters(String fromStr, String toStr, String opStr, int firstBase, int secondBase) {
        LocalDateTime from = LocalDateTime.parse(fromStr);
        LocalDateTime to = LocalDateTime.parse(toStr);
        Calculation.Operation op = Calculation.Operation.valueOf(opStr);
        searchResults = calculationService.findByPeriodAndOptionalOperation(from, to, op, firstBase, secondBase);
    }

    @Then("я должен получить хотя бы 1 результат")
    public void assertAtLeastOne() {
        if (searchResults == null || searchResults.isEmpty()) {
            throw new AssertionError("Expected at least one result");
        }
    }
}


