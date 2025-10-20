package calc.web;

import calc.domain.Calculation;
import calc.service.CalculationService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calculations")
public class CalculationController {

    private final CalculationService calculationService;

    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping("/compute")
    public Calculation compute(
            @RequestParam("a") String aStr,
            @RequestParam("aBase") int aBase,
            @RequestParam("b") String bStr,
            @RequestParam("bBase") int bBase,
            @RequestParam("op") Calculation.Operation operation
    ) {
        return calculationService.computeAndSave(aStr, aBase, bStr, bBase, operation);
    }

    @GetMapping
    public List<Calculation> search(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(value = "op", required = false) Calculation.Operation operation,
            @RequestParam(value = "firstBase", required = false) Integer firstBase,
            @RequestParam(value = "secondBase", required = false) Integer secondBase
    ) {
        return calculationService.findByPeriodAndOptionalOperation(from, to, operation, firstBase, secondBase);
    }
}


