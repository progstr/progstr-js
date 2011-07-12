$(function(){
    module("logger API")

    Progstr.apiToken = "DEMO"
    Progstr.initialized = true

    var logger = Progstr.logger("test.logger")
    logger.send = function(message) {
        logger.lastMessage = message
    }

    function assertLog(level, text) {
        equals(logger.lastMessage.level, level, "Log level correct.")
        equals(logger.lastMessage.text, text, "Log text correct.")
    }

    test("log levels", function() {
        logger.info("Info log")
        assertLog(Progstr.LogLevel.info, "Info log")
        logger.warning("Warning log")
        assertLog(Progstr.LogLevel.warning, "Warning log")
        logger.error("Error log")
        assertLog(Progstr.LogLevel.error, "Error log")
        logger.fatal("Fatal log")
        assertLog(Progstr.LogLevel.fatal, "Fatal log")
    })
})
