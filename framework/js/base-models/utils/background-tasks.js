define([], function () {
    "use strict";

    return new function () {
        let taskHandle = null;
        const taskList = [],
            requestIdleCallback = window.requestIdleCallback || function (handler) {
                const startTime = Date.now();

                return setTimeout(function () {
                    handler({
                        didTimeout: false,
                        timeRemaining: function () {
                            return Math.max(0, 50.0 - (Date.now() - startTime));
                        }
                    });
                }, 1);
            },
            runTaskQueue = function (deadline) {
                while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskList.length) {
                    const task = taskList.shift();

                    task.handler(task.data);
                }

                if (taskList.length) {
                    taskHandle = requestIdleCallback(runTaskQueue, {
                        timeout: 1000
                    });
                } else {
                    taskHandle = 0;
                }
            },
            enqueueTask = function (taskHandler, taskData) {
                taskList.push({
                    handler: taskHandler,
                    data: taskData
                });

                if (!taskHandle) {
                    taskHandle = requestIdleCallback(runTaskQueue, {
                        timeout: 1000
                    });
                }
            };

        return enqueueTask;
    };
});