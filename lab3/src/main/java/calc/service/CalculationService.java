package calc.service;

import calc.domain.Calculation;
import calc.repo.CalculationRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CalculationService {

    private final CalculationRepository calculationRepository;

    public CalculationService(CalculationRepository calculationRepository) {
        this.calculationRepository = calculationRepository;
    }

    @Transactional
    public Calculation computeAndSave(String aStr, int aBase, String bStr, int bBase, Calculation.Operation operation) {
        int a = Integer.parseInt(aStr, aBase);
        int b = Integer.parseInt(bStr, bBase);
        int result;
        switch (operation) {
            case ADD -> result = a + b;
            case SUBTRACT -> result = a - b;
            case MULTIPLY -> result = a * b;
            case DIVIDE -> {
                if (b == 0) throw new ArithmeticException("Division by zero");
                result = a / b;
            }
            default -> throw new IllegalArgumentException("Unsupported operation");
        }

        Calculation calculation = new Calculation();
        calculation.setFirstValue(aStr);
        calculation.setFirstBase(aBase);
        calculation.setSecondValue(bStr);
        calculation.setSecondBase(bBase);
        calculation.setOperation(operation);
        calculation.setResultValue(Integer.toString(result));
        calculation.setExecutedAt(LocalDateTime.now());
        return calculationRepository.save(calculation);
    }

    public List<Calculation> findByPeriodAndOptionalOperation(
            LocalDateTime from,
            LocalDateTime to,
            Calculation.Operation operation,
            Integer firstBase,
            Integer secondBase
    ) {
        if (operation == null && firstBase == null && secondBase == null) {
            return calculationRepository.findByExecutedAtBetween(from, to);
        }
        if (operation != null && firstBase != null && secondBase != null) {
            return calculationRepository.findByExecutedAtBetweenAndOperationAndFirstBaseAndSecondBase(from, to, operation, firstBase, secondBase);
        }
        return calculationRepository.findByExecutedAtBetweenAndOperation(from, to, operation);
    }
}


