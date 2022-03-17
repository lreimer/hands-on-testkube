package hands.on.testkube;

import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

public class RemoteTestkubeTest {

    @Test
    void testRemoteTestKube() {
        given().baseUri("https://kubeshop.github.io").port(443)
                .when().get("/testkube/")
                        .then().statusCode(200);
    }
}
