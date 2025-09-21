package calc;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;

public class DynamicCalculatorTest {

    private int parse(String value, int base) {
        return Integer.parseInt(value, base);
    }

    private List<String> readCsv() throws Exception {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(getClass().getResourceAsStream("/operations.csv")))) {
            return reader.lines().skip(1).collect(Collectors.toList());
        }
    }

    private String getOperatorSymbol(String operation) {
        return switch (operation) {
            case "Addition" -> "+";
            case "Subtraction" -> "-";
            case "Multiplication" -> "*";
            case "Division" -> "/";
            default -> "?";
        };
    }

    private DynamicTest createDynamicTest(String line, int colIndex, String operationName,
                                          BiFunction<Integer, Integer, Calculator> constructor) {
        String[] cols = line.split(",");
        String aStr = cols[0];
        String bStr = cols[1];
        String expectedStr = cols[colIndex];
        int base = Integer.parseInt(cols[6]);

        int a = parse(aStr, base);
        int b = parse(bStr, base);
        int expected = parse(expectedStr, base);

        String name = String.format("%s: %s %s %s in base %d = %s",
                operationName, aStr, getOperatorSymbol(operationName), bStr, base, expectedStr);

        return DynamicTest.dynamicTest(name, () -> assertEquals(expected, constructor.apply(a, b).execute()));
    }

    @TestFactory
    Stream<DynamicTest> dynamicAdditionTests() throws Exception {
        return readCsv().stream()
                .map(line -> createDynamicTest(line, 2, "Addition", Calculator.Addition::new));
    }

    @TestFactory
    Stream<DynamicTest> dynamicSubtractionTests() throws Exception {
        return readCsv().stream()
                .map(line -> createDynamicTest(line, 3, "Subtraction", Calculator.Subtraction::new));
    }

    @TestFactory
    Stream<DynamicTest> dynamicMultiplicationTests() throws Exception {
        return readCsv().stream()
                .map(line -> createDynamicTest(line, 4, "Multiplication", Calculator.Multiplication::new));
    }

    @TestFactory
    Stream<DynamicTest> dynamicDivisionTests() throws Exception {
        Stream<DynamicTest> divisionTests = readCsv().stream()
                .map(line -> createDynamicTest(line, 5, "Division", Calculator.Division::new));

        DynamicTest zeroDivTest = DynamicTest.dynamicTest(
                "Division by zero throws ArithmeticException",
                () -> assertThrows(ArithmeticException.class,
                        () -> new Calculator.Division(10, 0).execute())
        );

        return Stream.concat(divisionTests, Stream.of(zeroDivTest));
    }
}

