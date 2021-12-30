define([
    "jquery",
    "ojL10n!resources/nls/virtual-keypad",
    "ojs/ojpopup",
    "ojs/ojinputtext"
], function($, resources) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.id = Math.random().toString(36).substring(7);
        self.value = rootParams.value;
        self.resource = resources;

        function shuffle(array) {
            let currentIndex = array.length,
                temporaryValue, randomIndex;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        function generateNumberOrChar(type) {
            const array = [];

            if (type === "num") {
                for (let i = 0; i < 10; i++) {
                    array.push(i);
                }
            } else {
                for (let i = 0; i < 26; i++) {
                    array.push(String.fromCharCode(97 + i));
                }
            }

            return array;
        }

        self.numbers = shuffle(generateNumberOrChar("num"));

        const alphabets = shuffle(generateNumberOrChar());

        self.firstRowAlphabets = alphabets.splice(0, 10);
        self.secondRowAlphabets = alphabets.splice(0, 9);
        self.thirdRowAlphabets = alphabets;
        self.showVirtualKeypad = !rootParams.baseModel.isTouchDevice() && rootParams.baseModel.large();

        let shift = false,
            capslock = false;

        $(document).on("click", rootParams.baseModel.format("#keyboard{id} li", {
            id: self.id
        }), function() {
            const $this = $(this);
            let character = $this.html();

            // Shift keys
            if ($this.hasClass("left-shift") || $this.hasClass("right-shift")) {
                $(".letter").toggleClass("uppercase");
                $(".symbol span").toggle();
                shift = shift !== true;
                capslock = false;

                return false;
            }

            // Caps lock
            if ($this.hasClass("capslock")) {
                $(".letter").toggleClass("uppercase");
                capslock = true;

                return false;
            }

            // Delete
            if ($this.hasClass("delete")) {
                self.value(self.value() ? self.value().substr(0, self.value().length - 1) : null);

                return false;
            }

            // Special characters
            if ($this.hasClass("symbol")) {
                character = $("span:visible", $this).html();
            }

            if ($this.hasClass("space")) {
                // eslint-disable-next-line obdx-string-validations
                character = " ";
            }

            if ($this.hasClass("tab")) {
                // eslint-disable-next-line obdx-string-validations
                character = "\t";
            }

            if ($this.hasClass("return")) {
                // eslint-disable-next-line obdx-string-validations
                character = "\n";
            }

            // Uppercase letter
            if ($this.hasClass("uppercase")) {
                character = character.toUpperCase();
            }

            // Remove shift once a key is clicked.
            if (shift === true) {
                $(".symbol span").toggle();

                if (capslock === false) {
                    $(".letter").toggleClass("uppercase");
                }

                shift = false;
            }

            // Add the character
            self.value((self.value() || "") + character);
        });

        self.openVirtualKeyPad = function() {
            self.value("");
            document.querySelector("#popup" + self.id).open("#" + rootParams.element);
        };
    };
});