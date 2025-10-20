package calc.repo;

import calc.domain.Calculation;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByExecutedAtBetween(LocalDateTime from, LocalDateTime to);
    List<Calculation> findByExecutedAtBetweenAndOperation(LocalDateTime from, LocalDateTime to, Calculation.Operation operation);
    List<Calculation> findByExecutedAtBetweenAndOperationAndFirstBaseAndSecondBase(
            LocalDateTime from, LocalDateTime to, Calculation.Operation operation, int firstBase, int secondBase);
}


