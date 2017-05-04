var FindProxyForURL = function(init, profiles) {
    return function(url, host) {
        "use strict";
        var result = init, scheme = url.substr(0, url.indexOf(":"));
        do {
            result = profiles[result];
            if (typeof result === "function") result = result(url, host, scheme);
        } while (typeof result !== "string" || result.charCodeAt(0) === 43);
        return result;
    };
}("+local", {
    "+local": function(url, host, scheme) {
       "use strict";
              if (/(?:^|\.)google\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)googleapis\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)gstatic\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)googleusercontent\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)googlesyndication\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)googleadservices\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)docker\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)stackoverflow\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)youtube\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)ytimg\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)slideshare\.net$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)google-analytics\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)doubleclick\.net$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)facebook\.com$/.test(host)) return "+HTTP Proxy";
              if (/(?:^|\.)wordpress\.com$/.test(host)) return "+HTTP Proxy";
              return "DIRECT";
    },
    "+HTTP Proxy": function(url, host, scheme) {
        "use strict";
        if (/^<local>,192\.168\./.test(host)) return "DIRECT";
        return "HTTPS localhost:8443";
    }
});
