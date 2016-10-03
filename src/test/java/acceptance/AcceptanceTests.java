package acceptance;

import cucumber.api.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = {"src/test/specs/income-proving/family-tm-caseworker-tool/"},
        glue = {"steps"},
        tags = {"~@WIP", "~@Demo"})
public class AcceptanceTests {
}
