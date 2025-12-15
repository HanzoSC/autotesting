package calc.web;

import calc.domain.Calculation;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class OperationConverter implements Converter<String, Calculation.Operation> {
    
    @Override
    public Calculation.Operation convert(@NonNull String source) {
        try {
            return Calculation.Operation.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid operation: " + source + ". Valid values are: ADD, SUBTRACT, MULTIPLY, DIVIDE");
        }
    }
}

