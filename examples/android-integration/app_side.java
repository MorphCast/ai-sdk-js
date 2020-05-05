    public class MainActivity extends AppCompatActivity {
        public WebView webview;

        @SuppressLint("SetJavaScriptEnabled")
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            this.webview = this.findViewById(R.id.webview_1);
            this.webview.getSettings().setJavaScriptEnabled(true);
            this.webview.getSettings().setDomStorageEnabled(true);
            this.webview.addJavascriptInterface(new WebAppInterface(this), "NativeApp");
            this.webview.loadUrl("https://demo.morphcast.com/native-app-webview/webview_index_exec.html");
        }
    }

    class WebAppInterface {
        Context mContext;

        /**
        * Instantiate the interface and set the context
        */
        WebAppInterface(Context c) {
          mContext = c;
        }

        @JavascriptInterface
        /**
        * maxSize = Max size in px of the larger side of the frame. You should scale the image yourself before returning
        it (optional)
        */
        public void getFrameFromApp(int maxSize) {
          /*
           * App developer shall implement the following behaviour:

              1) Retrieve the frame you need to analyze with the sdk, it could be a frame from the camera or an image.

           * We suggest to resize frames before passing them to the WebView and to encode them in base64 format
           * Strings are processed faster than binary data through the JavaScript Interface

              2) resize it to maxSize x maxSize (maintaining the aspect ratio)
              3) Convert the frame to Base64
              4) return the Base64 String

           * Be sure that the base64 string starts with the header "data:image/jpeg;base64".
          */

          return res;
        }

        @JavascriptInterface
        /*
        * @type: String-enum in ["AGE","GENDER","EMOTION","FEATURES","POSE","AROUSAL_VALENCE","ATTENTION"]
        * @value: Json-stringified of the result
        */
        public void onDataFromMphSdk(String type, String value) {
        /*
        App developer can use the values returned from the webview to implement the desired behavior
        (e.g update the App view, send data to a custom db ...)
        */
        }
    }