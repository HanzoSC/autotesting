package calc.bdd;

import calc.repo.CalculationRepository;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public class Hooks extends CucumberSpringConfig {

    @Autowired
    private CalculationRepository calculationRepository;

    @Before(order = 0)
    @Transactional
    public void beforeScenario() {
        // DB prepared in Background step; we ensure the context is up
    }

    @After
    @Transactional
    public void afterScenario() {
        // Return DB to initial state after each scenario
        calculationRepository.deleteAll();
    }
}


