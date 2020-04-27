# MorphCast AI SDK for JavaScript

With MorphCast AI HTML5 SDK, developers can easily add an emotion and demographic analysis layer to their web sites, 
landing pages and Apps, creating exciting, adaptive digital experiences. MorphCast is being used across digital campaigns, 
corporate learning, eLearning, e-commerce, digital out-of-home and many other uses.

## Quick Start

Copy and paste the following code snippet inside the _body_ of an HTML page, or fork [this JSFiddle](https://jsfiddle.net/morphcast/6c0tm4e5).

```html
<body>
...
<script src="https://ai-sdk.morphcast.com/v1.10/ai-sdk.js"></script>
<script>
CY.loader()
  .addModule(CY.modules().FACE_EMOTION.name)
  .load()
  .then(({ start, stop }) => start());

window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
  console.log('Face emotion result', evt.detail);
});
</script>
...
</body>
```

A trial license is automatically generated at the first usage.
Since camera access requires https, you shall serve the web page using http**s**

The SDK will automatically open and manage a camera stream internally, as well as the browser camera request.

Links:

* [Code documentation](https://ai-sdk.morphcast.com/latest/index.html)
* [Website](https://www.morphcast.com/sdk/)
* [License and info](https://www.morphcast.com/contact/)

## Available Modules

Here, a list of available modules:

* FACE_DETECTOR
* FACE_POSE
* FACE_AGE
* FACE_EMOTION
* FACE_GENDER
* FACE_FEATURES
* FACE_AROUSAL_VALENCE
* FACE_ATTENTION
* FACE_WISH

You can combine them as you like, e.g. to load FACE_DETECTOR and FACE_AGE:

```javascript
loader = CY.loader()
      .addModule(CY.modules().FACE_DETECTOR.name, {})
      .addModule(CY.modules().FACE_AGE.name, {})
```

You can find the [complete documentation, here](https://ai-sdk.morphcast.com/latest/index.html).

## Requirements

**Minimum Reccomended**:

-   Wasm Support
-   Javascript Enabled Browser
-   Updated Browser and OS:
    -   Edge 16+
    -   Chrome 67+
    -   Safari 11.3+
    -   FireFox 63+
    -   iOS 11.3+
    -   Android 5+

**KNOWN DEVICE ISSUES**:

-   iOS up to version iOS 11 doesn't support GetUserMedia.
-   iOS up to version iOS 11.3 doesn't support the needed Wasm features.
-   Micorosoft Edge up to version 16 doesn't support Wasm.
-   Microsft Internet Explorer is not supported.
-   Opera mini is not supported.
