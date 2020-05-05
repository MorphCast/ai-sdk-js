import UIKit
import WebKit
import CoreLocation

class ViewController: UIViewController {

    var webView: WKWebView!
    @IBOutlet weak var webViewContainer: UIView!


    override func viewDidLoad() {
        super.viewDidLoad()

        // 1
        let contentController = WKUserContentController()
        contentController.add(self, name: "camera")
        contentController.add(self, name: "data")

        // 2
        let config = WKWebViewConfiguration()
        config.userContentController = contentController

        // 3
        webView = WKWebView(frame: webViewContainer.bounds, configuration: config)

        webView.translatesAutoresizingMaskIntoConstraints = false
        webViewContainer.addSubview(webView)

        webView.leadingAnchor.constraint(equalTo: webViewContainer.leadingAnchor, constant: 0).isActive = true
        webView.trailingAnchor.constraint(equalTo: webViewContainer.trailingAnchor, constant: 0).isActive = true
        webView.topAnchor.constraint(equalTo: webViewContainer.topAnchor, constant: 0).isActive = true
        webView.bottomAnchor.constraint(equalTo: webViewContainer.bottomAnchor, constant: 0).isActive = true


        // 4
        if let url = URL(string: "https://demo.morphcast.com/native-app-webview/ios-index_exec.html") {
            webView.load(URLRequest(url: url))
        }
    }
}

extension ViewController:WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "camera", let dict = message.body as? NSDictionary {
            if let maxSize = dict["value"] as? Int {
                onCameraFrame(maxSize: maxSize)
            }
        }

        if message.name == "data", let dict = message.body as? NSDictionary {
            if let type = dict["type"] as? String, let value = dict["value"] as? String {
                onData(type: type, value: value)
            }
        }
    }

    // JS Callbacks
    private func onCameraFrame(maxSize: Int) {
        /*
         App developer shall implement the following behaviour:

         1) Retrieve the frame you need to analyze with the sdk, it could be a frame from the camera or an image.

         * We suggest to resize frames before passing them to the WebView and to encode them in base64 format
         * Strings are processed faster than binary data through the JavaScript Interface

         2) resize it to maxSize x maxSize (maintaining the aspect ratio)
         3) Convert the frame to Base64
         4) return the Base64 String throught the webView.evaluateJavaScript(...)

         * Be sure that the base64 string starts with the header "data:image/jpeg;base64".

         */

        let base64Image = "...";

        webView.evaluateJavaScript("resolveFrame('\(base64Image)')", completionHandler: nil)
    }

    private func onData(type: String, value: String) {
        /*
         type: String
         ["AGE","GENDER","EMOTION","FEATURES","POSE","AROUSAL_VALENCE","ATTENTION"]
         value: Json-stringified of the result

         App developer can use the values returned from the webview to implement the desired behavior (e.g update the App view, send data to a custom db ...)
         */

        print(type + " " + value);
    }
}