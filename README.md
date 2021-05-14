# MorphCast AI SDK for HTML5

MorphCast SDK is a native JavaScript engine for Real-Time Face Analysis, based on Deep Neural Networks.

It works directly in the web-browser of mobile and desktop platforms.

User's face is analyzed through the input camera device, at an average speed rate of 10 times per second on a mobile device, and even up to 30 per second on desktop. Output results are returned as ready-to-use events, with data already filtered for your convenience.

## Use cases 

You can easily add an emotion and demographic analysis layer to your website, 
landing page or App, creating exciting, adaptive digital experiences. MorphCast is being used across digital campaigns, 
corporate learning, eLearning, e-commerce, digital out-of-home and many other uses.

You can store all data produced in local memory, in local storage or properly send it to your server.

## Quick Start

Copy and paste the following code snippet inside the _body_ of an HTML page, or fork [this JSFiddle](https://jsfiddle.net/morphcast/6c0tm4e5).

```html
<body>
...
<script src="https://ai-sdk.morphcast.com/v1.14/ai-sdk.js"></script>
<script>
CY.loader()
  .licenseKey("insert-here-your-license-key")
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
    -   Chrome 67+ for Android 5+, or Windows 7+, macOS 10.10+, Linux Ubuntu 14.04+, Debian 8+, openSUSE 13.3+, or Fedora Linux 24+
    -   Safari 11.3+ for iOS 11.3+, or macOS 10.12+
    -   Firefox 63+ for Windows 7+, macOS 10.9+, Linux (GTK+ 3.4, GLib 2.22, Pango 1.22, X.Org 1.0, libstdc++ 4.6.1)
    -   Edge 16+ for Windows 10+

**KNOWN DEVICE ISSUES**:

-   iOS up to version iOS 11 doesn't support GetUserMedia.
-   iOS up to version iOS 11.3 doesn't support the needed Wasm features.
-   Micorosoft Edge up to version 16 doesn't support Wasm.
-   Microsft Internet Explorer is not supported.
-   Opera mini is not supported.
