package calc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;

public class CalculatorTest {

    private int parse(String value, int base) {
        return Integer.parseInt(value, base);
    }

    @Nested
    class AdditionTests {
        @ParameterizedTest(name = "{0} + {1} in base {6} = {2}")
        @CsvFileSource(resources = "/operations.csv", numLinesToSkip = 1)
        void testAddition(String aStr, String bStr,
                          String sumStr, String subStr, String mulStr, String divStr,
                          int base) {
            assertEquals(parse(sumStr, base),
                         new Calculator.Addition(parse(aStr, base), parse(bStr, base)).execute());
        }
    }

    @Nested
    class SubtractionTests {
        @ParameterizedTest(name = "{0} - {1} in base {6} = {3}")
        @CsvFileSource(resources = "/operations.csv", numLinesToSkip = 1)
        void testSubtraction(String aStr, String bStr,
                             String sumStr, String subStr, String mulStr, String divStr,
                             int base) {
            assertEquals(parse(subStr, base),
                         new Calculator.Subtraction(parse(aStr, base), parse(bStr, base)).execute());
        }
    }

    @Nested
    class MultiplicationTests {
        @ParameterizedTest(name = "{0} * {1} in base {6} = {4}")
        @CsvFileSource(resources = "/operations.csv", numLinesToSkip = 1)
        void testMultiplication(String aStr, String bStr,
                                String sumStr, String subStr, String mulStr, String divStr,
                                int base) {
            assertEquals(parse(mulStr, base),
                         new Calculator.Multiplication(parse(aStr, base), parse(bStr, base)).execute());
        }
    }

    @Nested
    class DivisionTests {
        @ParameterizedTest(name = "{0} / {1} in base {6} = {5}")
        @CsvFileSource(resources = "/operations.csv", numLinesToSkip = 1)
        void testDivision(String aStr, String bStr,
                          String sumStr, String subStr, String mulStr, String divStr,
                          int base) {
            assertEquals(parse(divStr, base),
                         new Calculator.Division(parse(aStr, base), parse(bStr, base)).execute());
        }

        @Test
        void testDivisionByZero() {
            assertThrows(ArithmeticException.class,
                         () -> new Calculator.Division(10, 0).execute());
        }
    }
}
