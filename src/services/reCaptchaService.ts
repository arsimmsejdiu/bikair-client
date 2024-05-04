export const getExecutionFunction = (siteKey: string, action: string) => {
    return `window.grecaptcha.execute('${siteKey}', { action: '${action}' }).then(
    function(args) {
      window.ReactNativeWebView.postMessage(args);
    }
  )`;
};

export const patchPostMessageJsCode = `(${String(function () {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = (message: any, targetOrigin: any, transfer: any) => {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
    //On bidouille du js de manière tordue. Forcément TS aime pas trop.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.postMessage = patchedPostMessage;
})})();`;

export const getInvisibleRecaptchaContent = (siteKey: string, action: string) => {
    return `<!DOCTYPE html><html><head>
    <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
    <script>window.grecaptcha.ready(function() { ${getExecutionFunction(siteKey, action)} });</script>
    </head></html>`;
};
