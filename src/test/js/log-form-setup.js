$(function(){
    module("log form post")

    test("fills in post values", function() {
        Progstr.apiToken = "DEMO"
        Progstr.initialized = true

        var log = Progstr.logger("my.source")
        var message = {
            level: Progstr.LogLevel.warning,
            text: "Something funny"
        }
        log.prepareForm(message)

        var form = document.getElementById("progstr-log-form")
        equals(form["message.source"].value, "my.source")
        equals(form["message.text"].value, message.text)
        equals(form["message.level"].value, "1")
    })
})
