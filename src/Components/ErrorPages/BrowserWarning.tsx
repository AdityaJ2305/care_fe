import { useEffect, useState } from "react";
import browserslist from "browserslist";
import { getUserAgentRegex } from "browserslist-useragent-regexp";
import packageJson from "../../../package.json";
import bowser from "bowser";

const BrowserWarning = () => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [browserInfo, setBrowserInfo] = useState<{ name: string; version: string }>({ name: "", version: "" });

  useEffect(() => {
    const userAgent = window.navigator.userAgent;

    // Get the browserslist configuration from package.json
    const supportedBrowsers = browserslist(packageJson.browserslist.production);

    const regex = getUserAgentRegex({
      browsers: supportedBrowsers,
      allowHigherVersions: true,
      ignorePatch: true,
      ignoreMinor: true,
    });

    if (!regex.test(userAgent)) {
      setIsSupported(false);

      // Use bowser to detect browser name and version
      const browser = bowser.getParser(userAgent).getBrowser();
      const name = browser.name || "Unknown";
      const version = browser.version || "Unknown";

      setBrowserInfo({ name, version });
    }
  }, []);

  if (isSupported) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-50 w-full h-20 bg-gray-800 bg-opacity-60 flex items-center justify-center text-center text-gray-300">
      <div>
        <h2 className="text-lg font-medium">Unsupported Browser</h2>
        <p className="text-sm">
          Your browser ({browserInfo.name} version {browserInfo.version}) is not supported. Please update your browser to the latest version or switch to a supported browser for the best experience.
        </p>
      </div>
    </div>
  );
};

export default BrowserWarning;