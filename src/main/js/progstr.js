(function() {
    function onLoad(action) {
        if ( window.addEventListener ) {
            window.addEventListener( "load", action, false );
        } else if ( window.attachEvent ) {
            window.attachEvent( "onload", action );
        } else {
            window.onload = action;
        }
    }

    function insertInput(form, name, value) {
        var input = document.createElement("input")
        input.type = "text"
        input.name = name
        input.value = value
        form.appendChild(input)
    }

    window.Progstr = {
        baseUrl: "api.progstr.com",
        queue: [],

        createForm: function() {
            var form = document.createElement("form")
            form.id = "progstr-log-form"
            form.method = "post"
            form.action = Progstr.getApiUrl()
            form.setAttribute("accept-charset", "UTF-8")
            form.style.display = "none"

            insertInput(form, "apiToken", Progstr.apiToken)
            insertInput(form, "message.host", Progstr.getHost())
            insertInput(form, "message.level", "0")
            insertInput(form, "message.source", "")
            insertInput(form, "message.text", "")
            document.body.appendChild(form)
            return form
        },

        form: function() {
            if (this._form == null)
                this._form = document.getElementById("progstr-log-form")
            if (this._form == null)
                this._form = this.createForm()
            return this._form
        },

        frameId: 0,
        createFrame: function() {
            var frame = document.createElement("iframe")
            frame.id = "progstr-log-frame-" + this.frameId
            frame.name = "progstr-log-frame-" + this.frameId
            this.frameId++

            frame.style.width = frame.style.height = "0px";
            frame.style.border = "0px"
            frame.setAttribute("frameborder", "0")
            document.body.appendChild(frame)
            return frame
        },

        initialize: function() {
            if (this.initialized != true) {
                this.form()

                this.initialized = true
                this.sendQueued()
            }
        },

        sendQueued: function() {
            while (this.queue.length > 0) {
                var pending = this.queue.shift()
                pending.logger.send(pending.message)
            }
        },

        getHost: function() {
            return window.location.hostname || "Unknown";
        },

        getApiUrl: function() {
            if (/^http:\/\//i.test(this.baseUrl))
                return this.baseUrl + "/v1/log.form"
            else
                return "http://" + this.baseUrl + "/v1/log.form"
        },
        LogLevel: {
            info: 0,
            warning: 1,
            error: 2,
            fatal: 3
        },

        logger: function(source) {
            return new Logger(source)
        }
    }

    onLoad(function(){
        if (!window.PROGSTR_TEST_MODE) {
            Progstr.initialize();
        }
    })

    function Logger(source) {
        this.source = source
    }

    Logger.prototype = {
        prepareForm: function(message) {
            var form = Progstr.form()
            form["message.source"].value = this.source
            form["message.level"].value = message.level
            form["message.text"].value = message.text
        },
        submitForm: function(message) {
            var form = Progstr.form()
            var frame = Progstr.createFrame()
            form.target = frame.id
            form.submit()

            window.setTimeout(function() {
                frame.parentNode.removeChild(frame)
            }, 2000)
        },
        info: function(text) {
            this.process(this._createMessage(Progstr.LogLevel.info, text))
        },
        warning: function(text) {
            this.process(this._createMessage(Progstr.LogLevel.warning, text))
        },
        error: function(text) {
            this.process(this._createMessage(Progstr.LogLevel.error, text))
        },
        fatal: function(text) {
            this.process(this._createMessage(Progstr.LogLevel.fatal, text))
        },
        _createMessage: function(level, text) {
            var message = {
                level: level,
                text: text
            }
            return message
        },
        process: function(message) {
            if (Progstr.initialized == true) {
                this.send(message)
            } else {
                this.queue(message)
            }
        },
        send: function(message) {
            var logger = this
            window.setTimeout(function() {
                logger.sendImmediate(message)
            }, 0)
        },
        sendImmediate: function(message) {
            this.prepareForm(message)
            this.submitForm()
        },
        queue: function(message) {
            var logger = this
            Progstr.queue.push({ logger: logger, message: message })
        }
    }
})()
