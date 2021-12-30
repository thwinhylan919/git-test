define([

    "knockout",
    "jquery",

    "ojL10n!resources/nls/bot-client",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojfilmstrip",
    "ojs/ojdialog",
    "ojs/ojconveyorbelt"
], function (ko, $, resourceBundle) {
    "use strict";

    return function (context) {
        const self = this;

        ko.utils.extend(self, context.rootModel);
        self.nls = resourceBundle;

        let messageToBot,
            currentConnection;

        self.waitingForText = ko.observable(false);

        const LOCATION_TYPE = "location",
            POSTBACK_TYPE = "postback";
        let ws,
            targetSubscription;

        context.dashboard.headerName(self.nls.chatbot.chatbotHeader);

        // close websocket connection when we leave page with tester CCA
        self.dispose = function () {
            if (ws) {
                ws.close();
            }

            if (targetSubscription) {
                targetSubscription.dispose();
            }
        };

        const initMessageToBot = function (channel) {
                messageToBot = {
                    to: {
                        type: "bot",
                        id: channel
                    }
                };
            },
            waitForSocketConnection = function (socket, callback) {
                setTimeout(
                    function () {
                        if (socket.readyState === 1) {
                            callback();
                        } else {
                            waitForSocketConnection(socket, callback);
                        }
                    }, 1000);
            },
            initWebSocketIfNeeded = function () {
                const connection = self.properties.websocketConnectionUrl + "?user=" + encodeURI(self.properties.userId);

                if (connection !== currentConnection) {
                    currentConnection = connection;
                    ws = new WebSocket(connection);

                    ws.onmessage = function (evt) {
                        self.waitingForText(false);

                        const response = JSON.parse(evt.data);

                        if (response.body && response.body.messagePayload) {
                            // process IB V1.1 message
                            // we no longer support V1.0 messages, the webhook platform version
                            // should be set to 1.1
                            const messagePayload = response.body.messagePayload;

                            self.addItem(messagePayload, true);
                        } else if (response.error) {
                            self.addItem({
                                type: "text",
                                text: response.error.message
                            }, true);
                        }
                    };

                    ws.onerror = function (error) {
                        self.waitingForText(false);
                        self.onerror(error);
                    };

                    ws.onopen = function () {
                        self.sendMessage(self.nls.chatbot.welcomeMessage, false);
                    };
                }
            };

        self.value = ko.observable("");
        self.itemToAdd = ko.observable("");
        self.scrollPos = ko.observable(5000);

        self.reset = function () {
            // re-init websocket when userId or connection url has changed
            initWebSocketIfNeeded();
            self.allItems([]);
            // re-init messageToBot to pick up changes to channel id
            initMessageToBot(self.properties.channel);
        };

        self.getDisplayUrl = function (url) {
            const pos = url.indexOf("://"),
                startpos = pos === -1 ? 0 : pos + 3;
            let endpos = url.indexOf("/", startpos);

            endpos = endpos === -1 ? url.length : endpos;

            return url.substring(startpos, endpos);
        };

        // send message to the bot
        const sendToBot = function (message) {
                // wait for websocket until open
                waitForSocketConnection(ws, function () {
                    self.waitingForText(true);
                    ws.send(JSON.stringify(message));
                });
            },
            scrollBottom = function (el) {
                setTimeout(function () {
                    // scroll down to the bottom
                    $("body").animate({
                        scrollTop: !el ? $("#page").height() : el.scrollHeight
                    }, 1000);
                    /* increase / decrease animation speed */
                }, 100);
            };

        ko.extenders.scrollFollow = function (target, selector) {
            targetSubscription = target.subscribe(function () {
                const el = document.querySelector(selector);

                // check to see if you should scroll now?
                scrollBottom(el);
            });

            return target;
        };

        self.allItems = ko.observableArray([]).extend({
            scrollFollow: "#listview"
        });

        let lastItemId = self.allItems().length;

        if (lastItemId > 1) {
            scrollBottom();
        }

        self.addItem = function (value, isBot) {
            // TODO: don't add if value is empty!
            lastItemId++;

            self.allItems.push({
                id: lastItemId,
                payload: value,
                bot: isBot
            });

            if (context.baseModel.cordovaDevice() === "IOS") {
                $("input").blur();
            }
        };

        $("#text-input").keyup(function (context) {
            if ($(this).val().trim() !== "" && context.keyCode === 13) {
                // Free text is entered
                self.sendMessage($(this).val(), true);
                $(this).val("");
            }
        });

        self.sendMessage = function (message, pushMessageFlag) {
            messageToBot.messagePayload = {
                type: "text",
                text: message
            };

            messageToBot.profile = {
                locale: navigator.languages[0]
            };

            if (pushMessageFlag) {
                self.addItem(message, false);
            }

            self.value("");
            sendToBot(messageToBot);
        };

        self.notSupportedMessage = ko.observable();

        self.onClientSelection = function (event, action) {
            self.addItem(action.label, false);

            if (action.type === POSTBACK_TYPE) {
                messageToBot.messagePayload = {
                    type: "postback",
                    postback: action.postback
                };

                sendToBot(messageToBot);
            } else if (action.type === LOCATION_TYPE) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        messageToBot.messagePayload = {
                            type: "location",
                            location: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        };

                        sendToBot(messageToBot);
                    });
                } else {
                    self.notSupportedMessage(self.nls.chatbot.geoLocation);
                    $("#notSupportedDialog").ojDialog("open");
                }
            } else {
                $("#notSupportedDialog").ojDialog("open");
            }
        };

        self.closeNotSupportedDialog = function () {
            $("#notSupportedDialog").ojDialog("close");
        };

        // film trip properties!
        self.currentNavArrowPlacement = ko.observable("overlay");
        self.currentNavArrowVisibility = ko.observable("hidden");
        self.properties = context.rootModel.params;
        initMessageToBot(self.properties.channel);
        initWebSocketIfNeeded();

        $(".main-content").css({
            "padding-bottom": "0"
        });
    };
});