# Running the extension locally

-   Start by installing the dependencies with `npm install`.

While working with the Chrome browser:

-   Run `npm run dev:chrome`. A `./dist` folder will be created containing the extension binaries.
-   Navigate to `chrome://extensions/`. Click "Load unpacked" and select the `./dist` folder created above.
-   The extension should be ready to use.
-   After applying changes, it is recommended that you reload the extension, to make sure the latest changes are applied.
