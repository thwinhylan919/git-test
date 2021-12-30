define([
    "knockout",
  "jquery",
  "hammerjs"
], function(ko, $, Hammer) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.data = ko.isObservable(rootParams.data) ? rootParams.data : ko.observableArray(rootParams.data);
    self.data.push({});

    self.initializeJourney = function() {
      const timeline = document.querySelector(".journey__timeline ol"),
        elH = document.querySelectorAll(".journey__timeline li > div"),
        arrows = document.querySelectorAll(".journey__timeline .arrows .arrow"),
        arrowPrev = document.querySelector(".journey__timeline .arrows .arrow__prev"),
        arrowNext = document.querySelector(".journey__timeline .arrows .arrow__next"),
        firstItem = document.querySelector(".journey__timeline li:first-child"),
        lastItem = document.querySelector(".journey__timeline li:last-child"),
        xScrolling = 280,
        disabledClass = "disabled";

      function setEqualHeights(el) {
        let counter = 0;

        for (let i = 0; i < el.length; i++) {
          const singleHeight = el[i].offsetHeight;

          if (counter < singleHeight) {
            counter = singleHeight;
          }
        }

        for (let j = 0; j < el.length; j++) {
          el[j].style.height = counter + "px";
        }
      }

      const visibleLeft = (((window.innerWidth || document.documentElement.innerWidth) - $(".journey").width()) / 2) - 20;

      function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();

        return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.left >= visibleLeft && rect.right <= $(".journey").width() + visibleLeft;
      }

      function setBtnState(el, flag) {
        if (flag) {
          el.classList.add(disabledClass);
          el.disabled = true;
        } else {
          if (el.classList.contains(disabledClass)) {
            el.classList.remove(disabledClass);
          }

          el.disabled = false;
        }
      }

      let runAnimation = true;

      function animateTl(scrolling, el, tl) {
        let counter = 0;

        for (let i = 0; i < el.length; i++) {
          el[i].addEventListener("click", function() {
            if (runAnimation) {
              runAnimation = false;

              const sign = this.classList.contains("arrow__prev") ? "" : "-";

              if (counter === 0) {
                tl.style.transform = "translateX(-" + scrolling + "px)";
              } else {
                const tlStyle = getComputedStyle(tl),
                  tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform"),
                  values = parseInt(tlTransform.split(",")[4]) + parseInt(sign + scrolling);

                tl.style.transform = "translateX(" + values + "px)";
              }

              counter++;

              setTimeout(function() {
                runAnimation = true;
                setBtnState(arrowPrev, !!isElementInViewport(firstItem));
                setBtnState(arrowNext, !!isElementInViewport(lastItem));
              }, 1100);
            }
          });
        }
      }

      function setSwipeFn(tl, prev, next) {
        const hammer = new Hammer(tl);

        hammer.on("swipeleft", function() {
          next.click();
        });

        hammer.on("swiperight", function() {
          prev.click();
        });
      }

      function setKeyboardFn(prev, next) {
        document.addEventListener("keydown", function(e) {
          if (e.which === 37 || e.which === 39) {
            if (e.which === 37) {
              prev.click();
            } else if (e.which === 39) {
              next.click();
            }
          }
        });
      }

      function init() {
        setEqualHeights(elH);
        animateTl(xScrolling, arrows, timeline);
        setSwipeFn(timeline, arrowPrev, arrowNext);
        setKeyboardFn(arrowPrev, arrowNext);
      }

      init();
    };
  };
});