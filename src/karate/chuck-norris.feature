Feature: Testing the Chuck Norris Joke API

  Background:
    * url 'http://api.icndb.com/jokes/'

  Scenario: Testing random jokes GET endpoint
    Given url 'http://api.icndb.com/jokes/random/'
    When method GET
    Then status 200

  Scenario: Testing 5 random jokes GET endpoint
    Given url 'http://api.icndb.com/jokes/random/3'
    When method GET
    Then status 200

  Scenario: Testing random jokes using path and parameter
    Given path 'random'
    And param firstName = 'Leander'
    And param lastName = 'Reimer'
    When method GET
    Then status 200
    And match response contains { type: 'success'}