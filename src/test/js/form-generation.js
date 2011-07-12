$(function(){
    module("initialization")
    test("generate form", function() {
        Progstr.apiToken = "DEMO"
        var form = Progstr.createForm()
        equals(form["apiToken"].value, "DEMO")
        equals(form["message.host"].value, Progstr.getHost())
        equals(form["message.level"].value, "0")
        equals(form["message.source"].value, "")
        equals(form["message.text"].value, "")

        equals(form.id, "progstr-log-form")
        equals(form.getAttribute("accept-charset"), "UTF-8")
        equals(form.method, "post")
        equals(form.action, Progstr.getApiUrl())
        equals(form.style.display, "none")
    })

    test("generate frame", function() {
        var frame = Progstr.createFrame()
        equals(frame.id, "progstr-log-frame-0")
        equals(frame.name, "progstr-log-frame-0")
        equals(frame.style.width, "0px")
        equals(frame.style.height, "0px")
        equals(frame.style.border, "0px")
        equals(frame.getAttribute("frameborder"), "0")
    })

    test("initialize all", function() {
        var form = Progstr.form()
        ok(form != null, "Form created successfully.")
    })
})
