package calc.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "calculations")
public class Calculation {

    public enum Operation { ADD, SUBTRACT, MULTIPLY, DIVIDE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_value", nullable = false)
    private String firstValue;

    @Column(name = "first_base", nullable = false)
    private int firstBase;

    @Column(name = "second_value", nullable = false)
    private String secondValue;

    @Column(name = "second_base", nullable = false)
    private int secondBase;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", nullable = false, length = 16)
    private Operation operation;

    @Column(name = "result_value", nullable = false)
    private String resultValue;

    @Column(name = "executed_at", nullable = false)
    private LocalDateTime executedAt;

    public Calculation() {
        // required by JPA and Jackson
    }

    public Long getId() { return id; }
    public String getFirstValue() { return firstValue; }
    public void setFirstValue(String firstValue) { this.firstValue = firstValue; }
    public int getFirstBase() { return firstBase; }
    public void setFirstBase(int firstBase) { this.firstBase = firstBase; }
    public String getSecondValue() { return secondValue; }
    public void setSecondValue(String secondValue) { this.secondValue = secondValue; }
    public int getSecondBase() { return secondBase; }
    public void setSecondBase(int secondBase) { this.secondBase = secondBase; }
    public Operation getOperation() { return operation; }
    public void setOperation(Operation operation) { this.operation = operation; }
    public String getResultValue() { return resultValue; }
    public void setResultValue(String resultValue) { this.resultValue = resultValue; }
    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }
}


