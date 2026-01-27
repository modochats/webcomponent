(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.ModoWebComponent = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  
  let Chatbot$1 = class Chatbot{name;image;shortDescription;starters=[];voiceChat;createdAt;updatedAt;deletedAt;uuid;allowedHosts=[];id;greetingMessage;uiConfig;constructor(t){this.name=t.name,this.image=t.image,this.shortDescription=t.short_description,this.starters=t.starters,this.voiceChat=t.voice_agent,this.createdAt=t.setting.created_at,this.updatedAt=t.setting.updated_at,this.deletedAt=t.setting.deleted_at,this.uuid=t.setting.unique_id,this.allowedHosts=t.setting.allow_hosts?.split(",")??[],this.id=t.setting.chatbot,this.allowedHosts.push("modochats.com"),this.uiConfig={primaryColor:t.primary_color,foregroundColor:t.foreground_color,theme:t.theme},this.greetingMessage=t.greeting_message;}showTooltip(){const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-toggle-tooltip"),s=t?.container?.querySelector(".mw-toggle-tooltip-text"),i="true"===localStorage.getItem(`modochats:${t?.publicKey}-has-seen-greeting-message`);e&&s&&this.greetingMessage&&!i&&(e.classList.remove("mw-hidden"),s.textContent=this.greetingMessage);}hideTooltip(){const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-toggle-tooltip");e&&e.classList.add("mw-hidden");}};

const VERSION="0.51.0";

const getEnvironment$1=()=>"undefined"!=typeof window&&window.ENVIRONMENT?window.ENVIRONMENT:"undefined"!=typeof process&&process.env?.NODE_ENV?process.env.NODE_ENV.toUpperCase():"PROD",isDev$1="DEV"===getEnvironment$1();"PROD"===getEnvironment$1();const BASE_API_URL$1=isDev$1?"https://dev-api.modochats.com":"https://api.modochats.com",BASE_STORAGE_URL="https://modochats.s3.ir-thr-at1.arvanstorage.ir",NEW_MESSAGE_AUDIO_URL=`${BASE_STORAGE_URL}/new-message.mp3`;

const suspectProtoRx$1 = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx$1 = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx$1 = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform$1(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped$1(key);
    return;
  }
  return value;
}
function warnKeyDropped$1(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr$1(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx$1.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx$1.test(value) || suspectConstructorRx$1.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform$1);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE$1 = /#/g;
const AMPERSAND_RE$1 = /&/g;
const SLASH_RE$1 = /\//g;
const EQUAL_RE$1 = /=/g;
const PLUS_RE$1 = /\+/g;
const ENC_CARET_RE$1 = /%5e/gi;
const ENC_BACKTICK_RE$1 = /%60/gi;
const ENC_PIPE_RE$1 = /%7c/gi;
const ENC_SPACE_RE$1 = /%20/gi;
function encode$1(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE$1, "|");
}
function encodeQueryValue$1(input) {
  return encode$1(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE$1, "%2B").replace(ENC_SPACE_RE$1, "+").replace(HASH_RE$1, "%23").replace(AMPERSAND_RE$1, "%26").replace(ENC_BACKTICK_RE$1, "`").replace(ENC_CARET_RE$1, "^").replace(SLASH_RE$1, "%2F");
}
function encodeQueryKey$1(text) {
  return encodeQueryValue$1(text).replace(EQUAL_RE$1, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey$1(text) {
  return decode$1(text.replace(PLUS_RE$1, " "));
}
function decodeQueryValue$1(text) {
  return decode$1(text.replace(PLUS_RE$1, " "));
}

function parseQuery$1(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey$1(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue$1(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem$1(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey$1(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey$1(key)}=${encodeQueryValue$1(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey$1(key)}=${encodeQueryValue$1(value)}`;
}
function stringifyQuery$1(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem$1(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX$1 = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX$1 = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX$1 = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE$1 = /^\.?\//;
function hasProtocol$1(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX$1.test(inputString);
  }
  return PROTOCOL_REGEX$1.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX$1.test(inputString) : false);
}
function hasTrailingSlash$1(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash$1(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash$1(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash$1(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function withBase$1(input, base) {
  if (isEmptyURL$1(base) || hasProtocol$1(input)) {
    return input;
  }
  const _base = withoutTrailingSlash$1(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL$1(_base, input);
}
function withQuery$1(input, query) {
  const parsed = parseURL$1(input);
  const mergedQuery = { ...parseQuery$1(parsed.search), ...query };
  parsed.search = stringifyQuery$1(mergedQuery);
  return stringifyParsedURL$1(parsed);
}
function isEmptyURL$1(url) {
  return !url || url === "/";
}
function isNonEmptyURL$1(url) {
  return url && url !== "/";
}
function joinURL$1(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL$1(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE$1, "");
      url = withTrailingSlash$1(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative$1 = Symbol.for("ufo:protocolRelative");
function parseURL$1(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol$1(input, { acceptRelative: true })) {
    return parsePath$1(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath$1(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative$1]: !protocol
  };
}
function parsePath$1(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL$1(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative$1] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

let FetchError$1 = class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
};
function createFetchError$1(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError$1(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods$1 = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod$1(method = "GET") {
  return payloadMethods$1.has(method.toUpperCase());
}
function isJSONSerializable$1(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes$1 = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE$1 = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType$1(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE$1.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes$1.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions$1(request, input, defaults, Headers) {
  const headers = mergeHeaders$1(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders$1(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks$1(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes$1 = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses$1 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch$1(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod$1(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes$1.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError$1(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions$1(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks$1(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase$1(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery$1(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod$1(context.options.method)) {
      if (isJSONSerializable$1(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks$1(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses$1.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType$1(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr$1;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks$1(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks$1(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch$1({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

const _globalThis$1 = (function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
})();
const fetch$1 = _globalThis$1.fetch ? (...args) => _globalThis$1.fetch(...args) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
const Headers$1 = _globalThis$1.Headers;
const AbortController$1 = _globalThis$1.AbortController;
const ofetch$1 = createFetch$1({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });

const $fetch$1=ofetch$1.create({baseURL:BASE_API_URL$1});

const fetchChatbot=async e=>await $fetch$1(`/v1/chatbot/public/${e}`),fetchUpdateUserData=async(e,t,s)=>await $fetch$1("/v1/chatbot/customners/set-user-data",{method:"POST",body:{chatbot_uuid:e,unique_id:t,user_data:s}});

/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 */
function shareSameDomainSuffix(hostname, vhost) {
    if (hostname.endsWith(vhost)) {
        return (hostname.length === vhost.length ||
            hostname[hostname.length - vhost.length - 1] === '.');
    }
    return false;
}
/**
 * Given a hostname and its public suffix, extract the general domain.
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
    // Locate the index of the last '.' in the part of the `hostname` preceding
    // the public suffix.
    //
    // examples:
    //   1. not.evil.co.uk  => evil.co.uk
    //         ^    ^
    //         |    | start of public suffix
    //         | index of the last dot
    //
    //   2. example.co.uk   => example.co.uk
    //     ^       ^
    //     |       | start of public suffix
    //     |
    //     | (-1) no dot found before the public suffix
    const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
    const lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);
    // No '.' found, then `hostname` is the general domain (no sub-domain)
    if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
    }
    // Extract the part between the last '.'
    return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
 * Detects the domain based on rules and upon and a host string
 */
function getDomain(suffix, hostname, options) {
    // Check if `hostname` ends with a member of `validHosts`.
    if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (const vhost of validHosts) {
            if ( /*@__INLINE__*/shareSameDomainSuffix(hostname, vhost)) {
                return vhost;
            }
        }
    }
    let numberOfLeadingDots = 0;
    if (hostname.startsWith('.')) {
        while (numberOfLeadingDots < hostname.length &&
            hostname[numberOfLeadingDots] === '.') {
            numberOfLeadingDots += 1;
        }
    }
    // If `hostname` is a valid public suffix, then there is no domain to return.
    // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
    // there is no need to perform a string comparison and we only compare the
    // size.
    if (suffix.length === hostname.length - numberOfLeadingDots) {
        return null;
    }
    // To extract the general domain, we start by identifying the public suffix
    // (if any), then consider the domain to be the public suffix with one added
    // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
    // `co.uk`, then we take one more level: `evil`, giving the final result:
    // `evil.co.uk`).
    return /*@__INLINE__*/ extractDomainWithSuffix(hostname, suffix);
}

/**
 * Return the part of domain without suffix.
 *
 * Example: for domain 'foo.com', the result would be 'foo'.
 */
function getDomainWithoutSuffix(domain, suffix) {
    // Note: here `domain` and `suffix` cannot have the same length because in
    // this case we set `domain` to `null` instead. It is thus safe to assume
    // that `suffix` is shorter than `domain`.
    return domain.slice(0, -suffix.length - 1);
}

/**
 * @param url - URL we want to extract a hostname from.
 * @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
 */
function extractHostname(url, urlIsValidHostname) {
    let start = 0;
    let end = url.length;
    let hasUpper = false;
    // If url is not already a valid hostname, then try to extract hostname.
    if (!urlIsValidHostname) {
        // Special handling of data URLs
        if (url.startsWith('data:')) {
            return null;
        }
        // Trim leading spaces
        while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
        }
        // Trim trailing spaces
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
        }
        // Skip scheme.
        if (url.charCodeAt(start) === 47 /* '/' */ &&
            url.charCodeAt(start + 1) === 47 /* '/' */) {
            start += 2;
        }
        else {
            const indexOfProtocol = url.indexOf(':/', start);
            if (indexOfProtocol !== -1) {
                // Implement fast-path for common protocols. We expect most protocols
                // should be one of these 4 and thus we will not need to perform the
                // more expansive validity check most of the time.
                const protocolSize = indexOfProtocol - start;
                const c0 = url.charCodeAt(start);
                const c1 = url.charCodeAt(start + 1);
                const c2 = url.charCodeAt(start + 2);
                const c3 = url.charCodeAt(start + 3);
                const c4 = url.charCodeAt(start + 4);
                if (protocolSize === 5 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */ &&
                    c4 === 115 /* 's' */) ;
                else if (protocolSize === 4 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */) ;
                else if (protocolSize === 3 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */ &&
                    c2 === 115 /* 's' */) ;
                else if (protocolSize === 2 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */) ;
                else {
                    // Check that scheme is valid
                    for (let i = start; i < indexOfProtocol; i += 1) {
                        const lowerCaseCode = url.charCodeAt(i) | 32;
                        if (!(((lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                            (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                            lowerCaseCode === 46 || // '.'
                            lowerCaseCode === 45 || // '-'
                            lowerCaseCode === 43) // '+'
                        )) {
                            return null;
                        }
                    }
                }
                // Skip 0, 1 or more '/' after ':/'
                start = indexOfProtocol + 2;
                while (url.charCodeAt(start) === 47 /* '/' */) {
                    start += 1;
                }
            }
        }
        // Detect first occurrence of '/', '?' or '#'. We also keep track of the
        // last occurrence of '@', ']' or ':' to speed-up subsequent parsing of
        // (respectively), identifier, ipv6 or port.
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        for (let i = start; i < end; i += 1) {
            const code = url.charCodeAt(i);
            if (code === 35 || // '#'
                code === 47 || // '/'
                code === 63 // '?'
            ) {
                end = i;
                break;
            }
            else if (code === 64) {
                // '@'
                indexOfIdentifier = i;
            }
            else if (code === 93) {
                // ']'
                indexOfClosingBracket = i;
            }
            else if (code === 58) {
                // ':'
                indexOfPort = i;
            }
            else if (code >= 65 && code <= 90) {
                hasUpper = true;
            }
        }
        // Detect identifier: '@'
        if (indexOfIdentifier !== -1 &&
            indexOfIdentifier > start &&
            indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
        }
        // Handle ipv6 addresses
        if (url.charCodeAt(start) === 91 /* '[' */) {
            if (indexOfClosingBracket !== -1) {
                return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
        }
        else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            // Detect port: ':'
            end = indexOfPort;
        }
    }
    // Trim trailing dots
    while (end > start + 1 && url.charCodeAt(end - 1) === 46 /* '.' */) {
        end -= 1;
    }
    const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
    if (hasUpper) {
        return hostname.toLowerCase();
    }
    return hostname;
}

/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
function isProbablyIpv4(hostname) {
    // Cannot be shorted than 1.1.1.1
    if (hostname.length < 7) {
        return false;
    }
    // Cannot be longer than: 255.255.255.255
    if (hostname.length > 15) {
        return false;
    }
    let numberOfDots = 0;
    for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            numberOfDots += 1;
        }
        else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
            return false;
        }
    }
    return (numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 /* '.' */ &&
        hostname.charCodeAt(hostname.length - 1) !== 46 /* '.' */);
}
/**
 * Similar to isProbablyIpv4.
 */
function isProbablyIpv6(hostname) {
    if (hostname.length < 3) {
        return false;
    }
    let start = hostname.startsWith('[') ? 1 : 0;
    let end = hostname.length;
    if (hostname[end - 1] === ']') {
        end -= 1;
    }
    // We only consider the maximum size of a normal IPV6. Note that this will
    // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
    // and a proper validation library should be used for these.
    if (end - start > 39) {
        return false;
    }
    let hasColon = false;
    for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58 /* ':' */) {
            hasColon = true;
        }
        else if (!(((code >= 48 && code <= 57) || // 0-9
            (code >= 97 && code <= 102) || // a-f
            (code >= 65 && code <= 90)) // A-F
        )) {
            return false;
        }
    }
    return hasColon;
}
/**
 * Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
 * This *will not* work on any string. We need `hostname` to be a valid
 * hostname.
 */
function isIp(hostname) {
    return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}

/**
 * Implements fast shallow verification of hostnames. This does not perform a
 * struct check on the content of labels (classes of Unicode characters, etc.)
 * but instead check that the structure is valid (number of labels, length of
 * labels, etc.).
 *
 * If you need stricter validation, consider using an external library.
 */
function isValidAscii(code) {
    return ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127);
}
/**
 * Check if a hostname string is valid. It's usually a preliminary check before
 * trying to use getDomain or anything else.
 *
 * Beware: it does not check if the TLD exists.
 */
function isValidHostname (hostname) {
    if (hostname.length > 255) {
        return false;
    }
    if (hostname.length === 0) {
        return false;
    }
    if (
    /*@__INLINE__*/ !isValidAscii(hostname.charCodeAt(0)) &&
        hostname.charCodeAt(0) !== 46 && // '.' (dot)
        hostname.charCodeAt(0) !== 95 // '_' (underscore)
    ) {
        return false;
    }
    // Validate hostname according to RFC
    let lastDotIndex = -1;
    let lastCharCode = -1;
    const len = hostname.length;
    for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 ||
                // Check that previous character was not already a '.'
                lastCharCode === 46 ||
                // Check that the previous label does not end with a '-' (dash)
                lastCharCode === 45 ||
                // Check that the previous label does not end with a '_' (underscore)
                lastCharCode === 95) {
                return false;
            }
            lastDotIndex = i;
        }
        else if (!( /*@__INLINE__*/(isValidAscii(code) || code === 45 || code === 95))) {
            // Check if there is a forbidden character in the label
            return false;
        }
        lastCharCode = code;
    }
    return (
    // Check that last label is shorter than 63 chars
    len - lastDotIndex - 1 <= 63 &&
        // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45);
}

function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname = true, mixedInputs = true, validHosts = null, validateHostname = true, }) {
    return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        extractHostname,
        mixedInputs,
        validHosts,
        validateHostname,
    };
}
const DEFAULT_OPTIONS = /*@__INLINE__*/ setDefaultsImpl({});
function setDefaults(options) {
    if (options === undefined) {
        return DEFAULT_OPTIONS;
    }
    return /*@__INLINE__*/ setDefaultsImpl(options);
}

/**
 * Returns the subdomain of a hostname string
 */
function getSubdomain(hostname, domain) {
    // If `hostname` and `domain` are the same, then there is no sub-domain
    if (domain.length === hostname.length) {
        return '';
    }
    return hostname.slice(0, -domain.length - 1);
}

/**
 * Implement a factory allowing to plug different implementations of suffix
 * lookup (e.g.: using a trie or the packed hashes datastructures). This is used
 * and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
 */
function getEmptyResult() {
    return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null,
    };
}
function parseImpl(url, step, suffixLookup, partialOptions, result) {
    const options = /*@__INLINE__*/ setDefaults(partialOptions);
    // Very fast approximate check to make sure `url` is a string. This is needed
    // because the library will not necessarily be used in a typed setup and
    // values of arbitrary types might be given as argument.
    if (typeof url !== 'string') {
        return result;
    }
    // Extract hostname from `url` only if needed. This can be made optional
    // using `options.extractHostname`. This option will typically be used
    // whenever we are sure the inputs to `parse` are already hostnames and not
    // arbitrary URLs.
    //
    // `mixedInput` allows to specify if we expect a mix of URLs and hostnames
    // as input. If only hostnames are expected then `extractHostname` can be
    // set to `false` to speed-up parsing. If only URLs are expected then
    // `mixedInputs` can be set to `false`. The `mixedInputs` is only a hint
    // and will not change the behavior of the library.
    if (!options.extractHostname) {
        result.hostname = url;
    }
    else if (options.mixedInputs) {
        result.hostname = extractHostname(url, isValidHostname(url));
    }
    else {
        result.hostname = extractHostname(url, false);
    }
    // Check if `hostname` is a valid ip address
    if (options.detectIp && result.hostname !== null) {
        result.isIp = isIp(result.hostname);
        if (result.isIp) {
            return result;
        }
    }
    // Perform hostname validation if enabled. If hostname is not valid, no need to
    // go further as there will be no valid domain or sub-domain. This validation
    // is applied before any early returns to ensure consistent behavior across
    // all API methods including getHostname().
    if (options.validateHostname &&
        options.extractHostname &&
        result.hostname !== null &&
        !isValidHostname(result.hostname)) {
        result.hostname = null;
        return result;
    }
    if (result.hostname === null) {
        return result;
    }
    // Extract public suffix
    suffixLookup(result.hostname, options, result);
    if (result.publicSuffix === null) {
        return result;
    }
    // Extract domain
    result.domain = getDomain(result.publicSuffix, result.hostname, options);
    if (result.domain === null) {
        return result;
    }
    // Extract subdomain
    result.subdomain = getSubdomain(result.hostname, result.domain);
    // Extract domain without suffix
    result.domainWithoutSuffix = getDomainWithoutSuffix(result.domain, result.publicSuffix);
    return result;
}

function fastPathLookup (hostname, options, out) {
    // Fast path for very popular suffixes; this allows to by-pass lookup
    // completely as well as any extra allocation or string manipulation.
    if (!options.allowPrivateDomains && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 /* 'm' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 99 /* 'c' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'com';
            return true;
        }
        else if (c3 === 103 /* 'g' */ &&
            c2 === 114 /* 'r' */ &&
            c1 === 111 /* 'o' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'org';
            return true;
        }
        else if (c3 === 117 /* 'u' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 101 /* 'e' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'edu';
            return true;
        }
        else if (c3 === 118 /* 'v' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 103 /* 'g' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'gov';
            return true;
        }
        else if (c3 === 116 /* 't' */ &&
            c2 === 101 /* 'e' */ &&
            c1 === 110 /* 'n' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'net';
            return true;
        }
        else if (c3 === 101 /* 'e' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'de';
            return true;
        }
    }
    return false;
}

const exceptions = (function () {
    const _0 = [1, {}], _1 = [0, { "city": _0 }];
    const exceptions = [0, { "ck": [0, { "www": _0 }], "jp": [0, { "kawasaki": _1, "kitakyushu": _1, "kobe": _1, "nagoya": _1, "sapporo": _1, "sendai": _1, "yokohama": _1 }] }];
    return exceptions;
})();
const rules = (function () {
    const _2 = [1, {}], _3 = [2, {}], _4 = [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2 }], _5 = [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 }], _6 = [0, { "*": _3 }], _7 = [2, { "s": _6 }], _8 = [0, { "relay": _3 }], _9 = [2, { "id": _3 }], _10 = [1, { "gov": _2 }], _11 = [0, { "airflow": _6, "lambda-url": _3, "transfer-webapp": _3 }], _12 = [0, { "airflow": _6, "transfer-webapp": _3 }], _13 = [0, { "transfer-webapp": _3, "transfer-webapp-fips": _3 }], _14 = [0, { "notebook": _3, "studio": _3 }], _15 = [0, { "labeling": _3, "notebook": _3, "studio": _3 }], _16 = [0, { "notebook": _3 }], _17 = [0, { "labeling": _3, "notebook": _3, "notebook-fips": _3, "studio": _3 }], _18 = [0, { "notebook": _3, "notebook-fips": _3, "studio": _3, "studio-fips": _3 }], _19 = [0, { "shop": _3 }], _20 = [0, { "*": _2 }], _21 = [1, { "co": _3 }], _22 = [0, { "objects": _3 }], _23 = [2, { "nodes": _3 }], _24 = [0, { "my": _3 }], _25 = [0, { "s3": _3, "s3-accesspoint": _3, "s3-website": _3 }], _26 = [0, { "s3": _3, "s3-accesspoint": _3 }], _27 = [0, { "direct": _3 }], _28 = [0, { "webview-assets": _3 }], _29 = [0, { "vfs": _3, "webview-assets": _3 }], _30 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3, "aws-cloud9": _28, "cloud9": _29 }], _31 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _26, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3, "aws-cloud9": _28, "cloud9": _29 }], _32 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3, "analytics-gateway": _3, "aws-cloud9": _28, "cloud9": _29 }], _33 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3 }], _34 = [0, { "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-fips": _3, "s3-website": _3 }], _35 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _34, "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-fips": _3, "s3-object-lambda": _3, "s3-website": _3, "aws-cloud9": _28, "cloud9": _29 }], _36 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _34, "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-deprecated": _3, "s3-fips": _3, "s3-object-lambda": _3, "s3-website": _3, "analytics-gateway": _3, "aws-cloud9": _28, "cloud9": _29 }], _37 = [0, { "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-fips": _3 }], _38 = [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _37, "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-fips": _3, "s3-object-lambda": _3, "s3-website": _3 }], _39 = [0, { "auth": _3 }], _40 = [0, { "auth": _3, "auth-fips": _3 }], _41 = [0, { "auth-fips": _3 }], _42 = [0, { "apps": _3 }], _43 = [0, { "paas": _3 }], _44 = [2, { "eu": _3 }], _45 = [0, { "app": _3 }], _46 = [0, { "site": _3 }], _47 = [1, { "com": _2, "edu": _2, "net": _2, "org": _2 }], _48 = [0, { "j": _3 }], _49 = [0, { "dyn": _3 }], _50 = [2, { "web": _3 }], _51 = [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2 }], _52 = [0, { "p": _3 }], _53 = [0, { "user": _3 }], _54 = [0, { "cdn": _3 }], _55 = [2, { "raw": _6 }], _56 = [0, { "cust": _3, "reservd": _3 }], _57 = [0, { "cust": _3 }], _58 = [0, { "s3": _3 }], _59 = [1, { "biz": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "net": _2, "org": _2 }], _60 = [0, { "ipfs": _3 }], _61 = [1, { "framer": _3 }], _62 = [0, { "forgot": _3 }], _63 = [1, { "gs": _2 }], _64 = [0, { "nes": _2 }], _65 = [1, { "k12": _2, "cc": _2, "lib": _2 }], _66 = [1, { "cc": _2 }], _67 = [1, { "cc": _2, "lib": _2 }];
    const rules = [0, { "ac": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "drr": _3, "feedback": _3, "forms": _3 }], "ad": _2, "ae": [1, { "ac": _2, "co": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "sch": _2 }], "aero": [1, { "airline": _2, "airport": _2, "accident-investigation": _2, "accident-prevention": _2, "aerobatic": _2, "aeroclub": _2, "aerodrome": _2, "agents": _2, "air-surveillance": _2, "air-traffic-control": _2, "aircraft": _2, "airtraffic": _2, "ambulance": _2, "association": _2, "author": _2, "ballooning": _2, "broker": _2, "caa": _2, "cargo": _2, "catering": _2, "certification": _2, "championship": _2, "charter": _2, "civilaviation": _2, "club": _2, "conference": _2, "consultant": _2, "consulting": _2, "control": _2, "council": _2, "crew": _2, "design": _2, "dgca": _2, "educator": _2, "emergency": _2, "engine": _2, "engineer": _2, "entertainment": _2, "equipment": _2, "exchange": _2, "express": _2, "federation": _2, "flight": _2, "freight": _2, "fuel": _2, "gliding": _2, "government": _2, "groundhandling": _2, "group": _2, "hanggliding": _2, "homebuilt": _2, "insurance": _2, "journal": _2, "journalist": _2, "leasing": _2, "logistics": _2, "magazine": _2, "maintenance": _2, "marketplace": _2, "media": _2, "microlight": _2, "modelling": _2, "navigation": _2, "parachuting": _2, "paragliding": _2, "passenger-association": _2, "pilot": _2, "press": _2, "production": _2, "recreation": _2, "repbody": _2, "res": _2, "research": _2, "rotorcraft": _2, "safety": _2, "scientist": _2, "services": _2, "show": _2, "skydiving": _2, "software": _2, "student": _2, "taxi": _2, "trader": _2, "trading": _2, "trainer": _2, "union": _2, "workinggroup": _2, "works": _2 }], "af": _4, "ag": [1, { "co": _2, "com": _2, "net": _2, "nom": _2, "org": _2, "obj": _3 }], "ai": [1, { "com": _2, "net": _2, "off": _2, "org": _2, "uwu": _3, "framer": _3 }], "al": _5, "am": [1, { "co": _2, "com": _2, "commune": _2, "net": _2, "org": _2, "radio": _3 }], "ao": [1, { "co": _2, "ed": _2, "edu": _2, "gov": _2, "gv": _2, "it": _2, "og": _2, "org": _2, "pb": _2 }], "aq": _2, "ar": [1, { "bet": _2, "com": _2, "coop": _2, "edu": _2, "gob": _2, "gov": _2, "int": _2, "mil": _2, "musica": _2, "mutual": _2, "net": _2, "org": _2, "seg": _2, "senasa": _2, "tur": _2 }], "arpa": [1, { "e164": _2, "home": _2, "in-addr": _2, "ip6": _2, "iris": _2, "uri": _2, "urn": _2 }], "as": _10, "asia": [1, { "cloudns": _3, "daemon": _3, "dix": _3 }], "at": [1, { "4": _3, "ac": [1, { "sth": _2 }], "co": _2, "gv": _2, "or": _2, "funkfeuer": [0, { "wien": _3 }], "futurecms": [0, { "*": _3, "ex": _6, "in": _6 }], "futurehosting": _3, "futuremailing": _3, "ortsinfo": [0, { "ex": _6, "kunden": _6 }], "biz": _3, "info": _3, "123webseite": _3, "priv": _3, "my": _3, "myspreadshop": _3, "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3 }], "au": [1, { "asn": _2, "com": [1, { "cloudlets": [0, { "mel": _3 }], "myspreadshop": _3 }], "edu": [1, { "act": _2, "catholic": _2, "nsw": _2, "nt": _2, "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2 }], "gov": [1, { "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2 }], "id": _2, "net": _2, "org": _2, "conf": _2, "oz": _2, "act": _2, "nsw": _2, "nt": _2, "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2, "hrsn": [0, { "vps": _3 }] }], "aw": [1, { "com": _2 }], "ax": _2, "az": [1, { "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "int": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "pp": _2, "pro": _2 }], "ba": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "brendly": _19, "rs": _3 }], "bb": [1, { "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "net": _2, "org": _2, "store": _2, "tv": _2 }], "bd": [1, { "ac": _2, "ai": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "id": _2, "info": _2, "it": _2, "mil": _2, "net": _2, "org": _2, "sch": _2, "tv": _2 }], "be": [1, { "ac": _2, "cloudns": _3, "webhosting": _3, "interhostsolutions": [0, { "cloud": _3 }], "kuleuven": [0, { "ezproxy": _3 }], "123website": _3, "myspreadshop": _3, "transurl": _6 }], "bf": _10, "bg": [1, { "0": _2, "1": _2, "2": _2, "3": _2, "4": _2, "5": _2, "6": _2, "7": _2, "8": _2, "9": _2, "a": _2, "b": _2, "c": _2, "d": _2, "e": _2, "f": _2, "g": _2, "h": _2, "i": _2, "j": _2, "k": _2, "l": _2, "m": _2, "n": _2, "o": _2, "p": _2, "q": _2, "r": _2, "s": _2, "t": _2, "u": _2, "v": _2, "w": _2, "x": _2, "y": _2, "z": _2, "barsy": _3 }], "bh": _4, "bi": [1, { "co": _2, "com": _2, "edu": _2, "or": _2, "org": _2 }], "biz": [1, { "activetrail": _3, "cloud-ip": _3, "cloudns": _3, "jozi": _3, "dyndns": _3, "for-better": _3, "for-more": _3, "for-some": _3, "for-the": _3, "selfip": _3, "webhop": _3, "orx": _3, "mmafan": _3, "myftp": _3, "no-ip": _3, "dscloud": _3 }], "bj": [1, { "africa": _2, "agro": _2, "architectes": _2, "assur": _2, "avocats": _2, "co": _2, "com": _2, "eco": _2, "econo": _2, "edu": _2, "info": _2, "loisirs": _2, "money": _2, "net": _2, "org": _2, "ote": _2, "restaurant": _2, "resto": _2, "tourism": _2, "univ": _2 }], "bm": _4, "bn": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "co": _3 }], "bo": [1, { "com": _2, "edu": _2, "gob": _2, "int": _2, "mil": _2, "net": _2, "org": _2, "tv": _2, "web": _2, "academia": _2, "agro": _2, "arte": _2, "blog": _2, "bolivia": _2, "ciencia": _2, "cooperativa": _2, "democracia": _2, "deporte": _2, "ecologia": _2, "economia": _2, "empresa": _2, "indigena": _2, "industria": _2, "info": _2, "medicina": _2, "movimiento": _2, "musica": _2, "natural": _2, "nombre": _2, "noticias": _2, "patria": _2, "plurinacional": _2, "politica": _2, "profesional": _2, "pueblo": _2, "revista": _2, "salud": _2, "tecnologia": _2, "tksat": _2, "transporte": _2, "wiki": _2 }], "br": [1, { "9guacu": _2, "abc": _2, "adm": _2, "adv": _2, "agr": _2, "aju": _2, "am": _2, "anani": _2, "aparecida": _2, "api": _2, "app": _2, "arq": _2, "art": _2, "ato": _2, "b": _2, "barueri": _2, "belem": _2, "bet": _2, "bhz": _2, "bib": _2, "bio": _2, "blog": _2, "bmd": _2, "boavista": _2, "bsb": _2, "campinagrande": _2, "campinas": _2, "caxias": _2, "cim": _2, "cng": _2, "cnt": _2, "com": [1, { "simplesite": _3 }], "contagem": _2, "coop": _2, "coz": _2, "cri": _2, "cuiaba": _2, "curitiba": _2, "def": _2, "des": _2, "det": _2, "dev": _2, "ecn": _2, "eco": _2, "edu": _2, "emp": _2, "enf": _2, "eng": _2, "esp": _2, "etc": _2, "eti": _2, "far": _2, "feira": _2, "flog": _2, "floripa": _2, "fm": _2, "fnd": _2, "fortal": _2, "fot": _2, "foz": _2, "fst": _2, "g12": _2, "geo": _2, "ggf": _2, "goiania": _2, "gov": [1, { "ac": _2, "al": _2, "am": _2, "ap": _2, "ba": _2, "ce": _2, "df": _2, "es": _2, "go": _2, "ma": _2, "mg": _2, "ms": _2, "mt": _2, "pa": _2, "pb": _2, "pe": _2, "pi": _2, "pr": _2, "rj": _2, "rn": _2, "ro": _2, "rr": _2, "rs": _2, "sc": _2, "se": _2, "sp": _2, "to": _2 }], "gru": _2, "ia": _2, "imb": _2, "ind": _2, "inf": _2, "jab": _2, "jampa": _2, "jdf": _2, "joinville": _2, "jor": _2, "jus": _2, "leg": [1, { "ac": _3, "al": _3, "am": _3, "ap": _3, "ba": _3, "ce": _3, "df": _3, "es": _3, "go": _3, "ma": _3, "mg": _3, "ms": _3, "mt": _3, "pa": _3, "pb": _3, "pe": _3, "pi": _3, "pr": _3, "rj": _3, "rn": _3, "ro": _3, "rr": _3, "rs": _3, "sc": _3, "se": _3, "sp": _3, "to": _3 }], "leilao": _2, "lel": _2, "log": _2, "londrina": _2, "macapa": _2, "maceio": _2, "manaus": _2, "maringa": _2, "mat": _2, "med": _2, "mil": _2, "morena": _2, "mp": _2, "mus": _2, "natal": _2, "net": _2, "niteroi": _2, "nom": _20, "not": _2, "ntr": _2, "odo": _2, "ong": _2, "org": _2, "osasco": _2, "palmas": _2, "poa": _2, "ppg": _2, "pro": _2, "psc": _2, "psi": _2, "pvh": _2, "qsl": _2, "radio": _2, "rec": _2, "recife": _2, "rep": _2, "ribeirao": _2, "rio": _2, "riobranco": _2, "riopreto": _2, "salvador": _2, "sampa": _2, "santamaria": _2, "santoandre": _2, "saobernardo": _2, "saogonca": _2, "seg": _2, "sjc": _2, "slg": _2, "slz": _2, "social": _2, "sorocaba": _2, "srv": _2, "taxi": _2, "tc": _2, "tec": _2, "teo": _2, "the": _2, "tmp": _2, "trd": _2, "tur": _2, "tv": _2, "udi": _2, "vet": _2, "vix": _2, "vlog": _2, "wiki": _2, "xyz": _2, "zlg": _2, "tche": _3 }], "bs": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "we": _3 }], "bt": _4, "bv": _2, "bw": [1, { "ac": _2, "co": _2, "gov": _2, "net": _2, "org": _2 }], "by": [1, { "gov": _2, "mil": _2, "com": _2, "of": _2, "mediatech": _3 }], "bz": [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "za": _3, "mydns": _3, "gsj": _3 }], "ca": [1, { "ab": _2, "bc": _2, "mb": _2, "nb": _2, "nf": _2, "nl": _2, "ns": _2, "nt": _2, "nu": _2, "on": _2, "pe": _2, "qc": _2, "sk": _2, "yk": _2, "gc": _2, "barsy": _3, "awdev": _6, "co": _3, "no-ip": _3, "onid": _3, "myspreadshop": _3, "box": _3 }], "cat": _2, "cc": [1, { "cleverapps": _3, "cloud-ip": _3, "cloudns": _3, "ftpaccess": _3, "game-server": _3, "myphotos": _3, "scrapping": _3, "twmail": _3, "csx": _3, "fantasyleague": _3, "spawn": [0, { "instances": _3 }] }], "cd": _10, "cf": _2, "cg": _2, "ch": [1, { "square7": _3, "cloudns": _3, "cloudscale": [0, { "cust": _3, "lpg": _22, "rma": _22 }], "objectstorage": [0, { "lpg": _3, "rma": _3 }], "flow": [0, { "ae": [0, { "alp1": _3 }], "appengine": _3 }], "linkyard-cloud": _3, "gotdns": _3, "dnsking": _3, "123website": _3, "myspreadshop": _3, "firenet": [0, { "*": _3, "svc": _6 }], "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3 }], "ci": [1, { "ac": _2, "xn--aroport-bya": _2, "aéroport": _2, "asso": _2, "co": _2, "com": _2, "ed": _2, "edu": _2, "go": _2, "gouv": _2, "int": _2, "net": _2, "or": _2, "org": _2 }], "ck": _20, "cl": [1, { "co": _2, "gob": _2, "gov": _2, "mil": _2, "cloudns": _3 }], "cm": [1, { "co": _2, "com": _2, "gov": _2, "net": _2 }], "cn": [1, { "ac": _2, "com": [1, { "amazonaws": [0, { "cn-north-1": [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "rds": _6, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-deprecated": _3, "s3-object-lambda": _3, "s3-website": _3 }], "cn-northwest-1": [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "rds": _6, "dualstack": _26, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3 }], "compute": _6, "airflow": [0, { "cn-north-1": _6, "cn-northwest-1": _6 }], "eb": [0, { "cn-north-1": _3, "cn-northwest-1": _3 }], "elb": _6 }], "amazonwebservices": [0, { "on": [0, { "cn-north-1": _12, "cn-northwest-1": _12 }] }], "sagemaker": [0, { "cn-north-1": _14, "cn-northwest-1": _14 }] }], "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "xn--55qx5d": _2, "公司": _2, "xn--od0alg": _2, "網絡": _2, "xn--io0a7i": _2, "网络": _2, "ah": _2, "bj": _2, "cq": _2, "fj": _2, "gd": _2, "gs": _2, "gx": _2, "gz": _2, "ha": _2, "hb": _2, "he": _2, "hi": _2, "hk": _2, "hl": _2, "hn": _2, "jl": _2, "js": _2, "jx": _2, "ln": _2, "mo": _2, "nm": _2, "nx": _2, "qh": _2, "sc": _2, "sd": _2, "sh": [1, { "as": _3 }], "sn": _2, "sx": _2, "tj": _2, "tw": _2, "xj": _2, "xz": _2, "yn": _2, "zj": _2, "canva-apps": _3, "canvasite": _24, "myqnapcloud": _3, "quickconnect": _27 }], "co": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "carrd": _3, "crd": _3, "otap": _6, "hidns": _3, "leadpages": _3, "lpages": _3, "mypi": _3, "xmit": _6, "firewalledreplit": _9, "repl": _9, "supabase": [2, { "realtime": _3, "storage": _3 }], "umso": _3 }], "com": [1, { "a2hosted": _3, "cpserver": _3, "adobeaemcloud": [2, { "dev": _6 }], "africa": _3, "aivencloud": _3, "alibabacloudcs": _3, "kasserver": _3, "amazonaws": [0, { "af-south-1": _30, "ap-east-1": _31, "ap-northeast-1": _32, "ap-northeast-2": _32, "ap-northeast-3": _30, "ap-south-1": _32, "ap-south-2": _33, "ap-southeast-1": _32, "ap-southeast-2": _32, "ap-southeast-3": _33, "ap-southeast-4": _33, "ap-southeast-5": [0, { "execute-api": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-deprecated": _3, "s3-object-lambda": _3, "s3-website": _3 }], "ca-central-1": _35, "ca-west-1": [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _34, "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-fips": _3, "s3-object-lambda": _3, "s3-website": _3 }], "eu-central-1": _32, "eu-central-2": _33, "eu-north-1": _31, "eu-south-1": _30, "eu-south-2": _33, "eu-west-1": [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-deprecated": _3, "s3-object-lambda": _3, "s3-website": _3, "analytics-gateway": _3, "aws-cloud9": _28, "cloud9": _29 }], "eu-west-2": _31, "eu-west-3": _30, "il-central-1": [0, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _25, "s3": _3, "s3-accesspoint": _3, "s3-object-lambda": _3, "s3-website": _3, "aws-cloud9": _28, "cloud9": [0, { "vfs": _3 }] }], "me-central-1": _33, "me-south-1": _31, "sa-east-1": _30, "us-east-1": [2, { "execute-api": _3, "emrappui-prod": _3, "emrnotebooks-prod": _3, "emrstudio-prod": _3, "dualstack": _34, "s3": _3, "s3-accesspoint": _3, "s3-accesspoint-fips": _3, "s3-deprecated": _3, "s3-fips": _3, "s3-object-lambda": _3, "s3-website": _3, "analytics-gateway": _3, "aws-cloud9": _28, "cloud9": _29 }], "us-east-2": _36, "us-gov-east-1": _38, "us-gov-west-1": _38, "us-west-1": _35, "us-west-2": _36, "compute": _6, "compute-1": _6, "airflow": [0, { "af-south-1": _6, "ap-east-1": _6, "ap-northeast-1": _6, "ap-northeast-2": _6, "ap-northeast-3": _6, "ap-south-1": _6, "ap-south-2": _6, "ap-southeast-1": _6, "ap-southeast-2": _6, "ap-southeast-3": _6, "ap-southeast-4": _6, "ap-southeast-5": _6, "ap-southeast-7": _6, "ca-central-1": _6, "ca-west-1": _6, "eu-central-1": _6, "eu-central-2": _6, "eu-north-1": _6, "eu-south-1": _6, "eu-south-2": _6, "eu-west-1": _6, "eu-west-2": _6, "eu-west-3": _6, "il-central-1": _6, "me-central-1": _6, "me-south-1": _6, "sa-east-1": _6, "us-east-1": _6, "us-east-2": _6, "us-west-1": _6, "us-west-2": _6 }], "rds": [0, { "af-south-1": _6, "ap-east-1": _6, "ap-east-2": _6, "ap-northeast-1": _6, "ap-northeast-2": _6, "ap-northeast-3": _6, "ap-south-1": _6, "ap-south-2": _6, "ap-southeast-1": _6, "ap-southeast-2": _6, "ap-southeast-3": _6, "ap-southeast-4": _6, "ap-southeast-5": _6, "ap-southeast-6": _6, "ap-southeast-7": _6, "ca-central-1": _6, "ca-west-1": _6, "eu-central-1": _6, "eu-central-2": _6, "eu-west-1": _6, "eu-west-2": _6, "eu-west-3": _6, "il-central-1": _6, "me-central-1": _6, "me-south-1": _6, "mx-central-1": _6, "sa-east-1": _6, "us-east-1": _6, "us-east-2": _6, "us-gov-east-1": _6, "us-gov-west-1": _6, "us-northeast-1": _6, "us-west-1": _6, "us-west-2": _6 }], "s3": _3, "s3-1": _3, "s3-ap-east-1": _3, "s3-ap-northeast-1": _3, "s3-ap-northeast-2": _3, "s3-ap-northeast-3": _3, "s3-ap-south-1": _3, "s3-ap-southeast-1": _3, "s3-ap-southeast-2": _3, "s3-ca-central-1": _3, "s3-eu-central-1": _3, "s3-eu-north-1": _3, "s3-eu-west-1": _3, "s3-eu-west-2": _3, "s3-eu-west-3": _3, "s3-external-1": _3, "s3-fips-us-gov-east-1": _3, "s3-fips-us-gov-west-1": _3, "s3-global": [0, { "accesspoint": [0, { "mrap": _3 }] }], "s3-me-south-1": _3, "s3-sa-east-1": _3, "s3-us-east-2": _3, "s3-us-gov-east-1": _3, "s3-us-gov-west-1": _3, "s3-us-west-1": _3, "s3-us-west-2": _3, "s3-website-ap-northeast-1": _3, "s3-website-ap-southeast-1": _3, "s3-website-ap-southeast-2": _3, "s3-website-eu-west-1": _3, "s3-website-sa-east-1": _3, "s3-website-us-east-1": _3, "s3-website-us-gov-west-1": _3, "s3-website-us-west-1": _3, "s3-website-us-west-2": _3, "elb": _6 }], "amazoncognito": [0, { "af-south-1": _39, "ap-east-1": _39, "ap-northeast-1": _39, "ap-northeast-2": _39, "ap-northeast-3": _39, "ap-south-1": _39, "ap-south-2": _39, "ap-southeast-1": _39, "ap-southeast-2": _39, "ap-southeast-3": _39, "ap-southeast-4": _39, "ap-southeast-5": _39, "ap-southeast-7": _39, "ca-central-1": _39, "ca-west-1": _39, "eu-central-1": _39, "eu-central-2": _39, "eu-north-1": _39, "eu-south-1": _39, "eu-south-2": _39, "eu-west-1": _39, "eu-west-2": _39, "eu-west-3": _39, "il-central-1": _39, "me-central-1": _39, "me-south-1": _39, "mx-central-1": _39, "sa-east-1": _39, "us-east-1": _40, "us-east-2": _40, "us-gov-east-1": _41, "us-gov-west-1": _41, "us-west-1": _40, "us-west-2": _40 }], "amplifyapp": _3, "awsapprunner": _6, "awsapps": _3, "elasticbeanstalk": [2, { "af-south-1": _3, "ap-east-1": _3, "ap-northeast-1": _3, "ap-northeast-2": _3, "ap-northeast-3": _3, "ap-south-1": _3, "ap-southeast-1": _3, "ap-southeast-2": _3, "ap-southeast-3": _3, "ap-southeast-5": _3, "ap-southeast-7": _3, "ca-central-1": _3, "eu-central-1": _3, "eu-north-1": _3, "eu-south-1": _3, "eu-south-2": _3, "eu-west-1": _3, "eu-west-2": _3, "eu-west-3": _3, "il-central-1": _3, "me-central-1": _3, "me-south-1": _3, "sa-east-1": _3, "us-east-1": _3, "us-east-2": _3, "us-gov-east-1": _3, "us-gov-west-1": _3, "us-west-1": _3, "us-west-2": _3 }], "awsglobalaccelerator": _3, "siiites": _3, "appspacehosted": _3, "appspaceusercontent": _3, "on-aptible": _3, "myasustor": _3, "balena-devices": _3, "boutir": _3, "bplaced": _3, "cafjs": _3, "canva-apps": _3, "canva-hosted-embed": _3, "canvacode": _3, "rice-labs": _3, "cdn77-storage": _3, "br": _3, "cn": _3, "de": _3, "eu": _3, "jpn": _3, "mex": _3, "ru": _3, "sa": _3, "uk": _3, "us": _3, "za": _3, "clever-cloud": [0, { "services": _6 }], "abrdns": _3, "dnsabr": _3, "ip-ddns": _3, "jdevcloud": _3, "wpdevcloud": _3, "cf-ipfs": _3, "cloudflare-ipfs": _3, "trycloudflare": _3, "co": _3, "devinapps": _6, "builtwithdark": _3, "datadetect": [0, { "demo": _3, "instance": _3 }], "dattolocal": _3, "dattorelay": _3, "dattoweb": _3, "mydatto": _3, "digitaloceanspaces": _6, "discordsays": _3, "discordsez": _3, "drayddns": _3, "dreamhosters": _3, "durumis": _3, "blogdns": _3, "cechire": _3, "dnsalias": _3, "dnsdojo": _3, "doesntexist": _3, "dontexist": _3, "doomdns": _3, "dyn-o-saur": _3, "dynalias": _3, "dyndns-at-home": _3, "dyndns-at-work": _3, "dyndns-blog": _3, "dyndns-free": _3, "dyndns-home": _3, "dyndns-ip": _3, "dyndns-mail": _3, "dyndns-office": _3, "dyndns-pics": _3, "dyndns-remote": _3, "dyndns-server": _3, "dyndns-web": _3, "dyndns-wiki": _3, "dyndns-work": _3, "est-a-la-maison": _3, "est-a-la-masion": _3, "est-le-patron": _3, "est-mon-blogueur": _3, "from-ak": _3, "from-al": _3, "from-ar": _3, "from-ca": _3, "from-ct": _3, "from-dc": _3, "from-de": _3, "from-fl": _3, "from-ga": _3, "from-hi": _3, "from-ia": _3, "from-id": _3, "from-il": _3, "from-in": _3, "from-ks": _3, "from-ky": _3, "from-ma": _3, "from-md": _3, "from-mi": _3, "from-mn": _3, "from-mo": _3, "from-ms": _3, "from-mt": _3, "from-nc": _3, "from-nd": _3, "from-ne": _3, "from-nh": _3, "from-nj": _3, "from-nm": _3, "from-nv": _3, "from-oh": _3, "from-ok": _3, "from-or": _3, "from-pa": _3, "from-pr": _3, "from-ri": _3, "from-sc": _3, "from-sd": _3, "from-tn": _3, "from-tx": _3, "from-ut": _3, "from-va": _3, "from-vt": _3, "from-wa": _3, "from-wi": _3, "from-wv": _3, "from-wy": _3, "getmyip": _3, "gotdns": _3, "hobby-site": _3, "homelinux": _3, "homeunix": _3, "iamallama": _3, "is-a-anarchist": _3, "is-a-blogger": _3, "is-a-bookkeeper": _3, "is-a-bulls-fan": _3, "is-a-caterer": _3, "is-a-chef": _3, "is-a-conservative": _3, "is-a-cpa": _3, "is-a-cubicle-slave": _3, "is-a-democrat": _3, "is-a-designer": _3, "is-a-doctor": _3, "is-a-financialadvisor": _3, "is-a-geek": _3, "is-a-green": _3, "is-a-guru": _3, "is-a-hard-worker": _3, "is-a-hunter": _3, "is-a-landscaper": _3, "is-a-lawyer": _3, "is-a-liberal": _3, "is-a-libertarian": _3, "is-a-llama": _3, "is-a-musician": _3, "is-a-nascarfan": _3, "is-a-nurse": _3, "is-a-painter": _3, "is-a-personaltrainer": _3, "is-a-photographer": _3, "is-a-player": _3, "is-a-republican": _3, "is-a-rockstar": _3, "is-a-socialist": _3, "is-a-student": _3, "is-a-teacher": _3, "is-a-techie": _3, "is-a-therapist": _3, "is-an-accountant": _3, "is-an-actor": _3, "is-an-actress": _3, "is-an-anarchist": _3, "is-an-artist": _3, "is-an-engineer": _3, "is-an-entertainer": _3, "is-certified": _3, "is-gone": _3, "is-into-anime": _3, "is-into-cars": _3, "is-into-cartoons": _3, "is-into-games": _3, "is-leet": _3, "is-not-certified": _3, "is-slick": _3, "is-uberleet": _3, "is-with-theband": _3, "isa-geek": _3, "isa-hockeynut": _3, "issmarterthanyou": _3, "likes-pie": _3, "likescandy": _3, "neat-url": _3, "saves-the-whales": _3, "selfip": _3, "sells-for-less": _3, "sells-for-u": _3, "servebbs": _3, "simple-url": _3, "space-to-rent": _3, "teaches-yoga": _3, "writesthisblog": _3, "ddnsfree": _3, "ddnsgeek": _3, "giize": _3, "gleeze": _3, "kozow": _3, "loseyourip": _3, "ooguy": _3, "theworkpc": _3, "mytuleap": _3, "tuleap-partners": _3, "encoreapi": _3, "evennode": [0, { "eu-1": _3, "eu-2": _3, "eu-3": _3, "eu-4": _3, "us-1": _3, "us-2": _3, "us-3": _3, "us-4": _3 }], "onfabrica": _3, "fastly-edge": _3, "fastly-terrarium": _3, "fastvps-server": _3, "mydobiss": _3, "firebaseapp": _3, "fldrv": _3, "forgeblocks": _3, "framercanvas": _3, "freebox-os": _3, "freeboxos": _3, "freemyip": _3, "aliases121": _3, "gentapps": _3, "gentlentapis": _3, "githubusercontent": _3, "0emm": _6, "appspot": [2, { "r": _6 }], "blogspot": _3, "codespot": _3, "googleapis": _3, "googlecode": _3, "pagespeedmobilizer": _3, "withgoogle": _3, "withyoutube": _3, "grayjayleagues": _3, "hatenablog": _3, "hatenadiary": _3, "herokuapp": _3, "gr": _3, "smushcdn": _3, "wphostedmail": _3, "wpmucdn": _3, "pixolino": _3, "apps-1and1": _3, "live-website": _3, "webspace-host": _3, "dopaas": _3, "hosted-by-previder": _43, "hosteur": [0, { "rag-cloud": _3, "rag-cloud-ch": _3 }], "ik-server": [0, { "jcloud": _3, "jcloud-ver-jpc": _3 }], "jelastic": [0, { "demo": _3 }], "massivegrid": _43, "wafaicloud": [0, { "jed": _3, "ryd": _3 }], "eu1-plenit": _3, "la1-plenit": _3, "us1-plenit": _3, "webadorsite": _3, "joyent": [0, { "cns": _6 }], "on-forge": _3, "on-vapor": _3, "lpusercontent": _3, "linode": [0, { "members": _3, "nodebalancer": _6 }], "linodeobjects": _6, "linodeusercontent": [0, { "ip": _3 }], "localtonet": _3, "lovableproject": _3, "barsycenter": _3, "barsyonline": _3, "lutrausercontent": _6, "modelscape": _3, "mwcloudnonprod": _3, "polyspace": _3, "mazeplay": _3, "miniserver": _3, "atmeta": _3, "fbsbx": _42, "meteorapp": _44, "routingthecloud": _3, "same-app": _3, "same-preview": _3, "mydbserver": _3, "mochausercontent": _3, "hostedpi": _3, "mythic-beasts": [0, { "caracal": _3, "customer": _3, "fentiger": _3, "lynx": _3, "ocelot": _3, "oncilla": _3, "onza": _3, "sphinx": _3, "vs": _3, "x": _3, "yali": _3 }], "nospamproxy": [0, { "cloud": [2, { "o365": _3 }] }], "4u": _3, "nfshost": _3, "3utilities": _3, "blogsyte": _3, "ciscofreak": _3, "damnserver": _3, "ddnsking": _3, "ditchyourip": _3, "dnsiskinky": _3, "dynns": _3, "geekgalaxy": _3, "health-carereform": _3, "homesecuritymac": _3, "homesecuritypc": _3, "myactivedirectory": _3, "mysecuritycamera": _3, "myvnc": _3, "net-freaks": _3, "onthewifi": _3, "point2this": _3, "quicksytes": _3, "securitytactics": _3, "servebeer": _3, "servecounterstrike": _3, "serveexchange": _3, "serveftp": _3, "servegame": _3, "servehalflife": _3, "servehttp": _3, "servehumour": _3, "serveirc": _3, "servemp3": _3, "servep2p": _3, "servepics": _3, "servequake": _3, "servesarcasm": _3, "stufftoread": _3, "unusualperson": _3, "workisboring": _3, "myiphost": _3, "observableusercontent": [0, { "static": _3 }], "simplesite": _3, "oaiusercontent": _6, "orsites": _3, "operaunite": _3, "customer-oci": [0, { "*": _3, "oci": _6, "ocp": _6, "ocs": _6 }], "oraclecloudapps": _6, "oraclegovcloudapps": _6, "authgear-staging": _3, "authgearapps": _3, "skygearapp": _3, "outsystemscloud": _3, "ownprovider": _3, "pgfog": _3, "pagexl": _3, "gotpantheon": _3, "paywhirl": _6, "upsunapp": _3, "postman-echo": _3, "prgmr": [0, { "xen": _3 }], "project-study": [0, { "dev": _3 }], "pythonanywhere": _44, "qa2": _3, "alpha-myqnapcloud": _3, "dev-myqnapcloud": _3, "mycloudnas": _3, "mynascloud": _3, "myqnapcloud": _3, "qualifioapp": _3, "ladesk": _3, "qualyhqpartner": _6, "qualyhqportal": _6, "qbuser": _3, "quipelements": _6, "rackmaze": _3, "readthedocs-hosted": _3, "rhcloud": _3, "onrender": _3, "render": _45, "subsc-pay": _3, "180r": _3, "dojin": _3, "sakuratan": _3, "sakuraweb": _3, "x0": _3, "code": [0, { "builder": _6, "dev-builder": _6, "stg-builder": _6 }], "salesforce": [0, { "platform": [0, { "code-builder-stg": [0, { "test": [0, { "001": _6 }] }] }] }], "logoip": _3, "scrysec": _3, "firewall-gateway": _3, "myshopblocks": _3, "myshopify": _3, "shopitsite": _3, "1kapp": _3, "appchizi": _3, "applinzi": _3, "sinaapp": _3, "vipsinaapp": _3, "streamlitapp": _3, "try-snowplow": _3, "playstation-cloud": _3, "myspreadshop": _3, "w-corp-staticblitz": _3, "w-credentialless-staticblitz": _3, "w-staticblitz": _3, "stackhero-network": _3, "stdlib": [0, { "api": _3 }], "strapiapp": [2, { "media": _3 }], "streak-link": _3, "streaklinks": _3, "streakusercontent": _3, "temp-dns": _3, "dsmynas": _3, "familyds": _3, "mytabit": _3, "taveusercontent": _3, "tb-hosting": _46, "reservd": _3, "thingdustdata": _3, "townnews-staging": _3, "typeform": [0, { "pro": _3 }], "hk": _3, "it": _3, "deus-canvas": _3, "vultrobjects": _6, "wafflecell": _3, "hotelwithflight": _3, "reserve-online": _3, "cprapid": _3, "pleskns": _3, "remotewd": _3, "wiardweb": [0, { "pages": _3 }], "wixsite": _3, "wixstudio": _3, "messwithdns": _3, "woltlab-demo": _3, "wpenginepowered": [2, { "js": _3 }], "xnbay": [2, { "u2": _3, "u2-local": _3 }], "yolasite": _3 }], "coop": _2, "cr": [1, { "ac": _2, "co": _2, "ed": _2, "fi": _2, "go": _2, "or": _2, "sa": _2 }], "cu": [1, { "com": _2, "edu": _2, "gob": _2, "inf": _2, "nat": _2, "net": _2, "org": _2 }], "cv": [1, { "com": _2, "edu": _2, "id": _2, "int": _2, "net": _2, "nome": _2, "org": _2, "publ": _2 }], "cw": _47, "cx": [1, { "gov": _2, "cloudns": _3, "ath": _3, "info": _3, "assessments": _3, "calculators": _3, "funnels": _3, "paynow": _3, "quizzes": _3, "researched": _3, "tests": _3 }], "cy": [1, { "ac": _2, "biz": _2, "com": [1, { "scaleforce": _48 }], "ekloges": _2, "gov": _2, "ltd": _2, "mil": _2, "net": _2, "org": _2, "press": _2, "pro": _2, "tm": _2 }], "cz": [1, { "gov": _2, "contentproxy9": [0, { "rsc": _3 }], "realm": _3, "e4": _3, "co": _3, "metacentrum": [0, { "cloud": _6, "custom": _3 }], "muni": [0, { "cloud": [0, { "flt": _3, "usr": _3 }] }] }], "de": [1, { "bplaced": _3, "square7": _3, "com": _3, "cosidns": _49, "dnsupdater": _3, "dynamisches-dns": _3, "internet-dns": _3, "l-o-g-i-n": _3, "ddnss": [2, { "dyn": _3, "dyndns": _3 }], "dyn-ip24": _3, "dyndns1": _3, "home-webserver": [2, { "dyn": _3 }], "myhome-server": _3, "dnshome": _3, "fuettertdasnetz": _3, "isteingeek": _3, "istmein": _3, "lebtimnetz": _3, "leitungsen": _3, "traeumtgerade": _3, "frusky": _6, "goip": _3, "xn--gnstigbestellen-zvb": _3, "günstigbestellen": _3, "xn--gnstigliefern-wob": _3, "günstigliefern": _3, "hs-heilbronn": [0, { "it": [0, { "pages": _3, "pages-research": _3 }] }], "dyn-berlin": _3, "in-berlin": _3, "in-brb": _3, "in-butter": _3, "in-dsl": _3, "in-vpn": _3, "iservschule": _3, "mein-iserv": _3, "schuldock": _3, "schulplattform": _3, "schulserver": _3, "test-iserv": _3, "keymachine": _3, "co": _3, "git-repos": _3, "lcube-server": _3, "svn-repos": _3, "barsy": _3, "webspaceconfig": _3, "123webseite": _3, "rub": _3, "ruhr-uni-bochum": [2, { "noc": [0, { "io": _3 }] }], "logoip": _3, "firewall-gateway": _3, "my-gateway": _3, "my-router": _3, "spdns": _3, "my": _3, "speedpartner": [0, { "customer": _3 }], "myspreadshop": _3, "taifun-dns": _3, "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3, "dd-dns": _3, "dray-dns": _3, "draydns": _3, "dyn-vpn": _3, "dynvpn": _3, "mein-vigor": _3, "my-vigor": _3, "my-wan": _3, "syno-ds": _3, "synology-diskstation": _3, "synology-ds": _3, "virtual-user": _3, "virtualuser": _3, "community-pro": _3, "diskussionsbereich": _3, "xenonconnect": _6 }], "dj": _2, "dk": [1, { "biz": _3, "co": _3, "firm": _3, "reg": _3, "store": _3, "123hjemmeside": _3, "myspreadshop": _3 }], "dm": _51, "do": [1, { "art": _2, "com": _2, "edu": _2, "gob": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "sld": _2, "web": _2 }], "dz": [1, { "art": _2, "asso": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "pol": _2, "soc": _2, "tm": _2 }], "ec": [1, { "abg": _2, "adm": _2, "agron": _2, "arqt": _2, "art": _2, "bar": _2, "chef": _2, "com": _2, "cont": _2, "cpa": _2, "cue": _2, "dent": _2, "dgn": _2, "disco": _2, "doc": _2, "edu": _2, "eng": _2, "esm": _2, "fin": _2, "fot": _2, "gal": _2, "gob": _2, "gov": _2, "gye": _2, "ibr": _2, "info": _2, "k12": _2, "lat": _2, "loj": _2, "med": _2, "mil": _2, "mktg": _2, "mon": _2, "net": _2, "ntr": _2, "odont": _2, "org": _2, "pro": _2, "prof": _2, "psic": _2, "psiq": _2, "pub": _2, "rio": _2, "rrpp": _2, "sal": _2, "tech": _2, "tul": _2, "tur": _2, "uio": _2, "vet": _2, "xxx": _2, "base": _3, "official": _3 }], "edu": [1, { "rit": [0, { "git-pages": _3 }] }], "ee": [1, { "aip": _2, "com": _2, "edu": _2, "fie": _2, "gov": _2, "lib": _2, "med": _2, "org": _2, "pri": _2, "riik": _2 }], "eg": [1, { "ac": _2, "com": _2, "edu": _2, "eun": _2, "gov": _2, "info": _2, "me": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "sci": _2, "sport": _2, "tv": _2 }], "er": _20, "es": [1, { "com": _2, "edu": _2, "gob": _2, "nom": _2, "org": _2, "123miweb": _3, "myspreadshop": _3 }], "et": [1, { "biz": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "name": _2, "net": _2, "org": _2 }], "eu": [1, { "cloudns": _3, "prvw": _3, "dogado": [0, { "jelastic": _3 }], "barsy": _3, "spdns": _3, "nxa": _6, "directwp": _3, "transurl": _6, "diskstation": _3 }], "fi": [1, { "aland": _2, "dy": _3, "xn--hkkinen-5wa": _3, "häkkinen": _3, "iki": _3, "cloudplatform": [0, { "fi": _3 }], "datacenter": [0, { "demo": _3, "paas": _3 }], "kapsi": _3, "123kotisivu": _3, "myspreadshop": _3 }], "fj": [1, { "ac": _2, "biz": _2, "com": _2, "edu": _2, "gov": _2, "id": _2, "info": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "pro": _2 }], "fk": _20, "fm": [1, { "com": _2, "edu": _2, "net": _2, "org": _2, "radio": _3, "user": _6 }], "fo": _2, "fr": [1, { "asso": _2, "com": _2, "gouv": _2, "nom": _2, "prd": _2, "tm": _2, "avoues": _2, "cci": _2, "greta": _2, "huissier-justice": _2, "en-root": _3, "fbx-os": _3, "fbxos": _3, "freebox-os": _3, "freeboxos": _3, "goupile": _3, "123siteweb": _3, "on-web": _3, "chirurgiens-dentistes-en-france": _3, "dedibox": _3, "aeroport": _3, "avocat": _3, "chambagri": _3, "chirurgiens-dentistes": _3, "experts-comptables": _3, "medecin": _3, "notaires": _3, "pharmacien": _3, "port": _3, "veterinaire": _3, "myspreadshop": _3, "ynh": _3 }], "ga": _2, "gb": _2, "gd": [1, { "edu": _2, "gov": _2 }], "ge": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "pvt": _2, "school": _2 }], "gf": _2, "gg": [1, { "co": _2, "net": _2, "org": _2, "ply": [0, { "at": _6, "d6": _3 }], "botdash": _3, "kaas": _3, "stackit": _3, "panel": [2, { "daemon": _3 }] }], "gh": [1, { "biz": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 }], "gi": [1, { "com": _2, "edu": _2, "gov": _2, "ltd": _2, "mod": _2, "org": _2 }], "gl": [1, { "co": _2, "com": _2, "edu": _2, "net": _2, "org": _2 }], "gm": _2, "gn": [1, { "ac": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2 }], "gov": _2, "gp": [1, { "asso": _2, "com": _2, "edu": _2, "mobi": _2, "net": _2, "org": _2 }], "gq": _2, "gr": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "barsy": _3, "simplesite": _3 }], "gs": _2, "gt": [1, { "com": _2, "edu": _2, "gob": _2, "ind": _2, "mil": _2, "net": _2, "org": _2 }], "gu": [1, { "com": _2, "edu": _2, "gov": _2, "guam": _2, "info": _2, "net": _2, "org": _2, "web": _2 }], "gw": [1, { "nx": _3 }], "gy": _51, "hk": [1, { "com": _2, "edu": _2, "gov": _2, "idv": _2, "net": _2, "org": _2, "xn--ciqpn": _2, "个人": _2, "xn--gmqw5a": _2, "個人": _2, "xn--55qx5d": _2, "公司": _2, "xn--mxtq1m": _2, "政府": _2, "xn--lcvr32d": _2, "敎育": _2, "xn--wcvs22d": _2, "教育": _2, "xn--gmq050i": _2, "箇人": _2, "xn--uc0atv": _2, "組織": _2, "xn--uc0ay4a": _2, "組织": _2, "xn--od0alg": _2, "網絡": _2, "xn--zf0avx": _2, "網络": _2, "xn--mk0axi": _2, "组織": _2, "xn--tn0ag": _2, "组织": _2, "xn--od0aq3b": _2, "网絡": _2, "xn--io0a7i": _2, "网络": _2, "inc": _3, "ltd": _3 }], "hm": _2, "hn": [1, { "com": _2, "edu": _2, "gob": _2, "mil": _2, "net": _2, "org": _2 }], "hr": [1, { "com": _2, "from": _2, "iz": _2, "name": _2, "brendly": _19 }], "ht": [1, { "adult": _2, "art": _2, "asso": _2, "com": _2, "coop": _2, "edu": _2, "firm": _2, "gouv": _2, "info": _2, "med": _2, "net": _2, "org": _2, "perso": _2, "pol": _2, "pro": _2, "rel": _2, "shop": _2, "rt": _3 }], "hu": [1, { "2000": _2, "agrar": _2, "bolt": _2, "casino": _2, "city": _2, "co": _2, "erotica": _2, "erotika": _2, "film": _2, "forum": _2, "games": _2, "hotel": _2, "info": _2, "ingatlan": _2, "jogasz": _2, "konyvelo": _2, "lakas": _2, "media": _2, "news": _2, "org": _2, "priv": _2, "reklam": _2, "sex": _2, "shop": _2, "sport": _2, "suli": _2, "szex": _2, "tm": _2, "tozsde": _2, "utazas": _2, "video": _2 }], "id": [1, { "ac": _2, "biz": _2, "co": _2, "desa": _2, "go": _2, "kop": _2, "mil": _2, "my": _2, "net": _2, "or": _2, "ponpes": _2, "sch": _2, "web": _2, "e": _3, "zone": _3 }], "ie": [1, { "gov": _2, "myspreadshop": _3 }], "il": [1, { "ac": _2, "co": [1, { "ravpage": _3, "mytabit": _3, "tabitorder": _3 }], "gov": _2, "idf": _2, "k12": _2, "muni": _2, "net": _2, "org": _2 }], "xn--4dbrk0ce": [1, { "xn--4dbgdty6c": _2, "xn--5dbhl8d": _2, "xn--8dbq2a": _2, "xn--hebda8b": _2 }], "ישראל": [1, { "אקדמיה": _2, "ישוב": _2, "צהל": _2, "ממשל": _2 }], "im": [1, { "ac": _2, "co": [1, { "ltd": _2, "plc": _2 }], "com": _2, "net": _2, "org": _2, "tt": _2, "tv": _2 }], "in": [1, { "5g": _2, "6g": _2, "ac": _2, "ai": _2, "am": _2, "bank": _2, "bihar": _2, "biz": _2, "business": _2, "ca": _2, "cn": _2, "co": _2, "com": _2, "coop": _2, "cs": _2, "delhi": _2, "dr": _2, "edu": _2, "er": _2, "fin": _2, "firm": _2, "gen": _2, "gov": _2, "gujarat": _2, "ind": _2, "info": _2, "int": _2, "internet": _2, "io": _2, "me": _2, "mil": _2, "net": _2, "nic": _2, "org": _2, "pg": _2, "post": _2, "pro": _2, "res": _2, "travel": _2, "tv": _2, "uk": _2, "up": _2, "us": _2, "cloudns": _3, "barsy": _3, "web": _3, "supabase": _3 }], "info": [1, { "cloudns": _3, "dynamic-dns": _3, "barrel-of-knowledge": _3, "barrell-of-knowledge": _3, "dyndns": _3, "for-our": _3, "groks-the": _3, "groks-this": _3, "here-for-more": _3, "knowsitall": _3, "selfip": _3, "webhop": _3, "barsy": _3, "mayfirst": _3, "mittwald": _3, "mittwaldserver": _3, "typo3server": _3, "dvrcam": _3, "ilovecollege": _3, "no-ip": _3, "forumz": _3, "nsupdate": _3, "dnsupdate": _3, "v-info": _3 }], "int": [1, { "eu": _2 }], "io": [1, { "2038": _3, "co": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "on-acorn": _6, "myaddr": _3, "apigee": _3, "b-data": _3, "beagleboard": _3, "bitbucket": _3, "bluebite": _3, "boxfuse": _3, "brave": _7, "browsersafetymark": _3, "bubble": _54, "bubbleapps": _3, "bigv": [0, { "uk0": _3 }], "cleverapps": _3, "cloudbeesusercontent": _3, "dappnode": [0, { "dyndns": _3 }], "darklang": _3, "definima": _3, "dedyn": _3, "icp0": _55, "icp1": _55, "qzz": _3, "fh-muenster": _3, "shw": _3, "forgerock": [0, { "id": _3 }], "gitbook": _3, "github": _3, "gitlab": _3, "lolipop": _3, "hasura-app": _3, "hostyhosting": _3, "hypernode": _3, "moonscale": _6, "beebyte": _43, "beebyteapp": [0, { "sekd1": _3 }], "jele": _3, "webthings": _3, "loginline": _3, "barsy": _3, "azurecontainer": _6, "ngrok": [2, { "ap": _3, "au": _3, "eu": _3, "in": _3, "jp": _3, "sa": _3, "us": _3 }], "nodeart": [0, { "stage": _3 }], "pantheonsite": _3, "pstmn": [2, { "mock": _3 }], "protonet": _3, "qcx": [2, { "sys": _6 }], "qoto": _3, "vaporcloud": _3, "myrdbx": _3, "rb-hosting": _46, "on-k3s": _6, "on-rio": _6, "readthedocs": _3, "resindevice": _3, "resinstaging": [0, { "devices": _3 }], "hzc": _3, "sandcats": _3, "scrypted": [0, { "client": _3 }], "mo-siemens": _3, "lair": _42, "stolos": _6, "musician": _3, "utwente": _3, "edugit": _3, "telebit": _3, "thingdust": [0, { "dev": _56, "disrec": _56, "prod": _57, "testing": _56 }], "tickets": _3, "webflow": _3, "webflowtest": _3, "editorx": _3, "wixstudio": _3, "basicserver": _3, "virtualserver": _3 }], "iq": _5, "ir": [1, { "ac": _2, "co": _2, "gov": _2, "id": _2, "net": _2, "org": _2, "sch": _2, "xn--mgba3a4f16a": _2, "ایران": _2, "xn--mgba3a4fra": _2, "ايران": _2, "arvanedge": _3, "vistablog": _3 }], "is": _2, "it": [1, { "edu": _2, "gov": _2, "abr": _2, "abruzzo": _2, "aosta-valley": _2, "aostavalley": _2, "bas": _2, "basilicata": _2, "cal": _2, "calabria": _2, "cam": _2, "campania": _2, "emilia-romagna": _2, "emiliaromagna": _2, "emr": _2, "friuli-v-giulia": _2, "friuli-ve-giulia": _2, "friuli-vegiulia": _2, "friuli-venezia-giulia": _2, "friuli-veneziagiulia": _2, "friuli-vgiulia": _2, "friuliv-giulia": _2, "friulive-giulia": _2, "friulivegiulia": _2, "friulivenezia-giulia": _2, "friuliveneziagiulia": _2, "friulivgiulia": _2, "fvg": _2, "laz": _2, "lazio": _2, "lig": _2, "liguria": _2, "lom": _2, "lombardia": _2, "lombardy": _2, "lucania": _2, "mar": _2, "marche": _2, "mol": _2, "molise": _2, "piedmont": _2, "piemonte": _2, "pmn": _2, "pug": _2, "puglia": _2, "sar": _2, "sardegna": _2, "sardinia": _2, "sic": _2, "sicilia": _2, "sicily": _2, "taa": _2, "tos": _2, "toscana": _2, "trentin-sud-tirol": _2, "xn--trentin-sd-tirol-rzb": _2, "trentin-süd-tirol": _2, "trentin-sudtirol": _2, "xn--trentin-sdtirol-7vb": _2, "trentin-südtirol": _2, "trentin-sued-tirol": _2, "trentin-suedtirol": _2, "trentino": _2, "trentino-a-adige": _2, "trentino-aadige": _2, "trentino-alto-adige": _2, "trentino-altoadige": _2, "trentino-s-tirol": _2, "trentino-stirol": _2, "trentino-sud-tirol": _2, "xn--trentino-sd-tirol-c3b": _2, "trentino-süd-tirol": _2, "trentino-sudtirol": _2, "xn--trentino-sdtirol-szb": _2, "trentino-südtirol": _2, "trentino-sued-tirol": _2, "trentino-suedtirol": _2, "trentinoa-adige": _2, "trentinoaadige": _2, "trentinoalto-adige": _2, "trentinoaltoadige": _2, "trentinos-tirol": _2, "trentinostirol": _2, "trentinosud-tirol": _2, "xn--trentinosd-tirol-rzb": _2, "trentinosüd-tirol": _2, "trentinosudtirol": _2, "xn--trentinosdtirol-7vb": _2, "trentinosüdtirol": _2, "trentinosued-tirol": _2, "trentinosuedtirol": _2, "trentinsud-tirol": _2, "xn--trentinsd-tirol-6vb": _2, "trentinsüd-tirol": _2, "trentinsudtirol": _2, "xn--trentinsdtirol-nsb": _2, "trentinsüdtirol": _2, "trentinsued-tirol": _2, "trentinsuedtirol": _2, "tuscany": _2, "umb": _2, "umbria": _2, "val-d-aosta": _2, "val-daosta": _2, "vald-aosta": _2, "valdaosta": _2, "valle-aosta": _2, "valle-d-aosta": _2, "valle-daosta": _2, "valleaosta": _2, "valled-aosta": _2, "valledaosta": _2, "vallee-aoste": _2, "xn--valle-aoste-ebb": _2, "vallée-aoste": _2, "vallee-d-aoste": _2, "xn--valle-d-aoste-ehb": _2, "vallée-d-aoste": _2, "valleeaoste": _2, "xn--valleaoste-e7a": _2, "valléeaoste": _2, "valleedaoste": _2, "xn--valledaoste-ebb": _2, "valléedaoste": _2, "vao": _2, "vda": _2, "ven": _2, "veneto": _2, "ag": _2, "agrigento": _2, "al": _2, "alessandria": _2, "alto-adige": _2, "altoadige": _2, "an": _2, "ancona": _2, "andria-barletta-trani": _2, "andria-trani-barletta": _2, "andriabarlettatrani": _2, "andriatranibarletta": _2, "ao": _2, "aosta": _2, "aoste": _2, "ap": _2, "aq": _2, "aquila": _2, "ar": _2, "arezzo": _2, "ascoli-piceno": _2, "ascolipiceno": _2, "asti": _2, "at": _2, "av": _2, "avellino": _2, "ba": _2, "balsan": _2, "balsan-sudtirol": _2, "xn--balsan-sdtirol-nsb": _2, "balsan-südtirol": _2, "balsan-suedtirol": _2, "bari": _2, "barletta-trani-andria": _2, "barlettatraniandria": _2, "belluno": _2, "benevento": _2, "bergamo": _2, "bg": _2, "bi": _2, "biella": _2, "bl": _2, "bn": _2, "bo": _2, "bologna": _2, "bolzano": _2, "bolzano-altoadige": _2, "bozen": _2, "bozen-sudtirol": _2, "xn--bozen-sdtirol-2ob": _2, "bozen-südtirol": _2, "bozen-suedtirol": _2, "br": _2, "brescia": _2, "brindisi": _2, "bs": _2, "bt": _2, "bulsan": _2, "bulsan-sudtirol": _2, "xn--bulsan-sdtirol-nsb": _2, "bulsan-südtirol": _2, "bulsan-suedtirol": _2, "bz": _2, "ca": _2, "cagliari": _2, "caltanissetta": _2, "campidano-medio": _2, "campidanomedio": _2, "campobasso": _2, "carbonia-iglesias": _2, "carboniaiglesias": _2, "carrara-massa": _2, "carraramassa": _2, "caserta": _2, "catania": _2, "catanzaro": _2, "cb": _2, "ce": _2, "cesena-forli": _2, "xn--cesena-forl-mcb": _2, "cesena-forlì": _2, "cesenaforli": _2, "xn--cesenaforl-i8a": _2, "cesenaforlì": _2, "ch": _2, "chieti": _2, "ci": _2, "cl": _2, "cn": _2, "co": _2, "como": _2, "cosenza": _2, "cr": _2, "cremona": _2, "crotone": _2, "cs": _2, "ct": _2, "cuneo": _2, "cz": _2, "dell-ogliastra": _2, "dellogliastra": _2, "en": _2, "enna": _2, "fc": _2, "fe": _2, "fermo": _2, "ferrara": _2, "fg": _2, "fi": _2, "firenze": _2, "florence": _2, "fm": _2, "foggia": _2, "forli-cesena": _2, "xn--forl-cesena-fcb": _2, "forlì-cesena": _2, "forlicesena": _2, "xn--forlcesena-c8a": _2, "forlìcesena": _2, "fr": _2, "frosinone": _2, "ge": _2, "genoa": _2, "genova": _2, "go": _2, "gorizia": _2, "gr": _2, "grosseto": _2, "iglesias-carbonia": _2, "iglesiascarbonia": _2, "im": _2, "imperia": _2, "is": _2, "isernia": _2, "kr": _2, "la-spezia": _2, "laquila": _2, "laspezia": _2, "latina": _2, "lc": _2, "le": _2, "lecce": _2, "lecco": _2, "li": _2, "livorno": _2, "lo": _2, "lodi": _2, "lt": _2, "lu": _2, "lucca": _2, "macerata": _2, "mantova": _2, "massa-carrara": _2, "massacarrara": _2, "matera": _2, "mb": _2, "mc": _2, "me": _2, "medio-campidano": _2, "mediocampidano": _2, "messina": _2, "mi": _2, "milan": _2, "milano": _2, "mn": _2, "mo": _2, "modena": _2, "monza": _2, "monza-brianza": _2, "monza-e-della-brianza": _2, "monzabrianza": _2, "monzaebrianza": _2, "monzaedellabrianza": _2, "ms": _2, "mt": _2, "na": _2, "naples": _2, "napoli": _2, "no": _2, "novara": _2, "nu": _2, "nuoro": _2, "og": _2, "ogliastra": _2, "olbia-tempio": _2, "olbiatempio": _2, "or": _2, "oristano": _2, "ot": _2, "pa": _2, "padova": _2, "padua": _2, "palermo": _2, "parma": _2, "pavia": _2, "pc": _2, "pd": _2, "pe": _2, "perugia": _2, "pesaro-urbino": _2, "pesarourbino": _2, "pescara": _2, "pg": _2, "pi": _2, "piacenza": _2, "pisa": _2, "pistoia": _2, "pn": _2, "po": _2, "pordenone": _2, "potenza": _2, "pr": _2, "prato": _2, "pt": _2, "pu": _2, "pv": _2, "pz": _2, "ra": _2, "ragusa": _2, "ravenna": _2, "rc": _2, "re": _2, "reggio-calabria": _2, "reggio-emilia": _2, "reggiocalabria": _2, "reggioemilia": _2, "rg": _2, "ri": _2, "rieti": _2, "rimini": _2, "rm": _2, "rn": _2, "ro": _2, "roma": _2, "rome": _2, "rovigo": _2, "sa": _2, "salerno": _2, "sassari": _2, "savona": _2, "si": _2, "siena": _2, "siracusa": _2, "so": _2, "sondrio": _2, "sp": _2, "sr": _2, "ss": _2, "xn--sdtirol-n2a": _2, "südtirol": _2, "suedtirol": _2, "sv": _2, "ta": _2, "taranto": _2, "te": _2, "tempio-olbia": _2, "tempioolbia": _2, "teramo": _2, "terni": _2, "tn": _2, "to": _2, "torino": _2, "tp": _2, "tr": _2, "trani-andria-barletta": _2, "trani-barletta-andria": _2, "traniandriabarletta": _2, "tranibarlettaandria": _2, "trapani": _2, "trento": _2, "treviso": _2, "trieste": _2, "ts": _2, "turin": _2, "tv": _2, "ud": _2, "udine": _2, "urbino-pesaro": _2, "urbinopesaro": _2, "va": _2, "varese": _2, "vb": _2, "vc": _2, "ve": _2, "venezia": _2, "venice": _2, "verbania": _2, "vercelli": _2, "verona": _2, "vi": _2, "vibo-valentia": _2, "vibovalentia": _2, "vicenza": _2, "viterbo": _2, "vr": _2, "vs": _2, "vt": _2, "vv": _2, "12chars": _3, "ibxos": _3, "iliadboxos": _3, "neen": [0, { "jc": _3 }], "123homepage": _3, "16-b": _3, "32-b": _3, "64-b": _3, "myspreadshop": _3, "syncloud": _3 }], "je": [1, { "co": _2, "net": _2, "org": _2, "of": _3 }], "jm": _20, "jo": [1, { "agri": _2, "ai": _2, "com": _2, "edu": _2, "eng": _2, "fm": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "per": _2, "phd": _2, "sch": _2, "tv": _2 }], "jobs": _2, "jp": [1, { "ac": _2, "ad": _2, "co": _2, "ed": _2, "go": _2, "gr": _2, "lg": _2, "ne": [1, { "aseinet": _53, "gehirn": _3, "ivory": _3, "mail-box": _3, "mints": _3, "mokuren": _3, "opal": _3, "sakura": _3, "sumomo": _3, "topaz": _3 }], "or": _2, "aichi": [1, { "aisai": _2, "ama": _2, "anjo": _2, "asuke": _2, "chiryu": _2, "chita": _2, "fuso": _2, "gamagori": _2, "handa": _2, "hazu": _2, "hekinan": _2, "higashiura": _2, "ichinomiya": _2, "inazawa": _2, "inuyama": _2, "isshiki": _2, "iwakura": _2, "kanie": _2, "kariya": _2, "kasugai": _2, "kira": _2, "kiyosu": _2, "komaki": _2, "konan": _2, "kota": _2, "mihama": _2, "miyoshi": _2, "nishio": _2, "nisshin": _2, "obu": _2, "oguchi": _2, "oharu": _2, "okazaki": _2, "owariasahi": _2, "seto": _2, "shikatsu": _2, "shinshiro": _2, "shitara": _2, "tahara": _2, "takahama": _2, "tobishima": _2, "toei": _2, "togo": _2, "tokai": _2, "tokoname": _2, "toyoake": _2, "toyohashi": _2, "toyokawa": _2, "toyone": _2, "toyota": _2, "tsushima": _2, "yatomi": _2 }], "akita": [1, { "akita": _2, "daisen": _2, "fujisato": _2, "gojome": _2, "hachirogata": _2, "happou": _2, "higashinaruse": _2, "honjo": _2, "honjyo": _2, "ikawa": _2, "kamikoani": _2, "kamioka": _2, "katagami": _2, "kazuno": _2, "kitaakita": _2, "kosaka": _2, "kyowa": _2, "misato": _2, "mitane": _2, "moriyoshi": _2, "nikaho": _2, "noshiro": _2, "odate": _2, "oga": _2, "ogata": _2, "semboku": _2, "yokote": _2, "yurihonjo": _2 }], "aomori": [1, { "aomori": _2, "gonohe": _2, "hachinohe": _2, "hashikami": _2, "hiranai": _2, "hirosaki": _2, "itayanagi": _2, "kuroishi": _2, "misawa": _2, "mutsu": _2, "nakadomari": _2, "noheji": _2, "oirase": _2, "owani": _2, "rokunohe": _2, "sannohe": _2, "shichinohe": _2, "shingo": _2, "takko": _2, "towada": _2, "tsugaru": _2, "tsuruta": _2 }], "chiba": [1, { "abiko": _2, "asahi": _2, "chonan": _2, "chosei": _2, "choshi": _2, "chuo": _2, "funabashi": _2, "futtsu": _2, "hanamigawa": _2, "ichihara": _2, "ichikawa": _2, "ichinomiya": _2, "inzai": _2, "isumi": _2, "kamagaya": _2, "kamogawa": _2, "kashiwa": _2, "katori": _2, "katsuura": _2, "kimitsu": _2, "kisarazu": _2, "kozaki": _2, "kujukuri": _2, "kyonan": _2, "matsudo": _2, "midori": _2, "mihama": _2, "minamiboso": _2, "mobara": _2, "mutsuzawa": _2, "nagara": _2, "nagareyama": _2, "narashino": _2, "narita": _2, "noda": _2, "oamishirasato": _2, "omigawa": _2, "onjuku": _2, "otaki": _2, "sakae": _2, "sakura": _2, "shimofusa": _2, "shirako": _2, "shiroi": _2, "shisui": _2, "sodegaura": _2, "sosa": _2, "tako": _2, "tateyama": _2, "togane": _2, "tohnosho": _2, "tomisato": _2, "urayasu": _2, "yachimata": _2, "yachiyo": _2, "yokaichiba": _2, "yokoshibahikari": _2, "yotsukaido": _2 }], "ehime": [1, { "ainan": _2, "honai": _2, "ikata": _2, "imabari": _2, "iyo": _2, "kamijima": _2, "kihoku": _2, "kumakogen": _2, "masaki": _2, "matsuno": _2, "matsuyama": _2, "namikata": _2, "niihama": _2, "ozu": _2, "saijo": _2, "seiyo": _2, "shikokuchuo": _2, "tobe": _2, "toon": _2, "uchiko": _2, "uwajima": _2, "yawatahama": _2 }], "fukui": [1, { "echizen": _2, "eiheiji": _2, "fukui": _2, "ikeda": _2, "katsuyama": _2, "mihama": _2, "minamiechizen": _2, "obama": _2, "ohi": _2, "ono": _2, "sabae": _2, "sakai": _2, "takahama": _2, "tsuruga": _2, "wakasa": _2 }], "fukuoka": [1, { "ashiya": _2, "buzen": _2, "chikugo": _2, "chikuho": _2, "chikujo": _2, "chikushino": _2, "chikuzen": _2, "chuo": _2, "dazaifu": _2, "fukuchi": _2, "hakata": _2, "higashi": _2, "hirokawa": _2, "hisayama": _2, "iizuka": _2, "inatsuki": _2, "kaho": _2, "kasuga": _2, "kasuya": _2, "kawara": _2, "keisen": _2, "koga": _2, "kurate": _2, "kurogi": _2, "kurume": _2, "minami": _2, "miyako": _2, "miyama": _2, "miyawaka": _2, "mizumaki": _2, "munakata": _2, "nakagawa": _2, "nakama": _2, "nishi": _2, "nogata": _2, "ogori": _2, "okagaki": _2, "okawa": _2, "oki": _2, "omuta": _2, "onga": _2, "onojo": _2, "oto": _2, "saigawa": _2, "sasaguri": _2, "shingu": _2, "shinyoshitomi": _2, "shonai": _2, "soeda": _2, "sue": _2, "tachiarai": _2, "tagawa": _2, "takata": _2, "toho": _2, "toyotsu": _2, "tsuiki": _2, "ukiha": _2, "umi": _2, "usui": _2, "yamada": _2, "yame": _2, "yanagawa": _2, "yukuhashi": _2 }], "fukushima": [1, { "aizubange": _2, "aizumisato": _2, "aizuwakamatsu": _2, "asakawa": _2, "bandai": _2, "date": _2, "fukushima": _2, "furudono": _2, "futaba": _2, "hanawa": _2, "higashi": _2, "hirata": _2, "hirono": _2, "iitate": _2, "inawashiro": _2, "ishikawa": _2, "iwaki": _2, "izumizaki": _2, "kagamiishi": _2, "kaneyama": _2, "kawamata": _2, "kitakata": _2, "kitashiobara": _2, "koori": _2, "koriyama": _2, "kunimi": _2, "miharu": _2, "mishima": _2, "namie": _2, "nango": _2, "nishiaizu": _2, "nishigo": _2, "okuma": _2, "omotego": _2, "ono": _2, "otama": _2, "samegawa": _2, "shimogo": _2, "shirakawa": _2, "showa": _2, "soma": _2, "sukagawa": _2, "taishin": _2, "tamakawa": _2, "tanagura": _2, "tenei": _2, "yabuki": _2, "yamato": _2, "yamatsuri": _2, "yanaizu": _2, "yugawa": _2 }], "gifu": [1, { "anpachi": _2, "ena": _2, "gifu": _2, "ginan": _2, "godo": _2, "gujo": _2, "hashima": _2, "hichiso": _2, "hida": _2, "higashishirakawa": _2, "ibigawa": _2, "ikeda": _2, "kakamigahara": _2, "kani": _2, "kasahara": _2, "kasamatsu": _2, "kawaue": _2, "kitagata": _2, "mino": _2, "minokamo": _2, "mitake": _2, "mizunami": _2, "motosu": _2, "nakatsugawa": _2, "ogaki": _2, "sakahogi": _2, "seki": _2, "sekigahara": _2, "shirakawa": _2, "tajimi": _2, "takayama": _2, "tarui": _2, "toki": _2, "tomika": _2, "wanouchi": _2, "yamagata": _2, "yaotsu": _2, "yoro": _2 }], "gunma": [1, { "annaka": _2, "chiyoda": _2, "fujioka": _2, "higashiagatsuma": _2, "isesaki": _2, "itakura": _2, "kanna": _2, "kanra": _2, "katashina": _2, "kawaba": _2, "kiryu": _2, "kusatsu": _2, "maebashi": _2, "meiwa": _2, "midori": _2, "minakami": _2, "naganohara": _2, "nakanojo": _2, "nanmoku": _2, "numata": _2, "oizumi": _2, "ora": _2, "ota": _2, "shibukawa": _2, "shimonita": _2, "shinto": _2, "showa": _2, "takasaki": _2, "takayama": _2, "tamamura": _2, "tatebayashi": _2, "tomioka": _2, "tsukiyono": _2, "tsumagoi": _2, "ueno": _2, "yoshioka": _2 }], "hiroshima": [1, { "asaminami": _2, "daiwa": _2, "etajima": _2, "fuchu": _2, "fukuyama": _2, "hatsukaichi": _2, "higashihiroshima": _2, "hongo": _2, "jinsekikogen": _2, "kaita": _2, "kui": _2, "kumano": _2, "kure": _2, "mihara": _2, "miyoshi": _2, "naka": _2, "onomichi": _2, "osakikamijima": _2, "otake": _2, "saka": _2, "sera": _2, "seranishi": _2, "shinichi": _2, "shobara": _2, "takehara": _2 }], "hokkaido": [1, { "abashiri": _2, "abira": _2, "aibetsu": _2, "akabira": _2, "akkeshi": _2, "asahikawa": _2, "ashibetsu": _2, "ashoro": _2, "assabu": _2, "atsuma": _2, "bibai": _2, "biei": _2, "bifuka": _2, "bihoro": _2, "biratori": _2, "chippubetsu": _2, "chitose": _2, "date": _2, "ebetsu": _2, "embetsu": _2, "eniwa": _2, "erimo": _2, "esan": _2, "esashi": _2, "fukagawa": _2, "fukushima": _2, "furano": _2, "furubira": _2, "haboro": _2, "hakodate": _2, "hamatonbetsu": _2, "hidaka": _2, "higashikagura": _2, "higashikawa": _2, "hiroo": _2, "hokuryu": _2, "hokuto": _2, "honbetsu": _2, "horokanai": _2, "horonobe": _2, "ikeda": _2, "imakane": _2, "ishikari": _2, "iwamizawa": _2, "iwanai": _2, "kamifurano": _2, "kamikawa": _2, "kamishihoro": _2, "kamisunagawa": _2, "kamoenai": _2, "kayabe": _2, "kembuchi": _2, "kikonai": _2, "kimobetsu": _2, "kitahiroshima": _2, "kitami": _2, "kiyosato": _2, "koshimizu": _2, "kunneppu": _2, "kuriyama": _2, "kuromatsunai": _2, "kushiro": _2, "kutchan": _2, "kyowa": _2, "mashike": _2, "matsumae": _2, "mikasa": _2, "minamifurano": _2, "mombetsu": _2, "moseushi": _2, "mukawa": _2, "muroran": _2, "naie": _2, "nakagawa": _2, "nakasatsunai": _2, "nakatombetsu": _2, "nanae": _2, "nanporo": _2, "nayoro": _2, "nemuro": _2, "niikappu": _2, "niki": _2, "nishiokoppe": _2, "noboribetsu": _2, "numata": _2, "obihiro": _2, "obira": _2, "oketo": _2, "okoppe": _2, "otaru": _2, "otobe": _2, "otofuke": _2, "otoineppu": _2, "oumu": _2, "ozora": _2, "pippu": _2, "rankoshi": _2, "rebun": _2, "rikubetsu": _2, "rishiri": _2, "rishirifuji": _2, "saroma": _2, "sarufutsu": _2, "shakotan": _2, "shari": _2, "shibecha": _2, "shibetsu": _2, "shikabe": _2, "shikaoi": _2, "shimamaki": _2, "shimizu": _2, "shimokawa": _2, "shinshinotsu": _2, "shintoku": _2, "shiranuka": _2, "shiraoi": _2, "shiriuchi": _2, "sobetsu": _2, "sunagawa": _2, "taiki": _2, "takasu": _2, "takikawa": _2, "takinoue": _2, "teshikaga": _2, "tobetsu": _2, "tohma": _2, "tomakomai": _2, "tomari": _2, "toya": _2, "toyako": _2, "toyotomi": _2, "toyoura": _2, "tsubetsu": _2, "tsukigata": _2, "urakawa": _2, "urausu": _2, "uryu": _2, "utashinai": _2, "wakkanai": _2, "wassamu": _2, "yakumo": _2, "yoichi": _2 }], "hyogo": [1, { "aioi": _2, "akashi": _2, "ako": _2, "amagasaki": _2, "aogaki": _2, "asago": _2, "ashiya": _2, "awaji": _2, "fukusaki": _2, "goshiki": _2, "harima": _2, "himeji": _2, "ichikawa": _2, "inagawa": _2, "itami": _2, "kakogawa": _2, "kamigori": _2, "kamikawa": _2, "kasai": _2, "kasuga": _2, "kawanishi": _2, "miki": _2, "minamiawaji": _2, "nishinomiya": _2, "nishiwaki": _2, "ono": _2, "sanda": _2, "sannan": _2, "sasayama": _2, "sayo": _2, "shingu": _2, "shinonsen": _2, "shiso": _2, "sumoto": _2, "taishi": _2, "taka": _2, "takarazuka": _2, "takasago": _2, "takino": _2, "tamba": _2, "tatsuno": _2, "toyooka": _2, "yabu": _2, "yashiro": _2, "yoka": _2, "yokawa": _2 }], "ibaraki": [1, { "ami": _2, "asahi": _2, "bando": _2, "chikusei": _2, "daigo": _2, "fujishiro": _2, "hitachi": _2, "hitachinaka": _2, "hitachiomiya": _2, "hitachiota": _2, "ibaraki": _2, "ina": _2, "inashiki": _2, "itako": _2, "iwama": _2, "joso": _2, "kamisu": _2, "kasama": _2, "kashima": _2, "kasumigaura": _2, "koga": _2, "miho": _2, "mito": _2, "moriya": _2, "naka": _2, "namegata": _2, "oarai": _2, "ogawa": _2, "omitama": _2, "ryugasaki": _2, "sakai": _2, "sakuragawa": _2, "shimodate": _2, "shimotsuma": _2, "shirosato": _2, "sowa": _2, "suifu": _2, "takahagi": _2, "tamatsukuri": _2, "tokai": _2, "tomobe": _2, "tone": _2, "toride": _2, "tsuchiura": _2, "tsukuba": _2, "uchihara": _2, "ushiku": _2, "yachiyo": _2, "yamagata": _2, "yawara": _2, "yuki": _2 }], "ishikawa": [1, { "anamizu": _2, "hakui": _2, "hakusan": _2, "kaga": _2, "kahoku": _2, "kanazawa": _2, "kawakita": _2, "komatsu": _2, "nakanoto": _2, "nanao": _2, "nomi": _2, "nonoichi": _2, "noto": _2, "shika": _2, "suzu": _2, "tsubata": _2, "tsurugi": _2, "uchinada": _2, "wajima": _2 }], "iwate": [1, { "fudai": _2, "fujisawa": _2, "hanamaki": _2, "hiraizumi": _2, "hirono": _2, "ichinohe": _2, "ichinoseki": _2, "iwaizumi": _2, "iwate": _2, "joboji": _2, "kamaishi": _2, "kanegasaki": _2, "karumai": _2, "kawai": _2, "kitakami": _2, "kuji": _2, "kunohe": _2, "kuzumaki": _2, "miyako": _2, "mizusawa": _2, "morioka": _2, "ninohe": _2, "noda": _2, "ofunato": _2, "oshu": _2, "otsuchi": _2, "rikuzentakata": _2, "shiwa": _2, "shizukuishi": _2, "sumita": _2, "tanohata": _2, "tono": _2, "yahaba": _2, "yamada": _2 }], "kagawa": [1, { "ayagawa": _2, "higashikagawa": _2, "kanonji": _2, "kotohira": _2, "manno": _2, "marugame": _2, "mitoyo": _2, "naoshima": _2, "sanuki": _2, "tadotsu": _2, "takamatsu": _2, "tonosho": _2, "uchinomi": _2, "utazu": _2, "zentsuji": _2 }], "kagoshima": [1, { "akune": _2, "amami": _2, "hioki": _2, "isa": _2, "isen": _2, "izumi": _2, "kagoshima": _2, "kanoya": _2, "kawanabe": _2, "kinko": _2, "kouyama": _2, "makurazaki": _2, "matsumoto": _2, "minamitane": _2, "nakatane": _2, "nishinoomote": _2, "satsumasendai": _2, "soo": _2, "tarumizu": _2, "yusui": _2 }], "kanagawa": [1, { "aikawa": _2, "atsugi": _2, "ayase": _2, "chigasaki": _2, "ebina": _2, "fujisawa": _2, "hadano": _2, "hakone": _2, "hiratsuka": _2, "isehara": _2, "kaisei": _2, "kamakura": _2, "kiyokawa": _2, "matsuda": _2, "minamiashigara": _2, "miura": _2, "nakai": _2, "ninomiya": _2, "odawara": _2, "oi": _2, "oiso": _2, "sagamihara": _2, "samukawa": _2, "tsukui": _2, "yamakita": _2, "yamato": _2, "yokosuka": _2, "yugawara": _2, "zama": _2, "zushi": _2 }], "kochi": [1, { "aki": _2, "geisei": _2, "hidaka": _2, "higashitsuno": _2, "ino": _2, "kagami": _2, "kami": _2, "kitagawa": _2, "kochi": _2, "mihara": _2, "motoyama": _2, "muroto": _2, "nahari": _2, "nakamura": _2, "nankoku": _2, "nishitosa": _2, "niyodogawa": _2, "ochi": _2, "okawa": _2, "otoyo": _2, "otsuki": _2, "sakawa": _2, "sukumo": _2, "susaki": _2, "tosa": _2, "tosashimizu": _2, "toyo": _2, "tsuno": _2, "umaji": _2, "yasuda": _2, "yusuhara": _2 }], "kumamoto": [1, { "amakusa": _2, "arao": _2, "aso": _2, "choyo": _2, "gyokuto": _2, "kamiamakusa": _2, "kikuchi": _2, "kumamoto": _2, "mashiki": _2, "mifune": _2, "minamata": _2, "minamioguni": _2, "nagasu": _2, "nishihara": _2, "oguni": _2, "ozu": _2, "sumoto": _2, "takamori": _2, "uki": _2, "uto": _2, "yamaga": _2, "yamato": _2, "yatsushiro": _2 }], "kyoto": [1, { "ayabe": _2, "fukuchiyama": _2, "higashiyama": _2, "ide": _2, "ine": _2, "joyo": _2, "kameoka": _2, "kamo": _2, "kita": _2, "kizu": _2, "kumiyama": _2, "kyotamba": _2, "kyotanabe": _2, "kyotango": _2, "maizuru": _2, "minami": _2, "minamiyamashiro": _2, "miyazu": _2, "muko": _2, "nagaokakyo": _2, "nakagyo": _2, "nantan": _2, "oyamazaki": _2, "sakyo": _2, "seika": _2, "tanabe": _2, "uji": _2, "ujitawara": _2, "wazuka": _2, "yamashina": _2, "yawata": _2 }], "mie": [1, { "asahi": _2, "inabe": _2, "ise": _2, "kameyama": _2, "kawagoe": _2, "kiho": _2, "kisosaki": _2, "kiwa": _2, "komono": _2, "kumano": _2, "kuwana": _2, "matsusaka": _2, "meiwa": _2, "mihama": _2, "minamiise": _2, "misugi": _2, "miyama": _2, "nabari": _2, "shima": _2, "suzuka": _2, "tado": _2, "taiki": _2, "taki": _2, "tamaki": _2, "toba": _2, "tsu": _2, "udono": _2, "ureshino": _2, "watarai": _2, "yokkaichi": _2 }], "miyagi": [1, { "furukawa": _2, "higashimatsushima": _2, "ishinomaki": _2, "iwanuma": _2, "kakuda": _2, "kami": _2, "kawasaki": _2, "marumori": _2, "matsushima": _2, "minamisanriku": _2, "misato": _2, "murata": _2, "natori": _2, "ogawara": _2, "ohira": _2, "onagawa": _2, "osaki": _2, "rifu": _2, "semine": _2, "shibata": _2, "shichikashuku": _2, "shikama": _2, "shiogama": _2, "shiroishi": _2, "tagajo": _2, "taiwa": _2, "tome": _2, "tomiya": _2, "wakuya": _2, "watari": _2, "yamamoto": _2, "zao": _2 }], "miyazaki": [1, { "aya": _2, "ebino": _2, "gokase": _2, "hyuga": _2, "kadogawa": _2, "kawaminami": _2, "kijo": _2, "kitagawa": _2, "kitakata": _2, "kitaura": _2, "kobayashi": _2, "kunitomi": _2, "kushima": _2, "mimata": _2, "miyakonojo": _2, "miyazaki": _2, "morotsuka": _2, "nichinan": _2, "nishimera": _2, "nobeoka": _2, "saito": _2, "shiiba": _2, "shintomi": _2, "takaharu": _2, "takanabe": _2, "takazaki": _2, "tsuno": _2 }], "nagano": [1, { "achi": _2, "agematsu": _2, "anan": _2, "aoki": _2, "asahi": _2, "azumino": _2, "chikuhoku": _2, "chikuma": _2, "chino": _2, "fujimi": _2, "hakuba": _2, "hara": _2, "hiraya": _2, "iida": _2, "iijima": _2, "iiyama": _2, "iizuna": _2, "ikeda": _2, "ikusaka": _2, "ina": _2, "karuizawa": _2, "kawakami": _2, "kiso": _2, "kisofukushima": _2, "kitaaiki": _2, "komagane": _2, "komoro": _2, "matsukawa": _2, "matsumoto": _2, "miasa": _2, "minamiaiki": _2, "minamimaki": _2, "minamiminowa": _2, "minowa": _2, "miyada": _2, "miyota": _2, "mochizuki": _2, "nagano": _2, "nagawa": _2, "nagiso": _2, "nakagawa": _2, "nakano": _2, "nozawaonsen": _2, "obuse": _2, "ogawa": _2, "okaya": _2, "omachi": _2, "omi": _2, "ookuwa": _2, "ooshika": _2, "otaki": _2, "otari": _2, "sakae": _2, "sakaki": _2, "saku": _2, "sakuho": _2, "shimosuwa": _2, "shinanomachi": _2, "shiojiri": _2, "suwa": _2, "suzaka": _2, "takagi": _2, "takamori": _2, "takayama": _2, "tateshina": _2, "tatsuno": _2, "togakushi": _2, "togura": _2, "tomi": _2, "ueda": _2, "wada": _2, "yamagata": _2, "yamanouchi": _2, "yasaka": _2, "yasuoka": _2 }], "nagasaki": [1, { "chijiwa": _2, "futsu": _2, "goto": _2, "hasami": _2, "hirado": _2, "iki": _2, "isahaya": _2, "kawatana": _2, "kuchinotsu": _2, "matsuura": _2, "nagasaki": _2, "obama": _2, "omura": _2, "oseto": _2, "saikai": _2, "sasebo": _2, "seihi": _2, "shimabara": _2, "shinkamigoto": _2, "togitsu": _2, "tsushima": _2, "unzen": _2 }], "nara": [1, { "ando": _2, "gose": _2, "heguri": _2, "higashiyoshino": _2, "ikaruga": _2, "ikoma": _2, "kamikitayama": _2, "kanmaki": _2, "kashiba": _2, "kashihara": _2, "katsuragi": _2, "kawai": _2, "kawakami": _2, "kawanishi": _2, "koryo": _2, "kurotaki": _2, "mitsue": _2, "miyake": _2, "nara": _2, "nosegawa": _2, "oji": _2, "ouda": _2, "oyodo": _2, "sakurai": _2, "sango": _2, "shimoichi": _2, "shimokitayama": _2, "shinjo": _2, "soni": _2, "takatori": _2, "tawaramoto": _2, "tenkawa": _2, "tenri": _2, "uda": _2, "yamatokoriyama": _2, "yamatotakada": _2, "yamazoe": _2, "yoshino": _2 }], "niigata": [1, { "aga": _2, "agano": _2, "gosen": _2, "itoigawa": _2, "izumozaki": _2, "joetsu": _2, "kamo": _2, "kariwa": _2, "kashiwazaki": _2, "minamiuonuma": _2, "mitsuke": _2, "muika": _2, "murakami": _2, "myoko": _2, "nagaoka": _2, "niigata": _2, "ojiya": _2, "omi": _2, "sado": _2, "sanjo": _2, "seiro": _2, "seirou": _2, "sekikawa": _2, "shibata": _2, "tagami": _2, "tainai": _2, "tochio": _2, "tokamachi": _2, "tsubame": _2, "tsunan": _2, "uonuma": _2, "yahiko": _2, "yoita": _2, "yuzawa": _2 }], "oita": [1, { "beppu": _2, "bungoono": _2, "bungotakada": _2, "hasama": _2, "hiji": _2, "himeshima": _2, "hita": _2, "kamitsue": _2, "kokonoe": _2, "kuju": _2, "kunisaki": _2, "kusu": _2, "oita": _2, "saiki": _2, "taketa": _2, "tsukumi": _2, "usa": _2, "usuki": _2, "yufu": _2 }], "okayama": [1, { "akaiwa": _2, "asakuchi": _2, "bizen": _2, "hayashima": _2, "ibara": _2, "kagamino": _2, "kasaoka": _2, "kibichuo": _2, "kumenan": _2, "kurashiki": _2, "maniwa": _2, "misaki": _2, "nagi": _2, "niimi": _2, "nishiawakura": _2, "okayama": _2, "satosho": _2, "setouchi": _2, "shinjo": _2, "shoo": _2, "soja": _2, "takahashi": _2, "tamano": _2, "tsuyama": _2, "wake": _2, "yakage": _2 }], "okinawa": [1, { "aguni": _2, "ginowan": _2, "ginoza": _2, "gushikami": _2, "haebaru": _2, "higashi": _2, "hirara": _2, "iheya": _2, "ishigaki": _2, "ishikawa": _2, "itoman": _2, "izena": _2, "kadena": _2, "kin": _2, "kitadaito": _2, "kitanakagusuku": _2, "kumejima": _2, "kunigami": _2, "minamidaito": _2, "motobu": _2, "nago": _2, "naha": _2, "nakagusuku": _2, "nakijin": _2, "nanjo": _2, "nishihara": _2, "ogimi": _2, "okinawa": _2, "onna": _2, "shimoji": _2, "taketomi": _2, "tarama": _2, "tokashiki": _2, "tomigusuku": _2, "tonaki": _2, "urasoe": _2, "uruma": _2, "yaese": _2, "yomitan": _2, "yonabaru": _2, "yonaguni": _2, "zamami": _2 }], "osaka": [1, { "abeno": _2, "chihayaakasaka": _2, "chuo": _2, "daito": _2, "fujiidera": _2, "habikino": _2, "hannan": _2, "higashiosaka": _2, "higashisumiyoshi": _2, "higashiyodogawa": _2, "hirakata": _2, "ibaraki": _2, "ikeda": _2, "izumi": _2, "izumiotsu": _2, "izumisano": _2, "kadoma": _2, "kaizuka": _2, "kanan": _2, "kashiwara": _2, "katano": _2, "kawachinagano": _2, "kishiwada": _2, "kita": _2, "kumatori": _2, "matsubara": _2, "minato": _2, "minoh": _2, "misaki": _2, "moriguchi": _2, "neyagawa": _2, "nishi": _2, "nose": _2, "osakasayama": _2, "sakai": _2, "sayama": _2, "sennan": _2, "settsu": _2, "shijonawate": _2, "shimamoto": _2, "suita": _2, "tadaoka": _2, "taishi": _2, "tajiri": _2, "takaishi": _2, "takatsuki": _2, "tondabayashi": _2, "toyonaka": _2, "toyono": _2, "yao": _2 }], "saga": [1, { "ariake": _2, "arita": _2, "fukudomi": _2, "genkai": _2, "hamatama": _2, "hizen": _2, "imari": _2, "kamimine": _2, "kanzaki": _2, "karatsu": _2, "kashima": _2, "kitagata": _2, "kitahata": _2, "kiyama": _2, "kouhoku": _2, "kyuragi": _2, "nishiarita": _2, "ogi": _2, "omachi": _2, "ouchi": _2, "saga": _2, "shiroishi": _2, "taku": _2, "tara": _2, "tosu": _2, "yoshinogari": _2 }], "saitama": [1, { "arakawa": _2, "asaka": _2, "chichibu": _2, "fujimi": _2, "fujimino": _2, "fukaya": _2, "hanno": _2, "hanyu": _2, "hasuda": _2, "hatogaya": _2, "hatoyama": _2, "hidaka": _2, "higashichichibu": _2, "higashimatsuyama": _2, "honjo": _2, "ina": _2, "iruma": _2, "iwatsuki": _2, "kamiizumi": _2, "kamikawa": _2, "kamisato": _2, "kasukabe": _2, "kawagoe": _2, "kawaguchi": _2, "kawajima": _2, "kazo": _2, "kitamoto": _2, "koshigaya": _2, "kounosu": _2, "kuki": _2, "kumagaya": _2, "matsubushi": _2, "minano": _2, "misato": _2, "miyashiro": _2, "miyoshi": _2, "moroyama": _2, "nagatoro": _2, "namegawa": _2, "niiza": _2, "ogano": _2, "ogawa": _2, "ogose": _2, "okegawa": _2, "omiya": _2, "otaki": _2, "ranzan": _2, "ryokami": _2, "saitama": _2, "sakado": _2, "satte": _2, "sayama": _2, "shiki": _2, "shiraoka": _2, "soka": _2, "sugito": _2, "toda": _2, "tokigawa": _2, "tokorozawa": _2, "tsurugashima": _2, "urawa": _2, "warabi": _2, "yashio": _2, "yokoze": _2, "yono": _2, "yorii": _2, "yoshida": _2, "yoshikawa": _2, "yoshimi": _2 }], "shiga": [1, { "aisho": _2, "gamo": _2, "higashiomi": _2, "hikone": _2, "koka": _2, "konan": _2, "kosei": _2, "koto": _2, "kusatsu": _2, "maibara": _2, "moriyama": _2, "nagahama": _2, "nishiazai": _2, "notogawa": _2, "omihachiman": _2, "otsu": _2, "ritto": _2, "ryuoh": _2, "takashima": _2, "takatsuki": _2, "torahime": _2, "toyosato": _2, "yasu": _2 }], "shimane": [1, { "akagi": _2, "ama": _2, "gotsu": _2, "hamada": _2, "higashiizumo": _2, "hikawa": _2, "hikimi": _2, "izumo": _2, "kakinoki": _2, "masuda": _2, "matsue": _2, "misato": _2, "nishinoshima": _2, "ohda": _2, "okinoshima": _2, "okuizumo": _2, "shimane": _2, "tamayu": _2, "tsuwano": _2, "unnan": _2, "yakumo": _2, "yasugi": _2, "yatsuka": _2 }], "shizuoka": [1, { "arai": _2, "atami": _2, "fuji": _2, "fujieda": _2, "fujikawa": _2, "fujinomiya": _2, "fukuroi": _2, "gotemba": _2, "haibara": _2, "hamamatsu": _2, "higashiizu": _2, "ito": _2, "iwata": _2, "izu": _2, "izunokuni": _2, "kakegawa": _2, "kannami": _2, "kawanehon": _2, "kawazu": _2, "kikugawa": _2, "kosai": _2, "makinohara": _2, "matsuzaki": _2, "minamiizu": _2, "mishima": _2, "morimachi": _2, "nishiizu": _2, "numazu": _2, "omaezaki": _2, "shimada": _2, "shimizu": _2, "shimoda": _2, "shizuoka": _2, "susono": _2, "yaizu": _2, "yoshida": _2 }], "tochigi": [1, { "ashikaga": _2, "bato": _2, "haga": _2, "ichikai": _2, "iwafune": _2, "kaminokawa": _2, "kanuma": _2, "karasuyama": _2, "kuroiso": _2, "mashiko": _2, "mibu": _2, "moka": _2, "motegi": _2, "nasu": _2, "nasushiobara": _2, "nikko": _2, "nishikata": _2, "nogi": _2, "ohira": _2, "ohtawara": _2, "oyama": _2, "sakura": _2, "sano": _2, "shimotsuke": _2, "shioya": _2, "takanezawa": _2, "tochigi": _2, "tsuga": _2, "ujiie": _2, "utsunomiya": _2, "yaita": _2 }], "tokushima": [1, { "aizumi": _2, "anan": _2, "ichiba": _2, "itano": _2, "kainan": _2, "komatsushima": _2, "matsushige": _2, "mima": _2, "minami": _2, "miyoshi": _2, "mugi": _2, "nakagawa": _2, "naruto": _2, "sanagochi": _2, "shishikui": _2, "tokushima": _2, "wajiki": _2 }], "tokyo": [1, { "adachi": _2, "akiruno": _2, "akishima": _2, "aogashima": _2, "arakawa": _2, "bunkyo": _2, "chiyoda": _2, "chofu": _2, "chuo": _2, "edogawa": _2, "fuchu": _2, "fussa": _2, "hachijo": _2, "hachioji": _2, "hamura": _2, "higashikurume": _2, "higashimurayama": _2, "higashiyamato": _2, "hino": _2, "hinode": _2, "hinohara": _2, "inagi": _2, "itabashi": _2, "katsushika": _2, "kita": _2, "kiyose": _2, "kodaira": _2, "koganei": _2, "kokubunji": _2, "komae": _2, "koto": _2, "kouzushima": _2, "kunitachi": _2, "machida": _2, "meguro": _2, "minato": _2, "mitaka": _2, "mizuho": _2, "musashimurayama": _2, "musashino": _2, "nakano": _2, "nerima": _2, "ogasawara": _2, "okutama": _2, "ome": _2, "oshima": _2, "ota": _2, "setagaya": _2, "shibuya": _2, "shinagawa": _2, "shinjuku": _2, "suginami": _2, "sumida": _2, "tachikawa": _2, "taito": _2, "tama": _2, "toshima": _2 }], "tottori": [1, { "chizu": _2, "hino": _2, "kawahara": _2, "koge": _2, "kotoura": _2, "misasa": _2, "nanbu": _2, "nichinan": _2, "sakaiminato": _2, "tottori": _2, "wakasa": _2, "yazu": _2, "yonago": _2 }], "toyama": [1, { "asahi": _2, "fuchu": _2, "fukumitsu": _2, "funahashi": _2, "himi": _2, "imizu": _2, "inami": _2, "johana": _2, "kamiichi": _2, "kurobe": _2, "nakaniikawa": _2, "namerikawa": _2, "nanto": _2, "nyuzen": _2, "oyabe": _2, "taira": _2, "takaoka": _2, "tateyama": _2, "toga": _2, "tonami": _2, "toyama": _2, "unazuki": _2, "uozu": _2, "yamada": _2 }], "wakayama": [1, { "arida": _2, "aridagawa": _2, "gobo": _2, "hashimoto": _2, "hidaka": _2, "hirogawa": _2, "inami": _2, "iwade": _2, "kainan": _2, "kamitonda": _2, "katsuragi": _2, "kimino": _2, "kinokawa": _2, "kitayama": _2, "koya": _2, "koza": _2, "kozagawa": _2, "kudoyama": _2, "kushimoto": _2, "mihama": _2, "misato": _2, "nachikatsuura": _2, "shingu": _2, "shirahama": _2, "taiji": _2, "tanabe": _2, "wakayama": _2, "yuasa": _2, "yura": _2 }], "yamagata": [1, { "asahi": _2, "funagata": _2, "higashine": _2, "iide": _2, "kahoku": _2, "kaminoyama": _2, "kaneyama": _2, "kawanishi": _2, "mamurogawa": _2, "mikawa": _2, "murayama": _2, "nagai": _2, "nakayama": _2, "nanyo": _2, "nishikawa": _2, "obanazawa": _2, "oe": _2, "oguni": _2, "ohkura": _2, "oishida": _2, "sagae": _2, "sakata": _2, "sakegawa": _2, "shinjo": _2, "shirataka": _2, "shonai": _2, "takahata": _2, "tendo": _2, "tozawa": _2, "tsuruoka": _2, "yamagata": _2, "yamanobe": _2, "yonezawa": _2, "yuza": _2 }], "yamaguchi": [1, { "abu": _2, "hagi": _2, "hikari": _2, "hofu": _2, "iwakuni": _2, "kudamatsu": _2, "mitou": _2, "nagato": _2, "oshima": _2, "shimonoseki": _2, "shunan": _2, "tabuse": _2, "tokuyama": _2, "toyota": _2, "ube": _2, "yuu": _2 }], "yamanashi": [1, { "chuo": _2, "doshi": _2, "fuefuki": _2, "fujikawa": _2, "fujikawaguchiko": _2, "fujiyoshida": _2, "hayakawa": _2, "hokuto": _2, "ichikawamisato": _2, "kai": _2, "kofu": _2, "koshu": _2, "kosuge": _2, "minami-alps": _2, "minobu": _2, "nakamichi": _2, "nanbu": _2, "narusawa": _2, "nirasaki": _2, "nishikatsura": _2, "oshino": _2, "otsuki": _2, "showa": _2, "tabayama": _2, "tsuru": _2, "uenohara": _2, "yamanakako": _2, "yamanashi": _2 }], "xn--ehqz56n": _2, "三重": _2, "xn--1lqs03n": _2, "京都": _2, "xn--qqqt11m": _2, "佐賀": _2, "xn--f6qx53a": _2, "兵庫": _2, "xn--djrs72d6uy": _2, "北海道": _2, "xn--mkru45i": _2, "千葉": _2, "xn--0trq7p7nn": _2, "和歌山": _2, "xn--5js045d": _2, "埼玉": _2, "xn--kbrq7o": _2, "大分": _2, "xn--pssu33l": _2, "大阪": _2, "xn--ntsq17g": _2, "奈良": _2, "xn--uisz3g": _2, "宮城": _2, "xn--6btw5a": _2, "宮崎": _2, "xn--1ctwo": _2, "富山": _2, "xn--6orx2r": _2, "山口": _2, "xn--rht61e": _2, "山形": _2, "xn--rht27z": _2, "山梨": _2, "xn--nit225k": _2, "岐阜": _2, "xn--rht3d": _2, "岡山": _2, "xn--djty4k": _2, "岩手": _2, "xn--klty5x": _2, "島根": _2, "xn--kltx9a": _2, "広島": _2, "xn--kltp7d": _2, "徳島": _2, "xn--c3s14m": _2, "愛媛": _2, "xn--vgu402c": _2, "愛知": _2, "xn--efvn9s": _2, "新潟": _2, "xn--1lqs71d": _2, "東京": _2, "xn--4pvxs": _2, "栃木": _2, "xn--uuwu58a": _2, "沖縄": _2, "xn--zbx025d": _2, "滋賀": _2, "xn--8pvr4u": _2, "熊本": _2, "xn--5rtp49c": _2, "石川": _2, "xn--ntso0iqx3a": _2, "神奈川": _2, "xn--elqq16h": _2, "福井": _2, "xn--4it168d": _2, "福岡": _2, "xn--klt787d": _2, "福島": _2, "xn--rny31h": _2, "秋田": _2, "xn--7t0a264c": _2, "群馬": _2, "xn--uist22h": _2, "茨城": _2, "xn--8ltr62k": _2, "長崎": _2, "xn--2m4a15e": _2, "長野": _2, "xn--32vp30h": _2, "青森": _2, "xn--4it797k": _2, "静岡": _2, "xn--5rtq34k": _2, "香川": _2, "xn--k7yn95e": _2, "高知": _2, "xn--tor131o": _2, "鳥取": _2, "xn--d5qv7z876c": _2, "鹿児島": _2, "kawasaki": _20, "kitakyushu": _20, "kobe": _20, "nagoya": _20, "sapporo": _20, "sendai": _20, "yokohama": _20, "buyshop": _3, "fashionstore": _3, "handcrafted": _3, "kawaiishop": _3, "supersale": _3, "theshop": _3, "0am": _3, "0g0": _3, "0j0": _3, "0t0": _3, "mydns": _3, "pgw": _3, "wjg": _3, "usercontent": _3, "angry": _3, "babyblue": _3, "babymilk": _3, "backdrop": _3, "bambina": _3, "bitter": _3, "blush": _3, "boo": _3, "boy": _3, "boyfriend": _3, "but": _3, "candypop": _3, "capoo": _3, "catfood": _3, "cheap": _3, "chicappa": _3, "chillout": _3, "chips": _3, "chowder": _3, "chu": _3, "ciao": _3, "cocotte": _3, "coolblog": _3, "cranky": _3, "cutegirl": _3, "daa": _3, "deca": _3, "deci": _3, "digick": _3, "egoism": _3, "fakefur": _3, "fem": _3, "flier": _3, "floppy": _3, "fool": _3, "frenchkiss": _3, "girlfriend": _3, "girly": _3, "gloomy": _3, "gonna": _3, "greater": _3, "hacca": _3, "heavy": _3, "her": _3, "hiho": _3, "hippy": _3, "holy": _3, "hungry": _3, "icurus": _3, "itigo": _3, "jellybean": _3, "kikirara": _3, "kill": _3, "kilo": _3, "kuron": _3, "littlestar": _3, "lolipopmc": _3, "lolitapunk": _3, "lomo": _3, "lovepop": _3, "lovesick": _3, "main": _3, "mods": _3, "mond": _3, "mongolian": _3, "moo": _3, "namaste": _3, "nikita": _3, "nobushi": _3, "noor": _3, "oops": _3, "parallel": _3, "parasite": _3, "pecori": _3, "peewee": _3, "penne": _3, "pepper": _3, "perma": _3, "pigboat": _3, "pinoko": _3, "punyu": _3, "pupu": _3, "pussycat": _3, "pya": _3, "raindrop": _3, "readymade": _3, "sadist": _3, "schoolbus": _3, "secret": _3, "staba": _3, "stripper": _3, "sub": _3, "sunnyday": _3, "thick": _3, "tonkotsu": _3, "under": _3, "upper": _3, "velvet": _3, "verse": _3, "versus": _3, "vivian": _3, "watson": _3, "weblike": _3, "whitesnow": _3, "zombie": _3, "hateblo": _3, "hatenablog": _3, "hatenadiary": _3, "2-d": _3, "bona": _3, "crap": _3, "daynight": _3, "eek": _3, "flop": _3, "halfmoon": _3, "jeez": _3, "matrix": _3, "mimoza": _3, "netgamers": _3, "nyanta": _3, "o0o0": _3, "rdy": _3, "rgr": _3, "rulez": _3, "sakurastorage": [0, { "isk01": _58, "isk02": _58 }], "saloon": _3, "sblo": _3, "skr": _3, "tank": _3, "uh-oh": _3, "undo": _3, "webaccel": [0, { "rs": _3, "user": _3 }], "websozai": _3, "xii": _3 }], "ke": [1, { "ac": _2, "co": _2, "go": _2, "info": _2, "me": _2, "mobi": _2, "ne": _2, "or": _2, "sc": _2 }], "kg": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "us": _3, "xx": _3 }], "kh": _20, "ki": _59, "km": [1, { "ass": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "nom": _2, "org": _2, "prd": _2, "tm": _2, "asso": _2, "coop": _2, "gouv": _2, "medecin": _2, "notaires": _2, "pharmaciens": _2, "presse": _2, "veterinaire": _2 }], "kn": [1, { "edu": _2, "gov": _2, "net": _2, "org": _2 }], "kp": [1, { "com": _2, "edu": _2, "gov": _2, "org": _2, "rep": _2, "tra": _2 }], "kr": [1, { "ac": _2, "ai": _2, "co": _2, "es": _2, "go": _2, "hs": _2, "io": _2, "it": _2, "kg": _2, "me": _2, "mil": _2, "ms": _2, "ne": _2, "or": _2, "pe": _2, "re": _2, "sc": _2, "busan": _2, "chungbuk": _2, "chungnam": _2, "daegu": _2, "daejeon": _2, "gangwon": _2, "gwangju": _2, "gyeongbuk": _2, "gyeonggi": _2, "gyeongnam": _2, "incheon": _2, "jeju": _2, "jeonbuk": _2, "jeonnam": _2, "seoul": _2, "ulsan": _2, "c01": _3, "eliv-cdn": _3, "eliv-dns": _3, "mmv": _3, "vki": _3 }], "kw": [1, { "com": _2, "edu": _2, "emb": _2, "gov": _2, "ind": _2, "net": _2, "org": _2 }], "ky": _47, "kz": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "jcloud": _3 }], "la": [1, { "com": _2, "edu": _2, "gov": _2, "info": _2, "int": _2, "net": _2, "org": _2, "per": _2, "bnr": _3 }], "lb": _4, "lc": [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "oy": _3 }], "li": _2, "lk": [1, { "ac": _2, "assn": _2, "com": _2, "edu": _2, "gov": _2, "grp": _2, "hotel": _2, "int": _2, "ltd": _2, "net": _2, "ngo": _2, "org": _2, "sch": _2, "soc": _2, "web": _2 }], "lr": _4, "ls": [1, { "ac": _2, "biz": _2, "co": _2, "edu": _2, "gov": _2, "info": _2, "net": _2, "org": _2, "sc": _2 }], "lt": _10, "lu": [1, { "123website": _3 }], "lv": [1, { "asn": _2, "com": _2, "conf": _2, "edu": _2, "gov": _2, "id": _2, "mil": _2, "net": _2, "org": _2 }], "ly": [1, { "com": _2, "edu": _2, "gov": _2, "id": _2, "med": _2, "net": _2, "org": _2, "plc": _2, "sch": _2 }], "ma": [1, { "ac": _2, "co": _2, "gov": _2, "net": _2, "org": _2, "press": _2 }], "mc": [1, { "asso": _2, "tm": _2 }], "md": [1, { "ir": _3 }], "me": [1, { "ac": _2, "co": _2, "edu": _2, "gov": _2, "its": _2, "net": _2, "org": _2, "priv": _2, "c66": _3, "craft": _3, "edgestack": _3, "filegear": _3, "filegear-sg": _3, "lohmus": _3, "barsy": _3, "mcdir": _3, "brasilia": _3, "ddns": _3, "dnsfor": _3, "hopto": _3, "loginto": _3, "noip": _3, "webhop": _3, "soundcast": _3, "tcp4": _3, "vp4": _3, "diskstation": _3, "dscloud": _3, "i234": _3, "myds": _3, "synology": _3, "transip": _46, "nohost": _3 }], "mg": [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "nom": _2, "org": _2, "prd": _2 }], "mh": _2, "mil": _2, "mk": [1, { "com": _2, "edu": _2, "gov": _2, "inf": _2, "name": _2, "net": _2, "org": _2 }], "ml": [1, { "ac": _2, "art": _2, "asso": _2, "com": _2, "edu": _2, "gouv": _2, "gov": _2, "info": _2, "inst": _2, "net": _2, "org": _2, "pr": _2, "presse": _2 }], "mm": _20, "mn": [1, { "edu": _2, "gov": _2, "org": _2, "nyc": _3 }], "mo": _4, "mobi": [1, { "barsy": _3, "dscloud": _3 }], "mp": [1, { "ju": _3 }], "mq": _2, "mr": _10, "ms": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "minisite": _3 }], "mt": _47, "mu": [1, { "ac": _2, "co": _2, "com": _2, "gov": _2, "net": _2, "or": _2, "org": _2 }], "museum": _2, "mv": [1, { "aero": _2, "biz": _2, "com": _2, "coop": _2, "edu": _2, "gov": _2, "info": _2, "int": _2, "mil": _2, "museum": _2, "name": _2, "net": _2, "org": _2, "pro": _2 }], "mw": [1, { "ac": _2, "biz": _2, "co": _2, "com": _2, "coop": _2, "edu": _2, "gov": _2, "int": _2, "net": _2, "org": _2 }], "mx": [1, { "com": _2, "edu": _2, "gob": _2, "net": _2, "org": _2 }], "my": [1, { "biz": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "name": _2, "net": _2, "org": _2 }], "mz": [1, { "ac": _2, "adv": _2, "co": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 }], "na": [1, { "alt": _2, "co": _2, "com": _2, "gov": _2, "net": _2, "org": _2 }], "name": [1, { "her": _62, "his": _62, "ispmanager": _3 }], "nc": [1, { "asso": _2, "nom": _2 }], "ne": _2, "net": [1, { "adobeaemcloud": _3, "adobeio-static": _3, "adobeioruntime": _3, "akadns": _3, "akamai": _3, "akamai-staging": _3, "akamaiedge": _3, "akamaiedge-staging": _3, "akamaihd": _3, "akamaihd-staging": _3, "akamaiorigin": _3, "akamaiorigin-staging": _3, "akamaized": _3, "akamaized-staging": _3, "edgekey": _3, "edgekey-staging": _3, "edgesuite": _3, "edgesuite-staging": _3, "alwaysdata": _3, "myamaze": _3, "cloudfront": _3, "appudo": _3, "atlassian-dev": [0, { "prod": _54 }], "myfritz": _3, "onavstack": _3, "shopselect": _3, "blackbaudcdn": _3, "boomla": _3, "bplaced": _3, "square7": _3, "cdn77": [0, { "r": _3 }], "cdn77-ssl": _3, "gb": _3, "hu": _3, "jp": _3, "se": _3, "uk": _3, "clickrising": _3, "ddns-ip": _3, "dns-cloud": _3, "dns-dynamic": _3, "cloudaccess": _3, "cloudflare": [2, { "cdn": _3 }], "cloudflareanycast": _54, "cloudflarecn": _54, "cloudflareglobal": _54, "ctfcloud": _3, "feste-ip": _3, "knx-server": _3, "static-access": _3, "cryptonomic": _6, "dattolocal": _3, "mydatto": _3, "debian": _3, "definima": _3, "deno": _3, "icp": _6, "de5": _3, "at-band-camp": _3, "blogdns": _3, "broke-it": _3, "buyshouses": _3, "dnsalias": _3, "dnsdojo": _3, "does-it": _3, "dontexist": _3, "dynalias": _3, "dynathome": _3, "endofinternet": _3, "from-az": _3, "from-co": _3, "from-la": _3, "from-ny": _3, "gets-it": _3, "ham-radio-op": _3, "homeftp": _3, "homeip": _3, "homelinux": _3, "homeunix": _3, "in-the-band": _3, "is-a-chef": _3, "is-a-geek": _3, "isa-geek": _3, "kicks-ass": _3, "office-on-the": _3, "podzone": _3, "scrapper-site": _3, "selfip": _3, "sells-it": _3, "servebbs": _3, "serveftp": _3, "thruhere": _3, "webhop": _3, "casacam": _3, "dynu": _3, "dynv6": _3, "twmail": _3, "ru": _3, "channelsdvr": [2, { "u": _3 }], "fastly": [0, { "freetls": _3, "map": _3, "prod": [0, { "a": _3, "global": _3 }], "ssl": [0, { "a": _3, "b": _3, "global": _3 }] }], "fastlylb": [2, { "map": _3 }], "edgeapp": _3, "keyword-on": _3, "live-on": _3, "server-on": _3, "cdn-edges": _3, "heteml": _3, "cloudfunctions": _3, "grafana-dev": _3, "iobb": _3, "moonscale": _3, "in-dsl": _3, "in-vpn": _3, "oninferno": _3, "botdash": _3, "apps-1and1": _3, "ipifony": _3, "cloudjiffy": [2, { "fra1-de": _3, "west1-us": _3 }], "elastx": [0, { "jls-sto1": _3, "jls-sto2": _3, "jls-sto3": _3 }], "massivegrid": [0, { "paas": [0, { "fr-1": _3, "lon-1": _3, "lon-2": _3, "ny-1": _3, "ny-2": _3, "sg-1": _3 }] }], "saveincloud": [0, { "jelastic": _3, "nordeste-idc": _3 }], "scaleforce": _48, "kinghost": _3, "uni5": _3, "krellian": _3, "ggff": _3, "localto": _6, "barsy": _3, "luyani": _3, "memset": _3, "azure-api": _3, "azure-mobile": _3, "azureedge": _3, "azurefd": _3, "azurestaticapps": [2, { "1": _3, "2": _3, "3": _3, "4": _3, "5": _3, "6": _3, "7": _3, "centralus": _3, "eastasia": _3, "eastus2": _3, "westeurope": _3, "westus2": _3 }], "azurewebsites": _3, "cloudapp": _3, "trafficmanager": _3, "windows": [0, { "core": [0, { "blob": _3 }], "servicebus": _3 }], "mynetname": [0, { "sn": _3 }], "routingthecloud": _3, "bounceme": _3, "ddns": _3, "eating-organic": _3, "mydissent": _3, "myeffect": _3, "mymediapc": _3, "mypsx": _3, "mysecuritycamera": _3, "nhlfan": _3, "no-ip": _3, "pgafan": _3, "privatizehealthinsurance": _3, "redirectme": _3, "serveblog": _3, "serveminecraft": _3, "sytes": _3, "dnsup": _3, "hicam": _3, "now-dns": _3, "ownip": _3, "vpndns": _3, "cloudycluster": _3, "ovh": [0, { "hosting": _6, "webpaas": _6 }], "rackmaze": _3, "myradweb": _3, "in": _3, "subsc-pay": _3, "squares": _3, "schokokeks": _3, "firewall-gateway": _3, "seidat": _3, "senseering": _3, "siteleaf": _3, "mafelo": _3, "myspreadshop": _3, "vps-host": [2, { "jelastic": [0, { "atl": _3, "njs": _3, "ric": _3 }] }], "srcf": [0, { "soc": _3, "user": _3 }], "supabase": _3, "dsmynas": _3, "familyds": _3, "ts": [2, { "c": _6 }], "torproject": [2, { "pages": _3 }], "tunnelmole": _3, "vusercontent": _3, "reserve-online": _3, "localcert": _3, "community-pro": _3, "meinforum": _3, "yandexcloud": [2, { "storage": _3, "website": _3 }], "za": _3, "zabc": _3 }], "nf": [1, { "arts": _2, "com": _2, "firm": _2, "info": _2, "net": _2, "other": _2, "per": _2, "rec": _2, "store": _2, "web": _2 }], "ng": [1, { "com": _2, "edu": _2, "gov": _2, "i": _2, "mil": _2, "mobi": _2, "name": _2, "net": _2, "org": _2, "sch": _2, "biz": [2, { "co": _3, "dl": _3, "go": _3, "lg": _3, "on": _3 }], "col": _3, "firm": _3, "gen": _3, "ltd": _3, "ngo": _3, "plc": _3 }], "ni": [1, { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "gob": _2, "in": _2, "info": _2, "int": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "web": _2 }], "nl": [1, { "co": _3, "hosting-cluster": _3, "gov": _3, "khplay": _3, "123website": _3, "myspreadshop": _3, "transurl": _6, "cistron": _3, "demon": _3 }], "no": [1, { "fhs": _2, "folkebibl": _2, "fylkesbibl": _2, "idrett": _2, "museum": _2, "priv": _2, "vgs": _2, "dep": _2, "herad": _2, "kommune": _2, "mil": _2, "stat": _2, "aa": _63, "ah": _63, "bu": _63, "fm": _63, "hl": _63, "hm": _63, "jan-mayen": _63, "mr": _63, "nl": _63, "nt": _63, "of": _63, "ol": _63, "oslo": _63, "rl": _63, "sf": _63, "st": _63, "svalbard": _63, "tm": _63, "tr": _63, "va": _63, "vf": _63, "akrehamn": _2, "xn--krehamn-dxa": _2, "åkrehamn": _2, "algard": _2, "xn--lgrd-poac": _2, "ålgård": _2, "arna": _2, "bronnoysund": _2, "xn--brnnysund-m8ac": _2, "brønnøysund": _2, "brumunddal": _2, "bryne": _2, "drobak": _2, "xn--drbak-wua": _2, "drøbak": _2, "egersund": _2, "fetsund": _2, "floro": _2, "xn--flor-jra": _2, "florø": _2, "fredrikstad": _2, "hokksund": _2, "honefoss": _2, "xn--hnefoss-q1a": _2, "hønefoss": _2, "jessheim": _2, "jorpeland": _2, "xn--jrpeland-54a": _2, "jørpeland": _2, "kirkenes": _2, "kopervik": _2, "krokstadelva": _2, "langevag": _2, "xn--langevg-jxa": _2, "langevåg": _2, "leirvik": _2, "mjondalen": _2, "xn--mjndalen-64a": _2, "mjøndalen": _2, "mo-i-rana": _2, "mosjoen": _2, "xn--mosjen-eya": _2, "mosjøen": _2, "nesoddtangen": _2, "orkanger": _2, "osoyro": _2, "xn--osyro-wua": _2, "osøyro": _2, "raholt": _2, "xn--rholt-mra": _2, "råholt": _2, "sandnessjoen": _2, "xn--sandnessjen-ogb": _2, "sandnessjøen": _2, "skedsmokorset": _2, "slattum": _2, "spjelkavik": _2, "stathelle": _2, "stavern": _2, "stjordalshalsen": _2, "xn--stjrdalshalsen-sqb": _2, "stjørdalshalsen": _2, "tananger": _2, "tranby": _2, "vossevangen": _2, "aarborte": _2, "aejrie": _2, "afjord": _2, "xn--fjord-lra": _2, "åfjord": _2, "agdenes": _2, "akershus": _64, "aknoluokta": _2, "xn--koluokta-7ya57h": _2, "ákŋoluokta": _2, "al": _2, "xn--l-1fa": _2, "ål": _2, "alaheadju": _2, "xn--laheadju-7ya": _2, "álaheadju": _2, "alesund": _2, "xn--lesund-hua": _2, "ålesund": _2, "alstahaug": _2, "alta": _2, "xn--lt-liac": _2, "áltá": _2, "alvdal": _2, "amli": _2, "xn--mli-tla": _2, "åmli": _2, "amot": _2, "xn--mot-tla": _2, "åmot": _2, "andasuolo": _2, "andebu": _2, "andoy": _2, "xn--andy-ira": _2, "andøy": _2, "ardal": _2, "xn--rdal-poa": _2, "årdal": _2, "aremark": _2, "arendal": _2, "xn--s-1fa": _2, "ås": _2, "aseral": _2, "xn--seral-lra": _2, "åseral": _2, "asker": _2, "askim": _2, "askoy": _2, "xn--asky-ira": _2, "askøy": _2, "askvoll": _2, "asnes": _2, "xn--snes-poa": _2, "åsnes": _2, "audnedaln": _2, "aukra": _2, "aure": _2, "aurland": _2, "aurskog-holand": _2, "xn--aurskog-hland-jnb": _2, "aurskog-høland": _2, "austevoll": _2, "austrheim": _2, "averoy": _2, "xn--avery-yua": _2, "averøy": _2, "badaddja": _2, "xn--bdddj-mrabd": _2, "bådåddjå": _2, "xn--brum-voa": _2, "bærum": _2, "bahcavuotna": _2, "xn--bhcavuotna-s4a": _2, "báhcavuotna": _2, "bahccavuotna": _2, "xn--bhccavuotna-k7a": _2, "báhccavuotna": _2, "baidar": _2, "xn--bidr-5nac": _2, "báidár": _2, "bajddar": _2, "xn--bjddar-pta": _2, "bájddar": _2, "balat": _2, "xn--blt-elab": _2, "bálát": _2, "balestrand": _2, "ballangen": _2, "balsfjord": _2, "bamble": _2, "bardu": _2, "barum": _2, "batsfjord": _2, "xn--btsfjord-9za": _2, "båtsfjord": _2, "bearalvahki": _2, "xn--bearalvhki-y4a": _2, "bearalváhki": _2, "beardu": _2, "beiarn": _2, "berg": _2, "bergen": _2, "berlevag": _2, "xn--berlevg-jxa": _2, "berlevåg": _2, "bievat": _2, "xn--bievt-0qa": _2, "bievát": _2, "bindal": _2, "birkenes": _2, "bjerkreim": _2, "bjugn": _2, "bodo": _2, "xn--bod-2na": _2, "bodø": _2, "bokn": _2, "bomlo": _2, "xn--bmlo-gra": _2, "bømlo": _2, "bremanger": _2, "bronnoy": _2, "xn--brnny-wuac": _2, "brønnøy": _2, "budejju": _2, "buskerud": _64, "bygland": _2, "bykle": _2, "cahcesuolo": _2, "xn--hcesuolo-7ya35b": _2, "čáhcesuolo": _2, "davvenjarga": _2, "xn--davvenjrga-y4a": _2, "davvenjárga": _2, "davvesiida": _2, "deatnu": _2, "dielddanuorri": _2, "divtasvuodna": _2, "divttasvuotna": _2, "donna": _2, "xn--dnna-gra": _2, "dønna": _2, "dovre": _2, "drammen": _2, "drangedal": _2, "dyroy": _2, "xn--dyry-ira": _2, "dyrøy": _2, "eid": _2, "eidfjord": _2, "eidsberg": _2, "eidskog": _2, "eidsvoll": _2, "eigersund": _2, "elverum": _2, "enebakk": _2, "engerdal": _2, "etne": _2, "etnedal": _2, "evenassi": _2, "xn--eveni-0qa01ga": _2, "evenášši": _2, "evenes": _2, "evje-og-hornnes": _2, "farsund": _2, "fauske": _2, "fedje": _2, "fet": _2, "finnoy": _2, "xn--finny-yua": _2, "finnøy": _2, "fitjar": _2, "fjaler": _2, "fjell": _2, "fla": _2, "xn--fl-zia": _2, "flå": _2, "flakstad": _2, "flatanger": _2, "flekkefjord": _2, "flesberg": _2, "flora": _2, "folldal": _2, "forde": _2, "xn--frde-gra": _2, "førde": _2, "forsand": _2, "fosnes": _2, "xn--frna-woa": _2, "fræna": _2, "frana": _2, "frei": _2, "frogn": _2, "froland": _2, "frosta": _2, "froya": _2, "xn--frya-hra": _2, "frøya": _2, "fuoisku": _2, "fuossko": _2, "fusa": _2, "fyresdal": _2, "gaivuotna": _2, "xn--givuotna-8ya": _2, "gáivuotna": _2, "galsa": _2, "xn--gls-elac": _2, "gálsá": _2, "gamvik": _2, "gangaviika": _2, "xn--ggaviika-8ya47h": _2, "gáŋgaviika": _2, "gaular": _2, "gausdal": _2, "giehtavuoatna": _2, "gildeskal": _2, "xn--gildeskl-g0a": _2, "gildeskål": _2, "giske": _2, "gjemnes": _2, "gjerdrum": _2, "gjerstad": _2, "gjesdal": _2, "gjovik": _2, "xn--gjvik-wua": _2, "gjøvik": _2, "gloppen": _2, "gol": _2, "gran": _2, "grane": _2, "granvin": _2, "gratangen": _2, "grimstad": _2, "grong": _2, "grue": _2, "gulen": _2, "guovdageaidnu": _2, "ha": _2, "xn--h-2fa": _2, "hå": _2, "habmer": _2, "xn--hbmer-xqa": _2, "hábmer": _2, "hadsel": _2, "xn--hgebostad-g3a": _2, "hægebostad": _2, "hagebostad": _2, "halden": _2, "halsa": _2, "hamar": _2, "hamaroy": _2, "hammarfeasta": _2, "xn--hmmrfeasta-s4ac": _2, "hámmárfeasta": _2, "hammerfest": _2, "hapmir": _2, "xn--hpmir-xqa": _2, "hápmir": _2, "haram": _2, "hareid": _2, "harstad": _2, "hasvik": _2, "hattfjelldal": _2, "haugesund": _2, "hedmark": [0, { "os": _2, "valer": _2, "xn--vler-qoa": _2, "våler": _2 }], "hemne": _2, "hemnes": _2, "hemsedal": _2, "hitra": _2, "hjartdal": _2, "hjelmeland": _2, "hobol": _2, "xn--hobl-ira": _2, "hobøl": _2, "hof": _2, "hol": _2, "hole": _2, "holmestrand": _2, "holtalen": _2, "xn--holtlen-hxa": _2, "holtålen": _2, "hordaland": [0, { "os": _2 }], "hornindal": _2, "horten": _2, "hoyanger": _2, "xn--hyanger-q1a": _2, "høyanger": _2, "hoylandet": _2, "xn--hylandet-54a": _2, "høylandet": _2, "hurdal": _2, "hurum": _2, "hvaler": _2, "hyllestad": _2, "ibestad": _2, "inderoy": _2, "xn--indery-fya": _2, "inderøy": _2, "iveland": _2, "ivgu": _2, "jevnaker": _2, "jolster": _2, "xn--jlster-bya": _2, "jølster": _2, "jondal": _2, "kafjord": _2, "xn--kfjord-iua": _2, "kåfjord": _2, "karasjohka": _2, "xn--krjohka-hwab49j": _2, "kárášjohka": _2, "karasjok": _2, "karlsoy": _2, "karmoy": _2, "xn--karmy-yua": _2, "karmøy": _2, "kautokeino": _2, "klabu": _2, "xn--klbu-woa": _2, "klæbu": _2, "klepp": _2, "kongsberg": _2, "kongsvinger": _2, "kraanghke": _2, "xn--kranghke-b0a": _2, "kråanghke": _2, "kragero": _2, "xn--krager-gya": _2, "kragerø": _2, "kristiansand": _2, "kristiansund": _2, "krodsherad": _2, "xn--krdsherad-m8a": _2, "krødsherad": _2, "xn--kvfjord-nxa": _2, "kvæfjord": _2, "xn--kvnangen-k0a": _2, "kvænangen": _2, "kvafjord": _2, "kvalsund": _2, "kvam": _2, "kvanangen": _2, "kvinesdal": _2, "kvinnherad": _2, "kviteseid": _2, "kvitsoy": _2, "xn--kvitsy-fya": _2, "kvitsøy": _2, "laakesvuemie": _2, "xn--lrdal-sra": _2, "lærdal": _2, "lahppi": _2, "xn--lhppi-xqa": _2, "láhppi": _2, "lardal": _2, "larvik": _2, "lavagis": _2, "lavangen": _2, "leangaviika": _2, "xn--leagaviika-52b": _2, "leaŋgaviika": _2, "lebesby": _2, "leikanger": _2, "leirfjord": _2, "leka": _2, "leksvik": _2, "lenvik": _2, "lerdal": _2, "lesja": _2, "levanger": _2, "lier": _2, "lierne": _2, "lillehammer": _2, "lillesand": _2, "lindas": _2, "xn--linds-pra": _2, "lindås": _2, "lindesnes": _2, "loabat": _2, "xn--loabt-0qa": _2, "loabát": _2, "lodingen": _2, "xn--ldingen-q1a": _2, "lødingen": _2, "lom": _2, "loppa": _2, "lorenskog": _2, "xn--lrenskog-54a": _2, "lørenskog": _2, "loten": _2, "xn--lten-gra": _2, "løten": _2, "lund": _2, "lunner": _2, "luroy": _2, "xn--lury-ira": _2, "lurøy": _2, "luster": _2, "lyngdal": _2, "lyngen": _2, "malatvuopmi": _2, "xn--mlatvuopmi-s4a": _2, "málatvuopmi": _2, "malselv": _2, "xn--mlselv-iua": _2, "målselv": _2, "malvik": _2, "mandal": _2, "marker": _2, "marnardal": _2, "masfjorden": _2, "masoy": _2, "xn--msy-ula0h": _2, "måsøy": _2, "matta-varjjat": _2, "xn--mtta-vrjjat-k7af": _2, "mátta-várjjat": _2, "meland": _2, "meldal": _2, "melhus": _2, "meloy": _2, "xn--mely-ira": _2, "meløy": _2, "meraker": _2, "xn--merker-kua": _2, "meråker": _2, "midsund": _2, "midtre-gauldal": _2, "moareke": _2, "xn--moreke-jua": _2, "moåreke": _2, "modalen": _2, "modum": _2, "molde": _2, "more-og-romsdal": [0, { "heroy": _2, "sande": _2 }], "xn--mre-og-romsdal-qqb": [0, { "xn--hery-ira": _2, "sande": _2 }], "møre-og-romsdal": [0, { "herøy": _2, "sande": _2 }], "moskenes": _2, "moss": _2, "muosat": _2, "xn--muost-0qa": _2, "muosát": _2, "naamesjevuemie": _2, "xn--nmesjevuemie-tcba": _2, "nååmesjevuemie": _2, "xn--nry-yla5g": _2, "nærøy": _2, "namdalseid": _2, "namsos": _2, "namsskogan": _2, "nannestad": _2, "naroy": _2, "narviika": _2, "narvik": _2, "naustdal": _2, "navuotna": _2, "xn--nvuotna-hwa": _2, "návuotna": _2, "nedre-eiker": _2, "nesna": _2, "nesodden": _2, "nesseby": _2, "nesset": _2, "nissedal": _2, "nittedal": _2, "nord-aurdal": _2, "nord-fron": _2, "nord-odal": _2, "norddal": _2, "nordkapp": _2, "nordland": [0, { "bo": _2, "xn--b-5ga": _2, "bø": _2, "heroy": _2, "xn--hery-ira": _2, "herøy": _2 }], "nordre-land": _2, "nordreisa": _2, "nore-og-uvdal": _2, "notodden": _2, "notteroy": _2, "xn--nttery-byae": _2, "nøtterøy": _2, "odda": _2, "oksnes": _2, "xn--ksnes-uua": _2, "øksnes": _2, "omasvuotna": _2, "oppdal": _2, "oppegard": _2, "xn--oppegrd-ixa": _2, "oppegård": _2, "orkdal": _2, "orland": _2, "xn--rland-uua": _2, "ørland": _2, "orskog": _2, "xn--rskog-uua": _2, "ørskog": _2, "orsta": _2, "xn--rsta-fra": _2, "ørsta": _2, "osen": _2, "osteroy": _2, "xn--ostery-fya": _2, "osterøy": _2, "ostfold": [0, { "valer": _2 }], "xn--stfold-9xa": [0, { "xn--vler-qoa": _2 }], "østfold": [0, { "våler": _2 }], "ostre-toten": _2, "xn--stre-toten-zcb": _2, "østre-toten": _2, "overhalla": _2, "ovre-eiker": _2, "xn--vre-eiker-k8a": _2, "øvre-eiker": _2, "oyer": _2, "xn--yer-zna": _2, "øyer": _2, "oygarden": _2, "xn--ygarden-p1a": _2, "øygarden": _2, "oystre-slidre": _2, "xn--ystre-slidre-ujb": _2, "øystre-slidre": _2, "porsanger": _2, "porsangu": _2, "xn--porsgu-sta26f": _2, "porsáŋgu": _2, "porsgrunn": _2, "rade": _2, "xn--rde-ula": _2, "råde": _2, "radoy": _2, "xn--rady-ira": _2, "radøy": _2, "xn--rlingen-mxa": _2, "rælingen": _2, "rahkkeravju": _2, "xn--rhkkervju-01af": _2, "ráhkkerávju": _2, "raisa": _2, "xn--risa-5na": _2, "ráisa": _2, "rakkestad": _2, "ralingen": _2, "rana": _2, "randaberg": _2, "rauma": _2, "rendalen": _2, "rennebu": _2, "rennesoy": _2, "xn--rennesy-v1a": _2, "rennesøy": _2, "rindal": _2, "ringebu": _2, "ringerike": _2, "ringsaker": _2, "risor": _2, "xn--risr-ira": _2, "risør": _2, "rissa": _2, "roan": _2, "rodoy": _2, "xn--rdy-0nab": _2, "rødøy": _2, "rollag": _2, "romsa": _2, "romskog": _2, "xn--rmskog-bya": _2, "rømskog": _2, "roros": _2, "xn--rros-gra": _2, "røros": _2, "rost": _2, "xn--rst-0na": _2, "røst": _2, "royken": _2, "xn--ryken-vua": _2, "røyken": _2, "royrvik": _2, "xn--ryrvik-bya": _2, "røyrvik": _2, "ruovat": _2, "rygge": _2, "salangen": _2, "salat": _2, "xn--slat-5na": _2, "sálat": _2, "xn--slt-elab": _2, "sálát": _2, "saltdal": _2, "samnanger": _2, "sandefjord": _2, "sandnes": _2, "sandoy": _2, "xn--sandy-yua": _2, "sandøy": _2, "sarpsborg": _2, "sauda": _2, "sauherad": _2, "sel": _2, "selbu": _2, "selje": _2, "seljord": _2, "siellak": _2, "sigdal": _2, "siljan": _2, "sirdal": _2, "skanit": _2, "xn--sknit-yqa": _2, "skánit": _2, "skanland": _2, "xn--sknland-fxa": _2, "skånland": _2, "skaun": _2, "skedsmo": _2, "ski": _2, "skien": _2, "skierva": _2, "xn--skierv-uta": _2, "skiervá": _2, "skiptvet": _2, "skjak": _2, "xn--skjk-soa": _2, "skjåk": _2, "skjervoy": _2, "xn--skjervy-v1a": _2, "skjervøy": _2, "skodje": _2, "smola": _2, "xn--smla-hra": _2, "smøla": _2, "snaase": _2, "xn--snase-nra": _2, "snåase": _2, "snasa": _2, "xn--snsa-roa": _2, "snåsa": _2, "snillfjord": _2, "snoasa": _2, "sogndal": _2, "sogne": _2, "xn--sgne-gra": _2, "søgne": _2, "sokndal": _2, "sola": _2, "solund": _2, "somna": _2, "xn--smna-gra": _2, "sømna": _2, "sondre-land": _2, "xn--sndre-land-0cb": _2, "søndre-land": _2, "songdalen": _2, "sor-aurdal": _2, "xn--sr-aurdal-l8a": _2, "sør-aurdal": _2, "sor-fron": _2, "xn--sr-fron-q1a": _2, "sør-fron": _2, "sor-odal": _2, "xn--sr-odal-q1a": _2, "sør-odal": _2, "sor-varanger": _2, "xn--sr-varanger-ggb": _2, "sør-varanger": _2, "sorfold": _2, "xn--srfold-bya": _2, "sørfold": _2, "sorreisa": _2, "xn--srreisa-q1a": _2, "sørreisa": _2, "sortland": _2, "sorum": _2, "xn--srum-gra": _2, "sørum": _2, "spydeberg": _2, "stange": _2, "stavanger": _2, "steigen": _2, "steinkjer": _2, "stjordal": _2, "xn--stjrdal-s1a": _2, "stjørdal": _2, "stokke": _2, "stor-elvdal": _2, "stord": _2, "stordal": _2, "storfjord": _2, "strand": _2, "stranda": _2, "stryn": _2, "sula": _2, "suldal": _2, "sund": _2, "sunndal": _2, "surnadal": _2, "sveio": _2, "svelvik": _2, "sykkylven": _2, "tana": _2, "telemark": [0, { "bo": _2, "xn--b-5ga": _2, "bø": _2 }], "time": _2, "tingvoll": _2, "tinn": _2, "tjeldsund": _2, "tjome": _2, "xn--tjme-hra": _2, "tjøme": _2, "tokke": _2, "tolga": _2, "tonsberg": _2, "xn--tnsberg-q1a": _2, "tønsberg": _2, "torsken": _2, "xn--trna-woa": _2, "træna": _2, "trana": _2, "tranoy": _2, "xn--trany-yua": _2, "tranøy": _2, "troandin": _2, "trogstad": _2, "xn--trgstad-r1a": _2, "trøgstad": _2, "tromsa": _2, "tromso": _2, "xn--troms-zua": _2, "tromsø": _2, "trondheim": _2, "trysil": _2, "tvedestrand": _2, "tydal": _2, "tynset": _2, "tysfjord": _2, "tysnes": _2, "xn--tysvr-vra": _2, "tysvær": _2, "tysvar": _2, "ullensaker": _2, "ullensvang": _2, "ulvik": _2, "unjarga": _2, "xn--unjrga-rta": _2, "unjárga": _2, "utsira": _2, "vaapste": _2, "vadso": _2, "xn--vads-jra": _2, "vadsø": _2, "xn--vry-yla5g": _2, "værøy": _2, "vaga": _2, "xn--vg-yiab": _2, "vågå": _2, "vagan": _2, "xn--vgan-qoa": _2, "vågan": _2, "vagsoy": _2, "xn--vgsy-qoa0j": _2, "vågsøy": _2, "vaksdal": _2, "valle": _2, "vang": _2, "vanylven": _2, "vardo": _2, "xn--vard-jra": _2, "vardø": _2, "varggat": _2, "xn--vrggt-xqad": _2, "várggát": _2, "varoy": _2, "vefsn": _2, "vega": _2, "vegarshei": _2, "xn--vegrshei-c0a": _2, "vegårshei": _2, "vennesla": _2, "verdal": _2, "verran": _2, "vestby": _2, "vestfold": [0, { "sande": _2 }], "vestnes": _2, "vestre-slidre": _2, "vestre-toten": _2, "vestvagoy": _2, "xn--vestvgy-ixa6o": _2, "vestvågøy": _2, "vevelstad": _2, "vik": _2, "vikna": _2, "vindafjord": _2, "voagat": _2, "volda": _2, "voss": _2, "co": _3, "123hjemmeside": _3, "myspreadshop": _3 }], "np": _20, "nr": _59, "nu": [1, { "merseine": _3, "mine": _3, "shacknet": _3, "enterprisecloud": _3 }], "nz": [1, { "ac": _2, "co": _2, "cri": _2, "geek": _2, "gen": _2, "govt": _2, "health": _2, "iwi": _2, "kiwi": _2, "maori": _2, "xn--mori-qsa": _2, "māori": _2, "mil": _2, "net": _2, "org": _2, "parliament": _2, "school": _2, "cloudns": _3 }], "om": [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "med": _2, "museum": _2, "net": _2, "org": _2, "pro": _2 }], "onion": _2, "org": [1, { "altervista": _3, "pimienta": _3, "poivron": _3, "potager": _3, "sweetpepper": _3, "cdn77": [0, { "c": _3, "rsc": _3 }], "cdn77-secure": [0, { "origin": [0, { "ssl": _3 }] }], "ae": _3, "cloudns": _3, "ip-dynamic": _3, "ddnss": _3, "dpdns": _3, "duckdns": _3, "tunk": _3, "blogdns": _3, "blogsite": _3, "boldlygoingnowhere": _3, "dnsalias": _3, "dnsdojo": _3, "doesntexist": _3, "dontexist": _3, "doomdns": _3, "dvrdns": _3, "dynalias": _3, "dyndns": [2, { "go": _3, "home": _3 }], "endofinternet": _3, "endoftheinternet": _3, "from-me": _3, "game-host": _3, "gotdns": _3, "hobby-site": _3, "homedns": _3, "homeftp": _3, "homelinux": _3, "homeunix": _3, "is-a-bruinsfan": _3, "is-a-candidate": _3, "is-a-celticsfan": _3, "is-a-chef": _3, "is-a-geek": _3, "is-a-knight": _3, "is-a-linux-user": _3, "is-a-patsfan": _3, "is-a-soxfan": _3, "is-found": _3, "is-lost": _3, "is-saved": _3, "is-very-bad": _3, "is-very-evil": _3, "is-very-good": _3, "is-very-nice": _3, "is-very-sweet": _3, "isa-geek": _3, "kicks-ass": _3, "misconfused": _3, "podzone": _3, "readmyblog": _3, "selfip": _3, "sellsyourhome": _3, "servebbs": _3, "serveftp": _3, "servegame": _3, "stuff-4-sale": _3, "webhop": _3, "accesscam": _3, "camdvr": _3, "freeddns": _3, "mywire": _3, "webredirect": _3, "twmail": _3, "eu": [2, { "al": _3, "asso": _3, "at": _3, "au": _3, "be": _3, "bg": _3, "ca": _3, "cd": _3, "ch": _3, "cn": _3, "cy": _3, "cz": _3, "de": _3, "dk": _3, "edu": _3, "ee": _3, "es": _3, "fi": _3, "fr": _3, "gr": _3, "hr": _3, "hu": _3, "ie": _3, "il": _3, "in": _3, "int": _3, "is": _3, "it": _3, "jp": _3, "kr": _3, "lt": _3, "lu": _3, "lv": _3, "me": _3, "mk": _3, "mt": _3, "my": _3, "net": _3, "ng": _3, "nl": _3, "no": _3, "nz": _3, "pl": _3, "pt": _3, "ro": _3, "ru": _3, "se": _3, "si": _3, "sk": _3, "tr": _3, "uk": _3, "us": _3 }], "fedorainfracloud": _3, "fedorapeople": _3, "fedoraproject": [0, { "cloud": _3, "os": _45, "stg": [0, { "os": _45 }] }], "freedesktop": _3, "hatenadiary": _3, "hepforge": _3, "in-dsl": _3, "in-vpn": _3, "js": _3, "barsy": _3, "mayfirst": _3, "routingthecloud": _3, "bmoattachments": _3, "cable-modem": _3, "collegefan": _3, "couchpotatofries": _3, "hopto": _3, "mlbfan": _3, "myftp": _3, "mysecuritycamera": _3, "nflfan": _3, "no-ip": _3, "read-books": _3, "ufcfan": _3, "zapto": _3, "dynserv": _3, "now-dns": _3, "is-local": _3, "httpbin": _3, "pubtls": _3, "jpn": _3, "my-firewall": _3, "myfirewall": _3, "spdns": _3, "small-web": _3, "dsmynas": _3, "familyds": _3, "teckids": _58, "tuxfamily": _3, "diskstation": _3, "hk": _3, "us": _3, "toolforge": _3, "wmcloud": [2, { "beta": _3 }], "wmflabs": _3, "za": _3 }], "pa": [1, { "abo": _2, "ac": _2, "com": _2, "edu": _2, "gob": _2, "ing": _2, "med": _2, "net": _2, "nom": _2, "org": _2, "sld": _2 }], "pe": [1, { "com": _2, "edu": _2, "gob": _2, "mil": _2, "net": _2, "nom": _2, "org": _2 }], "pf": [1, { "com": _2, "edu": _2, "org": _2 }], "pg": _20, "ph": [1, { "com": _2, "edu": _2, "gov": _2, "i": _2, "mil": _2, "net": _2, "ngo": _2, "org": _2, "cloudns": _3 }], "pk": [1, { "ac": _2, "biz": _2, "com": _2, "edu": _2, "fam": _2, "gkp": _2, "gob": _2, "gog": _2, "gok": _2, "gop": _2, "gos": _2, "gov": _2, "net": _2, "org": _2, "web": _2 }], "pl": [1, { "com": _2, "net": _2, "org": _2, "agro": _2, "aid": _2, "atm": _2, "auto": _2, "biz": _2, "edu": _2, "gmina": _2, "gsm": _2, "info": _2, "mail": _2, "media": _2, "miasta": _2, "mil": _2, "nieruchomosci": _2, "nom": _2, "pc": _2, "powiat": _2, "priv": _2, "realestate": _2, "rel": _2, "sex": _2, "shop": _2, "sklep": _2, "sos": _2, "szkola": _2, "targi": _2, "tm": _2, "tourism": _2, "travel": _2, "turystyka": _2, "gov": [1, { "ap": _2, "griw": _2, "ic": _2, "is": _2, "kmpsp": _2, "konsulat": _2, "kppsp": _2, "kwp": _2, "kwpsp": _2, "mup": _2, "mw": _2, "oia": _2, "oirm": _2, "oke": _2, "oow": _2, "oschr": _2, "oum": _2, "pa": _2, "pinb": _2, "piw": _2, "po": _2, "pr": _2, "psp": _2, "psse": _2, "pup": _2, "rzgw": _2, "sa": _2, "sdn": _2, "sko": _2, "so": _2, "sr": _2, "starostwo": _2, "ug": _2, "ugim": _2, "um": _2, "umig": _2, "upow": _2, "uppo": _2, "us": _2, "uw": _2, "uzs": _2, "wif": _2, "wiih": _2, "winb": _2, "wios": _2, "witd": _2, "wiw": _2, "wkz": _2, "wsa": _2, "wskr": _2, "wsse": _2, "wuoz": _2, "wzmiuw": _2, "zp": _2, "zpisdn": _2 }], "augustow": _2, "babia-gora": _2, "bedzin": _2, "beskidy": _2, "bialowieza": _2, "bialystok": _2, "bielawa": _2, "bieszczady": _2, "boleslawiec": _2, "bydgoszcz": _2, "bytom": _2, "cieszyn": _2, "czeladz": _2, "czest": _2, "dlugoleka": _2, "elblag": _2, "elk": _2, "glogow": _2, "gniezno": _2, "gorlice": _2, "grajewo": _2, "ilawa": _2, "jaworzno": _2, "jelenia-gora": _2, "jgora": _2, "kalisz": _2, "karpacz": _2, "kartuzy": _2, "kaszuby": _2, "katowice": _2, "kazimierz-dolny": _2, "kepno": _2, "ketrzyn": _2, "klodzko": _2, "kobierzyce": _2, "kolobrzeg": _2, "konin": _2, "konskowola": _2, "kutno": _2, "lapy": _2, "lebork": _2, "legnica": _2, "lezajsk": _2, "limanowa": _2, "lomza": _2, "lowicz": _2, "lubin": _2, "lukow": _2, "malbork": _2, "malopolska": _2, "mazowsze": _2, "mazury": _2, "mielec": _2, "mielno": _2, "mragowo": _2, "naklo": _2, "nowaruda": _2, "nysa": _2, "olawa": _2, "olecko": _2, "olkusz": _2, "olsztyn": _2, "opoczno": _2, "opole": _2, "ostroda": _2, "ostroleka": _2, "ostrowiec": _2, "ostrowwlkp": _2, "pila": _2, "pisz": _2, "podhale": _2, "podlasie": _2, "polkowice": _2, "pomorskie": _2, "pomorze": _2, "prochowice": _2, "pruszkow": _2, "przeworsk": _2, "pulawy": _2, "radom": _2, "rawa-maz": _2, "rybnik": _2, "rzeszow": _2, "sanok": _2, "sejny": _2, "skoczow": _2, "slask": _2, "slupsk": _2, "sosnowiec": _2, "stalowa-wola": _2, "starachowice": _2, "stargard": _2, "suwalki": _2, "swidnica": _2, "swiebodzin": _2, "swinoujscie": _2, "szczecin": _2, "szczytno": _2, "tarnobrzeg": _2, "tgory": _2, "turek": _2, "tychy": _2, "ustka": _2, "walbrzych": _2, "warmia": _2, "warszawa": _2, "waw": _2, "wegrow": _2, "wielun": _2, "wlocl": _2, "wloclawek": _2, "wodzislaw": _2, "wolomin": _2, "wroclaw": _2, "zachpomor": _2, "zagan": _2, "zarow": _2, "zgora": _2, "zgorzelec": _2, "art": _3, "gliwice": _3, "krakow": _3, "poznan": _3, "wroc": _3, "zakopane": _3, "beep": _3, "ecommerce-shop": _3, "cfolks": _3, "dfirma": _3, "dkonto": _3, "you2": _3, "shoparena": _3, "homesklep": _3, "sdscloud": _3, "unicloud": _3, "lodz": _3, "pabianice": _3, "plock": _3, "sieradz": _3, "skierniewice": _3, "zgierz": _3, "krasnik": _3, "leczna": _3, "lubartow": _3, "lublin": _3, "poniatowa": _3, "swidnik": _3, "co": _3, "torun": _3, "simplesite": _3, "myspreadshop": _3, "gda": _3, "gdansk": _3, "gdynia": _3, "med": _3, "sopot": _3, "bielsko": _3 }], "pm": [1, { "own": _3, "name": _3 }], "pn": [1, { "co": _2, "edu": _2, "gov": _2, "net": _2, "org": _2 }], "post": _2, "pr": [1, { "biz": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "isla": _2, "name": _2, "net": _2, "org": _2, "pro": _2, "ac": _2, "est": _2, "prof": _2 }], "pro": [1, { "aaa": _2, "aca": _2, "acct": _2, "avocat": _2, "bar": _2, "cpa": _2, "eng": _2, "jur": _2, "law": _2, "med": _2, "recht": _2, "12chars": _3, "cloudns": _3, "barsy": _3, "ngrok": _3 }], "ps": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "plo": _2, "sec": _2 }], "pt": [1, { "com": _2, "edu": _2, "gov": _2, "int": _2, "net": _2, "nome": _2, "org": _2, "publ": _2, "123paginaweb": _3 }], "pw": [1, { "gov": _2, "cloudns": _3, "x443": _3 }], "py": [1, { "com": _2, "coop": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 }], "qa": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "sch": _2 }], "re": [1, { "asso": _2, "com": _2, "netlib": _3, "can": _3 }], "ro": [1, { "arts": _2, "com": _2, "firm": _2, "info": _2, "nom": _2, "nt": _2, "org": _2, "rec": _2, "store": _2, "tm": _2, "www": _2, "co": _3, "shop": _3, "barsy": _3 }], "rs": [1, { "ac": _2, "co": _2, "edu": _2, "gov": _2, "in": _2, "org": _2, "brendly": _19, "barsy": _3, "ox": _3 }], "ru": [1, { "ac": _3, "edu": _3, "gov": _3, "int": _3, "mil": _3, "eurodir": _3, "adygeya": _3, "bashkiria": _3, "bir": _3, "cbg": _3, "com": _3, "dagestan": _3, "grozny": _3, "kalmykia": _3, "kustanai": _3, "marine": _3, "mordovia": _3, "msk": _3, "mytis": _3, "nalchik": _3, "nov": _3, "pyatigorsk": _3, "spb": _3, "vladikavkaz": _3, "vladimir": _3, "na4u": _3, "mircloud": _3, "myjino": [2, { "hosting": _6, "landing": _6, "spectrum": _6, "vps": _6 }], "cldmail": [0, { "hb": _3 }], "mcdir": [2, { "vps": _3 }], "mcpre": _3, "net": _3, "org": _3, "pp": _3, "lk3": _3, "ras": _3 }], "rw": [1, { "ac": _2, "co": _2, "coop": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 }], "sa": [1, { "com": _2, "edu": _2, "gov": _2, "med": _2, "net": _2, "org": _2, "pub": _2, "sch": _2 }], "sb": _4, "sc": _4, "sd": [1, { "com": _2, "edu": _2, "gov": _2, "info": _2, "med": _2, "net": _2, "org": _2, "tv": _2 }], "se": [1, { "a": _2, "ac": _2, "b": _2, "bd": _2, "brand": _2, "c": _2, "d": _2, "e": _2, "f": _2, "fh": _2, "fhsk": _2, "fhv": _2, "g": _2, "h": _2, "i": _2, "k": _2, "komforb": _2, "kommunalforbund": _2, "komvux": _2, "l": _2, "lanbib": _2, "m": _2, "n": _2, "naturbruksgymn": _2, "o": _2, "org": _2, "p": _2, "parti": _2, "pp": _2, "press": _2, "r": _2, "s": _2, "t": _2, "tm": _2, "u": _2, "w": _2, "x": _2, "y": _2, "z": _2, "com": _3, "iopsys": _3, "123minsida": _3, "itcouldbewor": _3, "myspreadshop": _3 }], "sg": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "enscaled": _3 }], "sh": [1, { "com": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "hashbang": _3, "botda": _3, "lovable": _3, "platform": [0, { "ent": _3, "eu": _3, "us": _3 }], "teleport": _3, "now": _3 }], "si": [1, { "f5": _3, "gitapp": _3, "gitpage": _3 }], "sj": _2, "sk": _2, "sl": _4, "sm": _2, "sn": [1, { "art": _2, "com": _2, "edu": _2, "gouv": _2, "org": _2, "perso": _2, "univ": _2 }], "so": [1, { "com": _2, "edu": _2, "gov": _2, "me": _2, "net": _2, "org": _2, "surveys": _3 }], "sr": _2, "ss": [1, { "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "me": _2, "net": _2, "org": _2, "sch": _2 }], "st": [1, { "co": _2, "com": _2, "consulado": _2, "edu": _2, "embaixada": _2, "mil": _2, "net": _2, "org": _2, "principe": _2, "saotome": _2, "store": _2, "helioho": _3, "kirara": _3, "noho": _3 }], "su": [1, { "abkhazia": _3, "adygeya": _3, "aktyubinsk": _3, "arkhangelsk": _3, "armenia": _3, "ashgabad": _3, "azerbaijan": _3, "balashov": _3, "bashkiria": _3, "bryansk": _3, "bukhara": _3, "chimkent": _3, "dagestan": _3, "east-kazakhstan": _3, "exnet": _3, "georgia": _3, "grozny": _3, "ivanovo": _3, "jambyl": _3, "kalmykia": _3, "kaluga": _3, "karacol": _3, "karaganda": _3, "karelia": _3, "khakassia": _3, "krasnodar": _3, "kurgan": _3, "kustanai": _3, "lenug": _3, "mangyshlak": _3, "mordovia": _3, "msk": _3, "murmansk": _3, "nalchik": _3, "navoi": _3, "north-kazakhstan": _3, "nov": _3, "obninsk": _3, "penza": _3, "pokrovsk": _3, "sochi": _3, "spb": _3, "tashkent": _3, "termez": _3, "togliatti": _3, "troitsk": _3, "tselinograd": _3, "tula": _3, "tuva": _3, "vladikavkaz": _3, "vladimir": _3, "vologda": _3 }], "sv": [1, { "com": _2, "edu": _2, "gob": _2, "org": _2, "red": _2 }], "sx": _10, "sy": _5, "sz": [1, { "ac": _2, "co": _2, "org": _2 }], "tc": _2, "td": _2, "tel": _2, "tf": [1, { "sch": _3 }], "tg": _2, "th": [1, { "ac": _2, "co": _2, "go": _2, "in": _2, "mi": _2, "net": _2, "or": _2, "online": _3, "shop": _3 }], "tj": [1, { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "go": _2, "gov": _2, "int": _2, "mil": _2, "name": _2, "net": _2, "nic": _2, "org": _2, "test": _2, "web": _2 }], "tk": _2, "tl": _10, "tm": [1, { "co": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "nom": _2, "org": _2 }], "tn": [1, { "com": _2, "ens": _2, "fin": _2, "gov": _2, "ind": _2, "info": _2, "intl": _2, "mincom": _2, "nat": _2, "net": _2, "org": _2, "perso": _2, "tourism": _2, "orangecloud": _3 }], "to": [1, { "611": _3, "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "oya": _3, "x0": _3, "quickconnect": _27, "vpnplus": _3 }], "tr": [1, { "av": _2, "bbs": _2, "bel": _2, "biz": _2, "com": _2, "dr": _2, "edu": _2, "gen": _2, "gov": _2, "info": _2, "k12": _2, "kep": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "pol": _2, "tel": _2, "tsk": _2, "tv": _2, "web": _2, "nc": _10 }], "tt": [1, { "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "pro": _2 }], "tv": [1, { "better-than": _3, "dyndns": _3, "on-the-web": _3, "worse-than": _3, "from": _3, "sakura": _3 }], "tw": [1, { "club": _2, "com": [1, { "mymailer": _3 }], "ebiz": _2, "edu": _2, "game": _2, "gov": _2, "idv": _2, "mil": _2, "net": _2, "org": _2, "url": _3, "mydns": _3 }], "tz": [1, { "ac": _2, "co": _2, "go": _2, "hotel": _2, "info": _2, "me": _2, "mil": _2, "mobi": _2, "ne": _2, "or": _2, "sc": _2, "tv": _2 }], "ua": [1, { "com": _2, "edu": _2, "gov": _2, "in": _2, "net": _2, "org": _2, "cherkassy": _2, "cherkasy": _2, "chernigov": _2, "chernihiv": _2, "chernivtsi": _2, "chernovtsy": _2, "ck": _2, "cn": _2, "cr": _2, "crimea": _2, "cv": _2, "dn": _2, "dnepropetrovsk": _2, "dnipropetrovsk": _2, "donetsk": _2, "dp": _2, "if": _2, "ivano-frankivsk": _2, "kh": _2, "kharkiv": _2, "kharkov": _2, "kherson": _2, "khmelnitskiy": _2, "khmelnytskyi": _2, "kiev": _2, "kirovograd": _2, "km": _2, "kr": _2, "kropyvnytskyi": _2, "krym": _2, "ks": _2, "kv": _2, "kyiv": _2, "lg": _2, "lt": _2, "lugansk": _2, "luhansk": _2, "lutsk": _2, "lv": _2, "lviv": _2, "mk": _2, "mykolaiv": _2, "nikolaev": _2, "od": _2, "odesa": _2, "odessa": _2, "pl": _2, "poltava": _2, "rivne": _2, "rovno": _2, "rv": _2, "sb": _2, "sebastopol": _2, "sevastopol": _2, "sm": _2, "sumy": _2, "te": _2, "ternopil": _2, "uz": _2, "uzhgorod": _2, "uzhhorod": _2, "vinnica": _2, "vinnytsia": _2, "vn": _2, "volyn": _2, "yalta": _2, "zakarpattia": _2, "zaporizhzhe": _2, "zaporizhzhia": _2, "zhitomir": _2, "zhytomyr": _2, "zp": _2, "zt": _2, "cc": _3, "inf": _3, "ltd": _3, "cx": _3, "biz": _3, "co": _3, "pp": _3, "v": _3 }], "ug": [1, { "ac": _2, "co": _2, "com": _2, "edu": _2, "go": _2, "gov": _2, "mil": _2, "ne": _2, "or": _2, "org": _2, "sc": _2, "us": _2 }], "uk": [1, { "ac": _2, "co": [1, { "bytemark": [0, { "dh": _3, "vm": _3 }], "layershift": _48, "barsy": _3, "barsyonline": _3, "retrosnub": _57, "nh-serv": _3, "no-ip": _3, "adimo": _3, "myspreadshop": _3 }], "gov": [1, { "api": _3, "campaign": _3, "service": _3 }], "ltd": _2, "me": _2, "net": _2, "nhs": _2, "org": [1, { "glug": _3, "lug": _3, "lugs": _3, "affinitylottery": _3, "raffleentry": _3, "weeklylottery": _3 }], "plc": _2, "police": _2, "sch": _20, "conn": _3, "copro": _3, "hosp": _3, "independent-commission": _3, "independent-inquest": _3, "independent-inquiry": _3, "independent-panel": _3, "independent-review": _3, "public-inquiry": _3, "royal-commission": _3, "pymnt": _3, "barsy": _3, "nimsite": _3, "oraclegovcloudapps": _6 }], "us": [1, { "dni": _2, "isa": _2, "nsn": _2, "ak": _65, "al": _65, "ar": _65, "as": _65, "az": _65, "ca": _65, "co": _65, "ct": _65, "dc": _65, "de": _66, "fl": _65, "ga": _65, "gu": _65, "hi": _67, "ia": _65, "id": _65, "il": _65, "in": _65, "ks": _65, "ky": _65, "la": _65, "ma": [1, { "k12": [1, { "chtr": _2, "paroch": _2, "pvt": _2 }], "cc": _2, "lib": _2 }], "md": _65, "me": _65, "mi": [1, { "k12": _2, "cc": _2, "lib": _2, "ann-arbor": _2, "cog": _2, "dst": _2, "eaton": _2, "gen": _2, "mus": _2, "tec": _2, "washtenaw": _2 }], "mn": _65, "mo": _65, "ms": [1, { "k12": _2, "cc": _2 }], "mt": _65, "nc": _65, "nd": _67, "ne": _65, "nh": _65, "nj": _65, "nm": _65, "nv": _65, "ny": _65, "oh": _65, "ok": _65, "or": _65, "pa": _65, "pr": _65, "ri": _67, "sc": _65, "sd": _67, "tn": _65, "tx": _65, "ut": _65, "va": _65, "vi": _65, "vt": _65, "wa": _65, "wi": _65, "wv": _66, "wy": _65, "cloudns": _3, "is-by": _3, "land-4-sale": _3, "stuff-4-sale": _3, "heliohost": _3, "enscaled": [0, { "phx": _3 }], "mircloud": _3, "ngo": _3, "golffan": _3, "noip": _3, "pointto": _3, "freeddns": _3, "srv": [2, { "gh": _3, "gl": _3 }], "platterp": _3, "servername": _3 }], "uy": [1, { "com": _2, "edu": _2, "gub": _2, "mil": _2, "net": _2, "org": _2 }], "uz": [1, { "co": _2, "com": _2, "net": _2, "org": _2 }], "va": _2, "vc": [1, { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "gv": [2, { "d": _3 }], "0e": _6, "mydns": _3 }], "ve": [1, { "arts": _2, "bib": _2, "co": _2, "com": _2, "e12": _2, "edu": _2, "emprende": _2, "firm": _2, "gob": _2, "gov": _2, "ia": _2, "info": _2, "int": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "rar": _2, "rec": _2, "store": _2, "tec": _2, "web": _2 }], "vg": [1, { "edu": _2 }], "vi": [1, { "co": _2, "com": _2, "k12": _2, "net": _2, "org": _2 }], "vn": [1, { "ac": _2, "ai": _2, "biz": _2, "com": _2, "edu": _2, "gov": _2, "health": _2, "id": _2, "info": _2, "int": _2, "io": _2, "name": _2, "net": _2, "org": _2, "pro": _2, "angiang": _2, "bacgiang": _2, "backan": _2, "baclieu": _2, "bacninh": _2, "baria-vungtau": _2, "bentre": _2, "binhdinh": _2, "binhduong": _2, "binhphuoc": _2, "binhthuan": _2, "camau": _2, "cantho": _2, "caobang": _2, "daklak": _2, "daknong": _2, "danang": _2, "dienbien": _2, "dongnai": _2, "dongthap": _2, "gialai": _2, "hagiang": _2, "haiduong": _2, "haiphong": _2, "hanam": _2, "hanoi": _2, "hatinh": _2, "haugiang": _2, "hoabinh": _2, "hungyen": _2, "khanhhoa": _2, "kiengiang": _2, "kontum": _2, "laichau": _2, "lamdong": _2, "langson": _2, "laocai": _2, "longan": _2, "namdinh": _2, "nghean": _2, "ninhbinh": _2, "ninhthuan": _2, "phutho": _2, "phuyen": _2, "quangbinh": _2, "quangnam": _2, "quangngai": _2, "quangninh": _2, "quangtri": _2, "soctrang": _2, "sonla": _2, "tayninh": _2, "thaibinh": _2, "thainguyen": _2, "thanhhoa": _2, "thanhphohochiminh": _2, "thuathienhue": _2, "tiengiang": _2, "travinh": _2, "tuyenquang": _2, "vinhlong": _2, "vinhphuc": _2, "yenbai": _2 }], "vu": _47, "wf": [1, { "biz": _3, "sch": _3 }], "ws": [1, { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "advisor": _6, "cloud66": _3, "dyndns": _3, "mypets": _3 }], "yt": [1, { "org": _3 }], "xn--mgbaam7a8h": _2, "امارات": _2, "xn--y9a3aq": _2, "հայ": _2, "xn--54b7fta0cc": _2, "বাংলা": _2, "xn--90ae": _2, "бг": _2, "xn--mgbcpq6gpa1a": _2, "البحرين": _2, "xn--90ais": _2, "бел": _2, "xn--fiqs8s": _2, "中国": _2, "xn--fiqz9s": _2, "中國": _2, "xn--lgbbat1ad8j": _2, "الجزائر": _2, "xn--wgbh1c": _2, "مصر": _2, "xn--e1a4c": _2, "ею": _2, "xn--qxa6a": _2, "ευ": _2, "xn--mgbah1a3hjkrd": _2, "موريتانيا": _2, "xn--node": _2, "გე": _2, "xn--qxam": _2, "ελ": _2, "xn--j6w193g": [1, { "xn--gmqw5a": _2, "xn--55qx5d": _2, "xn--mxtq1m": _2, "xn--wcvs22d": _2, "xn--uc0atv": _2, "xn--od0alg": _2 }], "香港": [1, { "個人": _2, "公司": _2, "政府": _2, "教育": _2, "組織": _2, "網絡": _2 }], "xn--2scrj9c": _2, "ಭಾರತ": _2, "xn--3hcrj9c": _2, "ଭାରତ": _2, "xn--45br5cyl": _2, "ভাৰত": _2, "xn--h2breg3eve": _2, "भारतम्": _2, "xn--h2brj9c8c": _2, "भारोत": _2, "xn--mgbgu82a": _2, "ڀارت": _2, "xn--rvc1e0am3e": _2, "ഭാരതം": _2, "xn--h2brj9c": _2, "भारत": _2, "xn--mgbbh1a": _2, "بارت": _2, "xn--mgbbh1a71e": _2, "بھارت": _2, "xn--fpcrj9c3d": _2, "భారత్": _2, "xn--gecrj9c": _2, "ભારત": _2, "xn--s9brj9c": _2, "ਭਾਰਤ": _2, "xn--45brj9c": _2, "ভারত": _2, "xn--xkc2dl3a5ee0h": _2, "இந்தியா": _2, "xn--mgba3a4f16a": _2, "ایران": _2, "xn--mgba3a4fra": _2, "ايران": _2, "xn--mgbtx2b": _2, "عراق": _2, "xn--mgbayh7gpa": _2, "الاردن": _2, "xn--3e0b707e": _2, "한국": _2, "xn--80ao21a": _2, "қаз": _2, "xn--q7ce6a": _2, "ລາວ": _2, "xn--fzc2c9e2c": _2, "ලංකා": _2, "xn--xkc2al3hye2a": _2, "இலங்கை": _2, "xn--mgbc0a9azcg": _2, "المغرب": _2, "xn--d1alf": _2, "мкд": _2, "xn--l1acc": _2, "мон": _2, "xn--mix891f": _2, "澳門": _2, "xn--mix082f": _2, "澳门": _2, "xn--mgbx4cd0ab": _2, "مليسيا": _2, "xn--mgb9awbf": _2, "عمان": _2, "xn--mgbai9azgqp6j": _2, "پاکستان": _2, "xn--mgbai9a5eva00b": _2, "پاكستان": _2, "xn--ygbi2ammx": _2, "فلسطين": _2, "xn--90a3ac": [1, { "xn--80au": _2, "xn--90azh": _2, "xn--d1at": _2, "xn--c1avg": _2, "xn--o1ac": _2, "xn--o1ach": _2 }], "срб": [1, { "ак": _2, "обр": _2, "од": _2, "орг": _2, "пр": _2, "упр": _2 }], "xn--p1ai": _2, "рф": _2, "xn--wgbl6a": _2, "قطر": _2, "xn--mgberp4a5d4ar": _2, "السعودية": _2, "xn--mgberp4a5d4a87g": _2, "السعودیة": _2, "xn--mgbqly7c0a67fbc": _2, "السعودیۃ": _2, "xn--mgbqly7cvafr": _2, "السعوديه": _2, "xn--mgbpl2fh": _2, "سودان": _2, "xn--yfro4i67o": _2, "新加坡": _2, "xn--clchc0ea0b2g2a9gcd": _2, "சிங்கப்பூர்": _2, "xn--ogbpf8fl": _2, "سورية": _2, "xn--mgbtf8fl": _2, "سوريا": _2, "xn--o3cw4h": [1, { "xn--o3cyx2a": _2, "xn--12co0c3b4eva": _2, "xn--m3ch0j3a": _2, "xn--h3cuzk1di": _2, "xn--12c1fe0br": _2, "xn--12cfi8ixb8l": _2 }], "ไทย": [1, { "ทหาร": _2, "ธุรกิจ": _2, "เน็ต": _2, "รัฐบาล": _2, "ศึกษา": _2, "องค์กร": _2 }], "xn--pgbs0dh": _2, "تونس": _2, "xn--kpry57d": _2, "台灣": _2, "xn--kprw13d": _2, "台湾": _2, "xn--nnx388a": _2, "臺灣": _2, "xn--j1amh": _2, "укр": _2, "xn--mgb2ddes": _2, "اليمن": _2, "xxx": _2, "ye": _5, "za": [0, { "ac": _2, "agric": _2, "alt": _2, "co": _2, "edu": _2, "gov": _2, "grondar": _2, "law": _2, "mil": _2, "net": _2, "ngo": _2, "nic": _2, "nis": _2, "nom": _2, "org": _2, "school": _2, "tm": _2, "web": _2 }], "zm": [1, { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "mil": _2, "net": _2, "org": _2, "sch": _2 }], "zw": [1, { "ac": _2, "co": _2, "gov": _2, "mil": _2, "org": _2 }], "aaa": _2, "aarp": _2, "abb": _2, "abbott": _2, "abbvie": _2, "abc": _2, "able": _2, "abogado": _2, "abudhabi": _2, "academy": [1, { "official": _3 }], "accenture": _2, "accountant": _2, "accountants": _2, "aco": _2, "actor": _2, "ads": _2, "adult": _2, "aeg": _2, "aetna": _2, "afl": _2, "africa": _2, "agakhan": _2, "agency": _2, "aig": _2, "airbus": _2, "airforce": _2, "airtel": _2, "akdn": _2, "alibaba": _2, "alipay": _2, "allfinanz": _2, "allstate": _2, "ally": _2, "alsace": _2, "alstom": _2, "amazon": _2, "americanexpress": _2, "americanfamily": _2, "amex": _2, "amfam": _2, "amica": _2, "amsterdam": _2, "analytics": _2, "android": _2, "anquan": _2, "anz": _2, "aol": _2, "apartments": _2, "app": [1, { "adaptable": _3, "aiven": _3, "beget": _6, "brave": _7, "clerk": _3, "clerkstage": _3, "cloudflare": _3, "wnext": _3, "csb": [2, { "preview": _3 }], "convex": _3, "deta": _3, "ondigitalocean": _3, "easypanel": _3, "encr": [2, { "frontend": _3 }], "evervault": _8, "expo": [2, { "staging": _3 }], "edgecompute": _3, "on-fleek": _3, "flutterflow": _3, "e2b": _3, "framer": _3, "github": _3, "hosted": _6, "run": [0, { "*": _3, "mtls": _6 }], "web": _3, "hackclub": _3, "hasura": _3, "botdash": _3, "leapcell": _3, "loginline": _3, "lovable": _3, "luyani": _3, "medusajs": _3, "messerli": _3, "mocha": _3, "netlify": _3, "ngrok": _3, "ngrok-free": _3, "developer": _6, "noop": _3, "northflank": _6, "upsun": _6, "railway": [0, { "up": _3 }], "replit": _9, "nyat": _3, "snowflake": [0, { "*": _3, "privatelink": _6 }], "streamlit": _3, "storipress": _3, "telebit": _3, "typedream": _3, "vercel": _3, "wal": _3, "wasmer": _3, "bookonline": _3, "windsurf": _3, "zeabur": _3, "zerops": _6 }], "apple": _2, "aquarelle": _2, "arab": _2, "aramco": _2, "archi": _2, "army": _2, "art": _2, "arte": _2, "asda": _2, "associates": _2, "athleta": _2, "attorney": _2, "auction": _2, "audi": _2, "audible": _2, "audio": _2, "auspost": _2, "author": _2, "auto": _2, "autos": _2, "aws": [1, { "on": [0, { "af-south-1": _11, "ap-east-1": _11, "ap-northeast-1": _11, "ap-northeast-2": _11, "ap-northeast-3": _11, "ap-south-1": _11, "ap-south-2": _12, "ap-southeast-1": _11, "ap-southeast-2": _11, "ap-southeast-3": _11, "ap-southeast-4": _12, "ap-southeast-5": _12, "ca-central-1": _11, "ca-west-1": _12, "eu-central-1": _11, "eu-central-2": _12, "eu-north-1": _11, "eu-south-1": _11, "eu-south-2": _12, "eu-west-1": _11, "eu-west-2": _11, "eu-west-3": _11, "il-central-1": _12, "me-central-1": _12, "me-south-1": _11, "sa-east-1": _11, "us-east-1": _11, "us-east-2": _11, "us-west-1": _11, "us-west-2": _11, "us-gov-east-1": _13, "us-gov-west-1": _13 }], "sagemaker": [0, { "ap-northeast-1": _15, "ap-northeast-2": _15, "ap-south-1": _15, "ap-southeast-1": _15, "ap-southeast-2": _15, "ca-central-1": _17, "eu-central-1": _15, "eu-west-1": _15, "eu-west-2": _15, "us-east-1": _17, "us-east-2": _17, "us-west-2": _17, "af-south-1": _14, "ap-east-1": _14, "ap-northeast-3": _14, "ap-south-2": _16, "ap-southeast-3": _14, "ap-southeast-4": _16, "ca-west-1": [0, { "notebook": _3, "notebook-fips": _3 }], "eu-central-2": _14, "eu-north-1": _14, "eu-south-1": _14, "eu-south-2": _14, "eu-west-3": _14, "il-central-1": _14, "me-central-1": _14, "me-south-1": _14, "sa-east-1": _14, "us-gov-east-1": _18, "us-gov-west-1": _18, "us-west-1": [0, { "notebook": _3, "notebook-fips": _3, "studio": _3 }], "experiments": _6 }], "repost": [0, { "private": _6 }] }], "axa": _2, "azure": _2, "baby": _2, "baidu": _2, "banamex": _2, "band": _2, "bank": _2, "bar": _2, "barcelona": _2, "barclaycard": _2, "barclays": _2, "barefoot": _2, "bargains": _2, "baseball": _2, "basketball": [1, { "aus": _3, "nz": _3 }], "bauhaus": _2, "bayern": _2, "bbc": _2, "bbt": _2, "bbva": _2, "bcg": _2, "bcn": _2, "beats": _2, "beauty": _2, "beer": _2, "berlin": _2, "best": _2, "bestbuy": _2, "bet": _2, "bharti": _2, "bible": _2, "bid": _2, "bike": _2, "bing": _2, "bingo": _2, "bio": _2, "black": _2, "blackfriday": _2, "blockbuster": _2, "blog": _2, "bloomberg": _2, "blue": _2, "bms": _2, "bmw": _2, "bnpparibas": _2, "boats": _2, "boehringer": _2, "bofa": _2, "bom": _2, "bond": _2, "boo": _2, "book": _2, "booking": _2, "bosch": _2, "bostik": _2, "boston": _2, "bot": _2, "boutique": _2, "box": _2, "bradesco": _2, "bridgestone": _2, "broadway": _2, "broker": _2, "brother": _2, "brussels": _2, "build": [1, { "v0": _3, "windsurf": _3 }], "builders": [1, { "cloudsite": _3 }], "business": _21, "buy": _2, "buzz": _2, "bzh": _2, "cab": _2, "cafe": _2, "cal": _2, "call": _2, "calvinklein": _2, "cam": _2, "camera": _2, "camp": [1, { "emf": [0, { "at": _3 }] }], "canon": _2, "capetown": _2, "capital": _2, "capitalone": _2, "car": _2, "caravan": _2, "cards": _2, "care": _2, "career": _2, "careers": _2, "cars": _2, "casa": [1, { "nabu": [0, { "ui": _3 }] }], "case": _2, "cash": _2, "casino": _2, "catering": _2, "catholic": _2, "cba": _2, "cbn": _2, "cbre": _2, "center": _2, "ceo": _2, "cern": _2, "cfa": _2, "cfd": _2, "chanel": _2, "channel": _2, "charity": _2, "chase": _2, "chat": _2, "cheap": _2, "chintai": _2, "christmas": _2, "chrome": _2, "church": _2, "cipriani": _2, "circle": _2, "cisco": _2, "citadel": _2, "citi": _2, "citic": _2, "city": _2, "claims": _2, "cleaning": _2, "click": _2, "clinic": _2, "clinique": _2, "clothing": _2, "cloud": [1, { "convex": _3, "elementor": _3, "emergent": _3, "encoway": [0, { "eu": _3 }], "statics": _6, "ravendb": _3, "axarnet": [0, { "es-1": _3 }], "diadem": _3, "jelastic": [0, { "vip": _3 }], "jele": _3, "jenv-aruba": [0, { "aruba": [0, { "eur": [0, { "it1": _3 }] }], "it1": _3 }], "keliweb": [2, { "cs": _3 }], "oxa": [2, { "tn": _3, "uk": _3 }], "primetel": [2, { "uk": _3 }], "reclaim": [0, { "ca": _3, "uk": _3, "us": _3 }], "trendhosting": [0, { "ch": _3, "de": _3 }], "jote": _3, "jotelulu": _3, "kuleuven": _3, "laravel": _3, "linkyard": _3, "magentosite": _6, "matlab": _3, "observablehq": _3, "perspecta": _3, "vapor": _3, "on-rancher": _6, "scw": [0, { "baremetal": [0, { "fr-par-1": _3, "fr-par-2": _3, "nl-ams-1": _3 }], "fr-par": [0, { "cockpit": _3, "ddl": _3, "dtwh": _3, "fnc": [2, { "functions": _3 }], "ifr": _3, "k8s": _23, "kafk": _3, "mgdb": _3, "rdb": _3, "s3": _3, "s3-website": _3, "scbl": _3, "whm": _3 }], "instances": [0, { "priv": _3, "pub": _3 }], "k8s": _3, "nl-ams": [0, { "cockpit": _3, "ddl": _3, "dtwh": _3, "ifr": _3, "k8s": _23, "kafk": _3, "mgdb": _3, "rdb": _3, "s3": _3, "s3-website": _3, "scbl": _3, "whm": _3 }], "pl-waw": [0, { "cockpit": _3, "ddl": _3, "dtwh": _3, "ifr": _3, "k8s": _23, "kafk": _3, "mgdb": _3, "rdb": _3, "s3": _3, "s3-website": _3, "scbl": _3 }], "scalebook": _3, "smartlabeling": _3 }], "servebolt": _3, "onstackit": [0, { "runs": _3 }], "trafficplex": _3, "unison-services": _3, "urown": _3, "voorloper": _3, "zap": _3 }], "club": [1, { "cloudns": _3, "jele": _3, "barsy": _3 }], "clubmed": _2, "coach": _2, "codes": [1, { "owo": _6 }], "coffee": _2, "college": _2, "cologne": _2, "commbank": _2, "community": [1, { "nog": _3, "ravendb": _3, "myforum": _3 }], "company": _2, "compare": _2, "computer": _2, "comsec": _2, "condos": _2, "construction": _2, "consulting": _2, "contact": _2, "contractors": _2, "cooking": _2, "cool": [1, { "elementor": _3, "de": _3 }], "corsica": _2, "country": _2, "coupon": _2, "coupons": _2, "courses": _2, "cpa": _2, "credit": _2, "creditcard": _2, "creditunion": _2, "cricket": _2, "crown": _2, "crs": _2, "cruise": _2, "cruises": _2, "cuisinella": _2, "cymru": _2, "cyou": _2, "dad": _2, "dance": _2, "data": _2, "date": _2, "dating": _2, "datsun": _2, "day": _2, "dclk": _2, "dds": _2, "deal": _2, "dealer": _2, "deals": _2, "degree": _2, "delivery": _2, "dell": _2, "deloitte": _2, "delta": _2, "democrat": _2, "dental": _2, "dentist": _2, "desi": _2, "design": [1, { "graphic": _3, "bss": _3 }], "dev": [1, { "12chars": _3, "myaddr": _3, "panel": _3, "bearblog": _3, "lcl": _6, "lclstage": _6, "stg": _6, "stgstage": _6, "pages": _3, "r2": _3, "workers": _3, "deno": _3, "deno-staging": _3, "deta": _3, "lp": [2, { "api": _3, "objects": _3 }], "evervault": _8, "fly": _3, "githubpreview": _3, "gateway": _6, "botdash": _3, "inbrowser": _6, "is-a-good": _3, "iserv": _3, "leapcell": _3, "runcontainers": _3, "localcert": [0, { "user": _6 }], "loginline": _3, "barsy": _3, "mediatech": _3, "mocha-sandbox": _3, "modx": _3, "ngrok": _3, "ngrok-free": _3, "is-a-fullstack": _3, "is-cool": _3, "is-not-a": _3, "localplayer": _3, "xmit": _3, "platter-app": _3, "replit": [2, { "archer": _3, "bones": _3, "canary": _3, "global": _3, "hacker": _3, "id": _3, "janeway": _3, "kim": _3, "kira": _3, "kirk": _3, "odo": _3, "paris": _3, "picard": _3, "pike": _3, "prerelease": _3, "reed": _3, "riker": _3, "sisko": _3, "spock": _3, "staging": _3, "sulu": _3, "tarpit": _3, "teams": _3, "tucker": _3, "wesley": _3, "worf": _3 }], "crm": [0, { "d": _6, "w": _6, "wa": _6, "wb": _6, "wc": _6, "wd": _6, "we": _6, "wf": _6 }], "erp": _50, "vercel": _3, "webhare": _6, "hrsn": _3, "is-a": _3 }], "dhl": _2, "diamonds": _2, "diet": _2, "digital": [1, { "cloudapps": [2, { "london": _3 }] }], "direct": [1, { "libp2p": _3 }], "directory": _2, "discount": _2, "discover": _2, "dish": _2, "diy": _2, "dnp": _2, "docs": _2, "doctor": _2, "dog": _2, "domains": _2, "dot": _2, "download": _2, "drive": _2, "dtv": _2, "dubai": _2, "dupont": _2, "durban": _2, "dvag": _2, "dvr": _2, "earth": _2, "eat": _2, "eco": _2, "edeka": _2, "education": _21, "email": [1, { "crisp": [0, { "on": _3 }], "tawk": _52, "tawkto": _52 }], "emerck": _2, "energy": _2, "engineer": _2, "engineering": _2, "enterprises": _2, "epson": _2, "equipment": _2, "ericsson": _2, "erni": _2, "esq": _2, "estate": [1, { "compute": _6 }], "eurovision": _2, "eus": [1, { "party": _53 }], "events": [1, { "koobin": _3, "co": _3 }], "exchange": _2, "expert": _2, "exposed": _2, "express": _2, "extraspace": _2, "fage": _2, "fail": _2, "fairwinds": _2, "faith": _2, "family": _2, "fan": _2, "fans": _2, "farm": [1, { "storj": _3 }], "farmers": _2, "fashion": _2, "fast": _2, "fedex": _2, "feedback": _2, "ferrari": _2, "ferrero": _2, "fidelity": _2, "fido": _2, "film": _2, "final": _2, "finance": _2, "financial": _21, "fire": _2, "firestone": _2, "firmdale": _2, "fish": _2, "fishing": _2, "fit": _2, "fitness": _2, "flickr": _2, "flights": _2, "flir": _2, "florist": _2, "flowers": _2, "fly": _2, "foo": _2, "food": _2, "football": _2, "ford": _2, "forex": _2, "forsale": _2, "forum": _2, "foundation": _2, "fox": _2, "free": _2, "fresenius": _2, "frl": _2, "frogans": _2, "frontier": _2, "ftr": _2, "fujitsu": _2, "fun": _2, "fund": _2, "furniture": _2, "futbol": _2, "fyi": _2, "gal": _2, "gallery": _2, "gallo": _2, "gallup": _2, "game": _2, "games": [1, { "pley": _3, "sheezy": _3 }], "gap": _2, "garden": _2, "gay": [1, { "pages": _3 }], "gbiz": _2, "gdn": [1, { "cnpy": _3 }], "gea": _2, "gent": _2, "genting": _2, "george": _2, "ggee": _2, "gift": _2, "gifts": _2, "gives": _2, "giving": _2, "glass": _2, "gle": _2, "global": [1, { "appwrite": _3 }], "globo": _2, "gmail": _2, "gmbh": _2, "gmo": _2, "gmx": _2, "godaddy": _2, "gold": _2, "goldpoint": _2, "golf": _2, "goo": _2, "goodyear": _2, "goog": [1, { "cloud": _3, "translate": _3, "usercontent": _6 }], "google": _2, "gop": _2, "got": _2, "grainger": _2, "graphics": _2, "gratis": _2, "green": _2, "gripe": _2, "grocery": _2, "group": [1, { "discourse": _3 }], "gucci": _2, "guge": _2, "guide": _2, "guitars": _2, "guru": _2, "hair": _2, "hamburg": _2, "hangout": _2, "haus": _2, "hbo": _2, "hdfc": _2, "hdfcbank": _2, "health": [1, { "hra": _3 }], "healthcare": _2, "help": _2, "helsinki": _2, "here": _2, "hermes": _2, "hiphop": _2, "hisamitsu": _2, "hitachi": _2, "hiv": _2, "hkt": _2, "hockey": _2, "holdings": _2, "holiday": _2, "homedepot": _2, "homegoods": _2, "homes": _2, "homesense": _2, "honda": _2, "horse": _2, "hospital": _2, "host": [1, { "cloudaccess": _3, "freesite": _3, "easypanel": _3, "emergent": _3, "fastvps": _3, "myfast": _3, "tempurl": _3, "wpmudev": _3, "iserv": _3, "jele": _3, "mircloud": _3, "bolt": _3, "wp2": _3, "half": _3 }], "hosting": [1, { "opencraft": _3 }], "hot": _2, "hotel": _2, "hotels": _2, "hotmail": _2, "house": _2, "how": _2, "hsbc": _2, "hughes": _2, "hyatt": _2, "hyundai": _2, "ibm": _2, "icbc": _2, "ice": _2, "icu": _2, "ieee": _2, "ifm": _2, "ikano": _2, "imamat": _2, "imdb": _2, "immo": _2, "immobilien": _2, "inc": _2, "industries": _2, "infiniti": _2, "ing": _2, "ink": _2, "institute": _2, "insurance": _2, "insure": _2, "international": _2, "intuit": _2, "investments": _2, "ipiranga": _2, "irish": _2, "ismaili": _2, "ist": _2, "istanbul": _2, "itau": _2, "itv": _2, "jaguar": _2, "java": _2, "jcb": _2, "jeep": _2, "jetzt": _2, "jewelry": _2, "jio": _2, "jll": _2, "jmp": _2, "jnj": _2, "joburg": _2, "jot": _2, "joy": _2, "jpmorgan": _2, "jprs": _2, "juegos": _2, "juniper": _2, "kaufen": _2, "kddi": _2, "kerryhotels": _2, "kerryproperties": _2, "kfh": _2, "kia": _2, "kids": _2, "kim": _2, "kindle": _2, "kitchen": _2, "kiwi": _2, "koeln": _2, "komatsu": _2, "kosher": _2, "kpmg": _2, "kpn": _2, "krd": [1, { "co": _3, "edu": _3 }], "kred": _2, "kuokgroup": _2, "kyoto": _2, "lacaixa": _2, "lamborghini": _2, "lamer": _2, "land": _2, "landrover": _2, "lanxess": _2, "lasalle": _2, "lat": _2, "latino": _2, "latrobe": _2, "law": _2, "lawyer": _2, "lds": _2, "lease": _2, "leclerc": _2, "lefrak": _2, "legal": _2, "lego": _2, "lexus": _2, "lgbt": _2, "lidl": _2, "life": _2, "lifeinsurance": _2, "lifestyle": _2, "lighting": _2, "like": _2, "lilly": _2, "limited": _2, "limo": _2, "lincoln": _2, "link": [1, { "myfritz": _3, "cyon": _3, "joinmc": _3, "dweb": _6, "inbrowser": _6, "nftstorage": _60, "mypep": _3, "storacha": _60, "w3s": _60 }], "live": [1, { "aem": _3, "hlx": _3, "ewp": _6 }], "living": _2, "llc": _2, "llp": _2, "loan": _2, "loans": _2, "locker": _2, "locus": _2, "lol": [1, { "omg": _3 }], "london": _2, "lotte": _2, "lotto": _2, "love": _2, "lpl": _2, "lplfinancial": _2, "ltd": _2, "ltda": _2, "lundbeck": _2, "luxe": _2, "luxury": _2, "madrid": _2, "maif": _2, "maison": _2, "makeup": _2, "man": _2, "management": _2, "mango": _2, "map": _2, "market": _2, "marketing": _2, "markets": _2, "marriott": _2, "marshalls": _2, "mattel": _2, "mba": _2, "mckinsey": _2, "med": _2, "media": _61, "meet": _2, "melbourne": _2, "meme": _2, "memorial": _2, "men": _2, "menu": [1, { "barsy": _3, "barsyonline": _3 }], "merck": _2, "merckmsd": _2, "miami": _2, "microsoft": _2, "mini": _2, "mint": _2, "mit": _2, "mitsubishi": _2, "mlb": _2, "mls": _2, "mma": _2, "mobile": _2, "moda": _2, "moe": _2, "moi": _2, "mom": _2, "monash": _2, "money": _2, "monster": _2, "mormon": _2, "mortgage": _2, "moscow": _2, "moto": _2, "motorcycles": _2, "mov": _2, "movie": _2, "msd": _2, "mtn": _2, "mtr": _2, "music": _2, "nab": _2, "nagoya": _2, "navy": _2, "nba": _2, "nec": _2, "netbank": _2, "netflix": _2, "network": [1, { "aem": _3, "alces": _6, "co": _3, "arvo": _3, "azimuth": _3, "tlon": _3 }], "neustar": _2, "new": _2, "news": [1, { "noticeable": _3 }], "next": _2, "nextdirect": _2, "nexus": _2, "nfl": _2, "ngo": _2, "nhk": _2, "nico": _2, "nike": _2, "nikon": _2, "ninja": _2, "nissan": _2, "nissay": _2, "nokia": _2, "norton": _2, "now": _2, "nowruz": _2, "nowtv": _2, "nra": _2, "nrw": _2, "ntt": _2, "nyc": _2, "obi": _2, "observer": _2, "office": _2, "okinawa": _2, "olayan": _2, "olayangroup": _2, "ollo": _2, "omega": _2, "one": [1, { "kin": _6, "service": _3, "website": _3 }], "ong": [1, { "obl": _3 }], "onl": _2, "online": [1, { "eero": _3, "eero-stage": _3, "websitebuilder": _3, "leapcell": _3, "barsy": _3 }], "ooo": _2, "open": _2, "oracle": _2, "orange": [1, { "tech": _3 }], "organic": _2, "origins": _2, "osaka": _2, "otsuka": _2, "ott": _2, "ovh": [1, { "nerdpol": _3 }], "page": [1, { "aem": _3, "hlx": _3, "translated": _3, "codeberg": _3, "heyflow": _3, "prvcy": _3, "rocky": _3, "statichost": _3, "pdns": _3, "plesk": _3 }], "panasonic": _2, "paris": _2, "pars": _2, "partners": _2, "parts": _2, "party": _2, "pay": _2, "pccw": _2, "pet": _2, "pfizer": _2, "pharmacy": _2, "phd": _2, "philips": _2, "phone": _2, "photo": _2, "photography": _2, "photos": _61, "physio": _2, "pics": _2, "pictet": _2, "pictures": [1, { "1337": _3 }], "pid": _2, "pin": _2, "ping": _2, "pink": _2, "pioneer": _2, "pizza": [1, { "ngrok": _3 }], "place": _21, "play": _2, "playstation": _2, "plumbing": _2, "plus": [1, { "playit": [2, { "at": _6, "with": _3 }] }], "pnc": _2, "pohl": _2, "poker": _2, "politie": _2, "porn": _2, "praxi": _2, "press": _2, "prime": _2, "prod": _2, "productions": _2, "prof": _2, "progressive": _2, "promo": _2, "properties": _2, "property": _2, "protection": _2, "pru": _2, "prudential": _2, "pub": [1, { "id": _6, "kin": _6, "barsy": _3 }], "pwc": _2, "qpon": _2, "quebec": _2, "quest": _2, "racing": _2, "radio": _2, "read": _2, "realestate": _2, "realtor": _2, "realty": _2, "recipes": _2, "red": _2, "redumbrella": _2, "rehab": _2, "reise": _2, "reisen": _2, "reit": _2, "reliance": _2, "ren": _2, "rent": _2, "rentals": _2, "repair": _2, "report": _2, "republican": _2, "rest": _2, "restaurant": _2, "review": _2, "reviews": [1, { "aem": _3 }], "rexroth": _2, "rich": _2, "richardli": _2, "ricoh": _2, "ril": _2, "rio": _2, "rip": [1, { "clan": _3 }], "rocks": [1, { "myddns": _3, "stackit": _3, "lima-city": _3, "webspace": _3 }], "rodeo": _2, "rogers": _2, "room": _2, "rsvp": _2, "rugby": _2, "ruhr": _2, "run": [1, { "appwrite": _6, "canva": _3, "development": _3, "ravendb": _3, "liara": [2, { "iran": _3 }], "lovable": _3, "needle": _3, "build": _6, "code": _6, "database": _6, "migration": _6, "onporter": _3, "repl": _3, "stackit": _3, "val": _50, "vercel": _3, "wix": _3 }], "rwe": _2, "ryukyu": _2, "saarland": _2, "safe": _2, "safety": _2, "sakura": _2, "sale": _2, "salon": _2, "samsclub": _2, "samsung": _2, "sandvik": _2, "sandvikcoromant": _2, "sanofi": _2, "sap": _2, "sarl": _2, "sas": _2, "save": _2, "saxo": _2, "sbi": _2, "sbs": _2, "scb": _2, "schaeffler": _2, "schmidt": _2, "scholarships": _2, "school": _2, "schule": _2, "schwarz": _2, "science": _2, "scot": [1, { "gov": [2, { "service": _3 }] }], "search": _2, "seat": _2, "secure": _2, "security": _2, "seek": _2, "select": _2, "sener": _2, "services": [1, { "loginline": _3 }], "seven": _2, "sew": _2, "sex": _2, "sexy": _2, "sfr": _2, "shangrila": _2, "sharp": _2, "shell": _2, "shia": _2, "shiksha": _2, "shoes": _2, "shop": [1, { "base": _3, "hoplix": _3, "barsy": _3, "barsyonline": _3, "shopware": _3 }], "shopping": _2, "shouji": _2, "show": _2, "silk": _2, "sina": _2, "singles": _2, "site": [1, { "square": _3, "canva": _24, "cloudera": _6, "convex": _3, "cyon": _3, "caffeine": _3, "fastvps": _3, "figma": _3, "figma-gov": _3, "preview": _3, "heyflow": _3, "jele": _3, "jouwweb": _3, "loginline": _3, "barsy": _3, "co": _3, "notion": _3, "omniwe": _3, "opensocial": _3, "madethis": _3, "support": _3, "platformsh": _6, "tst": _6, "byen": _3, "srht": _3, "novecore": _3, "cpanel": _3, "wpsquared": _3, "sourcecraft": _3 }], "ski": _2, "skin": _2, "sky": _2, "skype": _2, "sling": _2, "smart": _2, "smile": _2, "sncf": _2, "soccer": _2, "social": _2, "softbank": _2, "software": _2, "sohu": _2, "solar": _2, "solutions": _2, "song": _2, "sony": _2, "soy": _2, "spa": _2, "space": [1, { "myfast": _3, "heiyu": _3, "hf": [2, { "static": _3 }], "app-ionos": _3, "project": _3, "uber": _3, "xs4all": _3 }], "sport": _2, "spot": _2, "srl": _2, "stada": _2, "staples": _2, "star": _2, "statebank": _2, "statefarm": _2, "stc": _2, "stcgroup": _2, "stockholm": _2, "storage": _2, "store": [1, { "barsy": _3, "sellfy": _3, "shopware": _3, "storebase": _3 }], "stream": _2, "studio": _2, "study": _2, "style": _2, "sucks": _2, "supplies": _2, "supply": _2, "support": [1, { "barsy": _3 }], "surf": _2, "surgery": _2, "suzuki": _2, "swatch": _2, "swiss": _2, "sydney": _2, "systems": [1, { "knightpoint": _3 }], "tab": _2, "taipei": _2, "talk": _2, "taobao": _2, "target": _2, "tatamotors": _2, "tatar": _2, "tattoo": _2, "tax": _2, "taxi": _2, "tci": _2, "tdk": _2, "team": [1, { "discourse": _3, "jelastic": _3 }], "tech": [1, { "cleverapps": _3 }], "technology": _21, "temasek": _2, "tennis": _2, "teva": _2, "thd": _2, "theater": _2, "theatre": _2, "tiaa": _2, "tickets": _2, "tienda": _2, "tips": _2, "tires": _2, "tirol": _2, "tjmaxx": _2, "tjx": _2, "tkmaxx": _2, "tmall": _2, "today": [1, { "prequalifyme": _3 }], "tokyo": _2, "tools": [1, { "addr": _49, "myaddr": _3 }], "top": [1, { "ntdll": _3, "wadl": _6 }], "toray": _2, "toshiba": _2, "total": _2, "tours": _2, "town": _2, "toyota": _2, "toys": _2, "trade": _2, "trading": _2, "training": _2, "travel": _2, "travelers": _2, "travelersinsurance": _2, "trust": _2, "trv": _2, "tube": _2, "tui": _2, "tunes": _2, "tushu": _2, "tvs": _2, "ubank": _2, "ubs": _2, "unicom": _2, "university": _2, "uno": _2, "uol": _2, "ups": _2, "vacations": _2, "vana": _2, "vanguard": _2, "vegas": _2, "ventures": _2, "verisign": _2, "versicherung": _2, "vet": _2, "viajes": _2, "video": _2, "vig": _2, "viking": _2, "villas": _2, "vin": _2, "vip": [1, { "hidns": _3 }], "virgin": _2, "visa": _2, "vision": _2, "viva": _2, "vivo": _2, "vlaanderen": _2, "vodka": _2, "volvo": _2, "vote": _2, "voting": _2, "voto": _2, "voyage": _2, "wales": _2, "walmart": _2, "walter": _2, "wang": _2, "wanggou": _2, "watch": _2, "watches": _2, "weather": _2, "weatherchannel": _2, "webcam": _2, "weber": _2, "website": _61, "wed": _2, "wedding": _2, "weibo": _2, "weir": _2, "whoswho": _2, "wien": _2, "wiki": _61, "williamhill": _2, "win": _2, "windows": _2, "wine": _2, "winners": _2, "wme": _2, "wolterskluwer": _2, "woodside": _2, "work": _2, "works": _2, "world": _2, "wow": _2, "wtc": _2, "wtf": _2, "xbox": _2, "xerox": _2, "xihuan": _2, "xin": _2, "xn--11b4c3d": _2, "कॉम": _2, "xn--1ck2e1b": _2, "セール": _2, "xn--1qqw23a": _2, "佛山": _2, "xn--30rr7y": _2, "慈善": _2, "xn--3bst00m": _2, "集团": _2, "xn--3ds443g": _2, "在线": _2, "xn--3pxu8k": _2, "点看": _2, "xn--42c2d9a": _2, "คอม": _2, "xn--45q11c": _2, "八卦": _2, "xn--4gbrim": _2, "موقع": _2, "xn--55qw42g": _2, "公益": _2, "xn--55qx5d": _2, "公司": _2, "xn--5su34j936bgsg": _2, "香格里拉": _2, "xn--5tzm5g": _2, "网站": _2, "xn--6frz82g": _2, "移动": _2, "xn--6qq986b3xl": _2, "我爱你": _2, "xn--80adxhks": _2, "москва": _2, "xn--80aqecdr1a": _2, "католик": _2, "xn--80asehdb": _2, "онлайн": _2, "xn--80aswg": _2, "сайт": _2, "xn--8y0a063a": _2, "联通": _2, "xn--9dbq2a": _2, "קום": _2, "xn--9et52u": _2, "时尚": _2, "xn--9krt00a": _2, "微博": _2, "xn--b4w605ferd": _2, "淡马锡": _2, "xn--bck1b9a5dre4c": _2, "ファッション": _2, "xn--c1avg": _2, "орг": _2, "xn--c2br7g": _2, "नेट": _2, "xn--cck2b3b": _2, "ストア": _2, "xn--cckwcxetd": _2, "アマゾン": _2, "xn--cg4bki": _2, "삼성": _2, "xn--czr694b": _2, "商标": _2, "xn--czrs0t": _2, "商店": _2, "xn--czru2d": _2, "商城": _2, "xn--d1acj3b": _2, "дети": _2, "xn--eckvdtc9d": _2, "ポイント": _2, "xn--efvy88h": _2, "新闻": _2, "xn--fct429k": _2, "家電": _2, "xn--fhbei": _2, "كوم": _2, "xn--fiq228c5hs": _2, "中文网": _2, "xn--fiq64b": _2, "中信": _2, "xn--fjq720a": _2, "娱乐": _2, "xn--flw351e": _2, "谷歌": _2, "xn--fzys8d69uvgm": _2, "電訊盈科": _2, "xn--g2xx48c": _2, "购物": _2, "xn--gckr3f0f": _2, "クラウド": _2, "xn--gk3at1e": _2, "通販": _2, "xn--hxt814e": _2, "网店": _2, "xn--i1b6b1a6a2e": _2, "संगठन": _2, "xn--imr513n": _2, "餐厅": _2, "xn--io0a7i": _2, "网络": _2, "xn--j1aef": _2, "ком": _2, "xn--jlq480n2rg": _2, "亚马逊": _2, "xn--jvr189m": _2, "食品": _2, "xn--kcrx77d1x4a": _2, "飞利浦": _2, "xn--kput3i": _2, "手机": _2, "xn--mgba3a3ejt": _2, "ارامكو": _2, "xn--mgba7c0bbn0a": _2, "العليان": _2, "xn--mgbab2bd": _2, "بازار": _2, "xn--mgbca7dzdo": _2, "ابوظبي": _2, "xn--mgbi4ecexp": _2, "كاثوليك": _2, "xn--mgbt3dhd": _2, "همراه": _2, "xn--mk1bu44c": _2, "닷컴": _2, "xn--mxtq1m": _2, "政府": _2, "xn--ngbc5azd": _2, "شبكة": _2, "xn--ngbe9e0a": _2, "بيتك": _2, "xn--ngbrx": _2, "عرب": _2, "xn--nqv7f": _2, "机构": _2, "xn--nqv7fs00ema": _2, "组织机构": _2, "xn--nyqy26a": _2, "健康": _2, "xn--otu796d": _2, "招聘": _2, "xn--p1acf": [1, { "xn--90amc": _3, "xn--j1aef": _3, "xn--j1ael8b": _3, "xn--h1ahn": _3, "xn--j1adp": _3, "xn--c1avg": _3, "xn--80aaa0cvac": _3, "xn--h1aliz": _3, "xn--90a1af": _3, "xn--41a": _3 }], "рус": [1, { "биз": _3, "ком": _3, "крым": _3, "мир": _3, "мск": _3, "орг": _3, "самара": _3, "сочи": _3, "спб": _3, "я": _3 }], "xn--pssy2u": _2, "大拿": _2, "xn--q9jyb4c": _2, "みんな": _2, "xn--qcka1pmc": _2, "グーグル": _2, "xn--rhqv96g": _2, "世界": _2, "xn--rovu88b": _2, "書籍": _2, "xn--ses554g": _2, "网址": _2, "xn--t60b56a": _2, "닷넷": _2, "xn--tckwe": _2, "コム": _2, "xn--tiq49xqyj": _2, "天主教": _2, "xn--unup4y": _2, "游戏": _2, "xn--vermgensberater-ctb": _2, "vermögensberater": _2, "xn--vermgensberatung-pwb": _2, "vermögensberatung": _2, "xn--vhquv": _2, "企业": _2, "xn--vuq861b": _2, "信息": _2, "xn--w4r85el8fhu5dnra": _2, "嘉里大酒店": _2, "xn--w4rs40l": _2, "嘉里": _2, "xn--xhq521b": _2, "广东": _2, "xn--zfr164b": _2, "政务": _2, "xyz": [1, { "caffeine": _3, "botdash": _3, "telebit": _6 }], "yachts": _2, "yahoo": _2, "yamaxun": _2, "yandex": _2, "yodobashi": _2, "yoga": _2, "yokohama": _2, "you": _2, "youtube": _2, "yun": _2, "zappos": _2, "zara": _2, "zero": _2, "zip": _2, "zone": [1, { "triton": _6, "stackit": _3, "lima": _3 }], "zuerich": _2 }];
    return rules;
})();

/**
 * Lookup parts of domain in Trie
 */
function lookupInTrie(parts, trie, index, allowedMask) {
    let result = null;
    let node = trie;
    while (node !== undefined) {
        // We have a match!
        if ((node[0] & allowedMask) !== 0) {
            result = {
                index: index + 1,
                isIcann: node[0] === 1 /* RULE_TYPE.ICANN */,
                isPrivate: node[0] === 2 /* RULE_TYPE.PRIVATE */,
            };
        }
        // No more `parts` to look for
        if (index === -1) {
            break;
        }
        const succ = node[1];
        node = Object.prototype.hasOwnProperty.call(succ, parts[index])
            ? succ[parts[index]]
            : succ['*'];
        index -= 1;
    }
    return result;
}
/**
 * Check if `hostname` has a valid public suffix in `trie`.
 */
function suffixLookup(hostname, options, out) {
    var _a;
    if (fastPathLookup(hostname, options, out)) {
        return;
    }
    const hostnameParts = hostname.split('.');
    const allowedMask = (options.allowPrivateDomains ? 2 /* RULE_TYPE.PRIVATE */ : 0) |
        (options.allowIcannDomains ? 1 /* RULE_TYPE.ICANN */ : 0);
    // Look for exceptions
    const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
    if (exceptionMatch !== null) {
        out.isIcann = exceptionMatch.isIcann;
        out.isPrivate = exceptionMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join('.');
        return;
    }
    // Look for a match in rules
    const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
    if (rulesMatch !== null) {
        out.isIcann = rulesMatch.isIcann;
        out.isPrivate = rulesMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(rulesMatch.index).join('.');
        return;
    }
    // No match found...
    // Prevailing rule is '*' so we consider the top-level domain to be the
    // public suffix of `hostname` (e.g.: 'example.org' => 'org').
    out.isIcann = false;
    out.isPrivate = false;
    out.publicSuffix = (_a = hostnameParts[hostnameParts.length - 1]) !== null && _a !== void 0 ? _a : null;
}

function parse(url, options = {}) {
    return parseImpl(url, 5 /* FLAG.ALL */, suffixLookup, options, getEmptyResult());
}

const checkIfHostIsAllowed=o=>{const t=parse(window.location.origin).hostname,s=o.chatbot?.allowedHosts||[];if(t)return s.includes(t)};

/**
 * marked v16.4.2 - a markdown parser
 * Copyright (c) 2018-2025, MarkedJS. (MIT License)
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT License)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

function L(){return {async:false,breaks:false,extensions:null,gfm:true,hooks:null,pedantic:false,renderer:null,silent:false,tokenizer:null,walkTokens:null}}var T=L();function G(l){T=l;}var E={exec:()=>null};function d(l,e=""){let t=typeof l=="string"?l:l.source,n={replace:(r,i)=>{let s=typeof i=="string"?i:i.source;return s=s.replace(m.caret,"$1"),t=t.replace(r,s),n},getRegex:()=>new RegExp(t,e)};return n}var be=(()=>{try{return !!new RegExp("(?<=1)(?<!1)")}catch{return  false}})(),m={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:l=>new RegExp(`^( {0,3}${l})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:l=>new RegExp(`^ {0,${Math.min(3,l-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:l=>new RegExp(`^ {0,${Math.min(3,l-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:l=>new RegExp(`^ {0,${Math.min(3,l-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:l=>new RegExp(`^ {0,${Math.min(3,l-1)}}#`),htmlBeginRegex:l=>new RegExp(`^ {0,${Math.min(3,l-1)}}<(?:[a-z].*>|!--)`,"i")},Re=/^(?:[ \t]*(?:\n|$))+/,Te=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Oe=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,I=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,we=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,F=/(?:[*+-]|\d{1,9}[.)])/,ie=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,oe=d(ie).replace(/bull/g,F).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ye=d(ie).replace(/bull/g,F).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),j=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Pe=/^[^\n]+/,Q=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Se=d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Q).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),$e=d(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,F).getRegex(),v="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",U=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,_e=d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",U).replace("tag",v).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ae=d(j).replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",v).getRegex(),Le=d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ae).getRegex(),K={blockquote:Le,code:Te,def:Se,fences:Oe,heading:we,hr:I,html:_e,lheading:oe,list:$e,newline:Re,paragraph:ae,table:E,text:Pe},re=d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",v).getRegex(),Me={...K,lheading:ye,table:re,paragraph:d(j).replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",re).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",v).getRegex()},ze={...K,html:d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",U).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:E,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:d(j).replace("hr",I).replace("heading",` *#{1,6} *[^
]`).replace("lheading",oe).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ae=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ee=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,le=/^( {2,}|\\)\n(?!\s*$)/,Ie=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,D=/[\p{P}\p{S}]/u,W=/[\s\p{P}\p{S}]/u,ue=/[^\s\p{P}\p{S}]/u,Ce=d(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,W).getRegex(),pe=/(?!~)[\p{P}\p{S}]/u,Be=/(?!~)[\s\p{P}\p{S}]/u,qe=/(?:[^\s\p{P}\p{S}]|~)/u,ve=d(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",be?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ce=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,De=d(ce,"u").replace(/punct/g,D).getRegex(),He=d(ce,"u").replace(/punct/g,pe).getRegex(),he="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ze=d(he,"gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,W).replace(/punct/g,D).getRegex(),Ge=d(he,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,Be).replace(/punct/g,pe).getRegex(),Ne=d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,W).replace(/punct/g,D).getRegex(),Fe=d(/\\(punct)/,"gu").replace(/punct/g,D).getRegex(),je=d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Qe=d(U).replace("(?:-->|$)","-->").getRegex(),Ue=d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Qe).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),q=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Ke=d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",q).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),de=d(/^!?\[(label)\]\[(ref)\]/).replace("label",q).replace("ref",Q).getRegex(),ke=d(/^!?\[(ref)\](?:\[\])?/).replace("ref",Q).getRegex(),We=d("reflink|nolink(?!\\()","g").replace("reflink",de).replace("nolink",ke).getRegex(),se=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,X={_backpedal:E,anyPunctuation:Fe,autolink:je,blockSkip:ve,br:le,code:Ee,del:E,emStrongLDelim:De,emStrongRDelimAst:Ze,emStrongRDelimUnd:Ne,escape:Ae,link:Ke,nolink:ke,punctuation:Ce,reflink:de,reflinkSearch:We,tag:Ue,text:Ie,url:E},Xe={...X,link:d(/^!?\[(label)\]\((.*?)\)/).replace("label",q).getRegex(),reflink:d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",q).getRegex()},N={...X,emStrongRDelimAst:Ge,emStrongLDelim:He,url:d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",se).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:d(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",se).getRegex()},Je={...N,br:d(le).replace("{2,}","*").getRegex(),text:d(N.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},C={normal:K,gfm:Me,pedantic:ze},M={normal:X,gfm:N,breaks:Je,pedantic:Xe};var Ve={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ge=l=>Ve[l];function w(l,e){if(e){if(m.escapeTest.test(l))return l.replace(m.escapeReplace,ge)}else if(m.escapeTestNoEncode.test(l))return l.replace(m.escapeReplaceNoEncode,ge);return l}function J(l){try{l=encodeURI(l).replace(m.percentDecode,"%");}catch{return null}return l}function V(l,e){let t=l.replace(m.findPipe,(i,s,a)=>{let o=false,p=s;for(;--p>=0&&a[p]==="\\";)o=!o;return o?"|":" |"}),n=t.split(m.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(m.slashPipe,"|");return n}function z(l,e,t){let n=l.length;if(n===0)return "";let r=0;for(;r<n;){let i=l.charAt(n-r-1);if(i===e&&true)r++;else break}return l.slice(0,n-r)}function fe(l,e){if(l.indexOf(e[1])===-1)return  -1;let t=0;for(let n=0;n<l.length;n++)if(l[n]==="\\")n++;else if(l[n]===e[0])t++;else if(l[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function me(l,e,t,n,r){let i=e.href,s=e.title||null,a=l[1].replace(r.other.outputLinkReplace,"$1");n.state.inLink=true;let o={type:l[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:s,text:a,tokens:n.inlineTokens(a)};return n.state.inLink=false,o}function Ye(l,e,t){let n=l.match(t.other.indentCodeCompensation);if(n===null)return e;let r=n[1];return e.split(`
`).map(i=>{let s=i.match(t.other.beginningSpace);if(s===null)return i;let[a]=s;return a.length>=r.length?i.slice(r.length):i}).join(`
`)}var y=class{options;rules;lexer;constructor(e){this.options=e||T;}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return {type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return {type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:z(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=Ye(n,t[3]||"",this.rules);return {type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=z(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim());}return {type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return {type:"hr",raw:z(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=z(t[0],`
`).split(`
`),r="",i="",s=[];for(;n.length>0;){let a=false,o=[],p;for(p=0;p<n.length;p++)if(this.rules.other.blockquoteStart.test(n[p]))o.push(n[p]),a=true;else if(!a)o.push(n[p]);else break;n=n.slice(p);let u=o.join(`
`),c=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${u}`:u,i=i?`${i}
${c}`:c;let g=this.lexer.state.top;if(this.lexer.state.top=true,this.lexer.blockTokens(c,s,true),this.lexer.state.top=g,n.length===0)break;let h=s.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let R=h,f=R.raw+`
`+n.join(`
`),O=this.blockquote(f);s[s.length-1]=O,r=r.substring(0,r.length-R.raw.length)+O.raw,i=i.substring(0,i.length-R.text.length)+O.text;break}else if(h?.type==="list"){let R=h,f=R.raw+`
`+n.join(`
`),O=this.list(f);s[s.length-1]=O,r=r.substring(0,r.length-h.raw.length)+O.raw,i=i.substring(0,i.length-R.raw.length)+O.raw,n=f.substring(s.at(-1).raw.length).split(`
`);continue}}return {type:"blockquote",raw:r,tokens:s,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:false,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let s=this.rules.other.listItemRegex(n),a=false;for(;e;){let p=false,u="",c="";if(!(t=s.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let g=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,H=>" ".repeat(3*H.length)),h=e.split(`
`,1)[0],R=!g.trim(),f=0;if(this.options.pedantic?(f=2,c=g.trimStart()):R?f=t[1].length+1:(f=t[2].search(this.rules.other.nonSpaceChar),f=f>4?1:f,c=g.slice(f),f+=t[1].length),R&&this.rules.other.blankLine.test(h)&&(u+=h+`
`,e=e.substring(h.length+1),p=true),!p){let H=this.rules.other.nextBulletRegex(f),ee=this.rules.other.hrRegex(f),te=this.rules.other.fencesBeginRegex(f),ne=this.rules.other.headingBeginRegex(f),xe=this.rules.other.htmlBeginRegex(f);for(;e;){let Z=e.split(`
`,1)[0],A;if(h=Z,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),A=h):A=h.replace(this.rules.other.tabCharGlobal,"    "),te.test(h)||ne.test(h)||xe.test(h)||H.test(h)||ee.test(h))break;if(A.search(this.rules.other.nonSpaceChar)>=f||!h.trim())c+=`
`+A.slice(f);else {if(R||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||te.test(g)||ne.test(g)||ee.test(g))break;c+=`
`+h;}!R&&!h.trim()&&(R=true),u+=Z+`
`,e=e.substring(Z.length+1),g=A.slice(f);}}i.loose||(a?i.loose=true:this.rules.other.doubleBlankLine.test(u)&&(a=true));let O=null,Y;this.options.gfm&&(O=this.rules.other.listIsTask.exec(c),O&&(Y=O[0]!=="[ ] ",c=c.replace(this.rules.other.listReplaceTask,""))),i.items.push({type:"list_item",raw:u,task:!!O,checked:Y,loose:false,text:c,tokens:[]}),i.raw+=u;}let o=i.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let p=0;p<i.items.length;p++)if(this.lexer.state.top=false,i.items[p].tokens=this.lexer.blockTokens(i.items[p].text,[]),!i.loose){let u=i.items[p].tokens.filter(g=>g.type==="space"),c=u.length>0&&u.some(g=>this.rules.other.anyLine.test(g.raw));i.loose=c;}if(i.loose)for(let p=0;p<i.items.length;p++)i.items[p].loose=true;return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return {type:"html",block:true,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return {type:"def",tag:n,raw:t[0],href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=V(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let a of r)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<n.length;a++)s.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:true,align:s.align[a]});for(let a of i)s.rows.push(V(a,s.header.length).map((o,p)=>({text:o,tokens:this.lexer.inline(o),header:false,align:s.align[p]})));return s}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return {type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return {type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return {type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return {type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return !this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=true:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=false),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=true:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=false),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:false,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let s=z(n.slice(0,-1),"\\");if((n.length-s.length)%2===0)return}else {let s=fe(t[2],"()");if(s===-2)return;if(s>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+s;t[2]=t[2].substring(0,s),t[0]=t[0].substring(0,o).trim(),t[3]="";}}let r=t[2],i="";if(this.options.pedantic){let s=this.rules.other.pedanticHrefTitle.exec(r);s&&(r=s[1],i=s[3]);}else i=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),me(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[r.toLowerCase()];if(!i){let s=n[0].charAt(0);return {type:"text",raw:s,text:s}}return me(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let s=[...r[0]].length-1,a,o,p=s,u=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+s);(r=c.exec(t))!=null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(o=[...a].length,r[3]||r[4]){p+=o;continue}else if((r[5]||r[6])&&s%3&&!((s+o)%3)){u+=o;continue}if(p-=o,p>0)continue;o=Math.min(o,o+p+u);let g=[...r[0]][0].length,h=e.slice(0,s+r.index+g+o);if(Math.min(s,o)%2){let f=h.slice(1,-1);return {type:"em",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}let R=h.slice(2,-2);return {type:"strong",raw:h,text:R,tokens:this.lexer.inlineTokens(R)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return {type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return {type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else {let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0];}return {type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return {type:"text",raw:t[0],text:t[0],escaped:n}}}};var x=class l{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||T,this.options.tokenizer=this.options.tokenizer||new y,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:false,inRawBlock:false,top:true};let t={other:m,block:C.normal,inline:M.normal};this.options.pedantic?(t.block=C.pedantic,t.inline=M.pedantic):this.options.gfm&&(t.block=C.gfm,this.options.breaks?t.inline=M.breaks:t.inline=M.gfm),this.tokenizer.rules=t;}static get rules(){return {block:C,inline:M}}static lex(e,t){return new l(t).lex(e)}static lexInline(e,t){return new l(t).inlineTokens(e)}lex(e){e=e.replace(m.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens);}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=false){for(this.options.pedantic&&(e=e.replace(m.tabCharGlobal,"    ").replace(m.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),true):false))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let s=t.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let s=t.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let s=t.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let s=1/0,a=e.slice(1),o;this.options.extensions.startBlock.forEach(p=>{o=p.call({lexer:this},a),typeof o=="number"&&o>=0&&(s=Math.min(s,o));}),s<1/0&&s>=0&&(i=e.substring(0,s+1));}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let s=t.at(-1);n&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let s=t.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):t.push(r);continue}if(e){let s="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=true,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let s=false,a="";for(;e;){s||(a=""),s=false;let o;if(this.options.extensions?.inline?.some(u=>(o=u.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),true):false))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let u=t.at(-1);o.type==="text"&&u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):t.push(o);continue}if(o=this.tokenizer.emStrong(e,n,a)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.del(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),t.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),t.push(o);continue}let p=e;if(this.options.extensions?.startInline){let u=1/0,c=e.slice(1),g;this.options.extensions.startInline.forEach(h=>{g=h.call({lexer:this},c),typeof g=="number"&&g>=0&&(u=Math.min(u,g));}),u<1/0&&u>=0&&(p=e.substring(0,u+1));}if(o=this.tokenizer.inlineText(p)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(a=o.raw.slice(-1)),s=true;let u=t.at(-1);u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):t.push(o);continue}if(e){let u="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return t}};var P=class{options;parser;constructor(e){this.options=e||T;}space(e){return ""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(m.notSpaceStart)?.[0],i=e.replace(m.endingNewline,"")+`
`;return r?'<pre><code class="language-'+w(r)+'">'+(n?i:w(i,true))+`</code></pre>
`:"<pre><code>"+(n?i:w(i,true))+`</code></pre>
`}blockquote({tokens:e}){return `<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return ""}heading({tokens:e,depth:t}){return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return `<hr>
`}list(e){let t=e.ordered,n=e.start,r="";for(let a=0;a<e.items.length;a++){let o=e.items[a];r+=this.listitem(o);}let i=t?"ol":"ul",s=t&&n!==1?' start="'+n+'"':"";return "<"+i+s+`>
`+r+"</"+i+`>
`}listitem(e){let t="";if(e.task){let n=this.checkbox({checked:!!e.checked});e.loose?e.tokens[0]?.type==="paragraph"?(e.tokens[0].text=n+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=n+" "+w(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=true)):e.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:true}):t+=n+" ";}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return "<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return `<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let r="";for(let i=0;i<e.rows.length;i++){let s=e.rows[i];n="";for(let a=0;a<s.length;a++)n+=this.tablecell(s[a]);r+=this.tablerow({text:n});}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return `<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return (e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return `<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return `<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return `<code>${w(e,true)}</code>`}br(e){return "<br>"}del({tokens:e}){return `<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=J(e);if(i===null)return r;e=i;let s='<a href="'+e+'"';return t&&(s+=' title="'+w(t)+'"'),s+=">"+r+"</a>",s}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=J(e);if(i===null)return w(n);e=i;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${w(t)}"`),s+=">",s}text(e){return "tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:w(e.text)}};var $=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return ""+e}image({text:e}){return ""+e}br(){return ""}};var b=class l{options;renderer;textRenderer;constructor(e){this.options=e||T,this.options.renderer=this.options.renderer||new P,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new $;}static parse(e,t){return new l(t).parse(e)}static parseInline(e,t){return new l(t).parseInline(e)}parse(e,t=true){let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let a=i,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==false||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let s=i;switch(s.type){case "space":{n+=this.renderer.space(s);continue}case "hr":{n+=this.renderer.hr(s);continue}case "heading":{n+=this.renderer.heading(s);continue}case "code":{n+=this.renderer.code(s);continue}case "table":{n+=this.renderer.table(s);continue}case "blockquote":{n+=this.renderer.blockquote(s);continue}case "list":{n+=this.renderer.list(s);continue}case "html":{n+=this.renderer.html(s);continue}case "def":{n+=this.renderer.def(s);continue}case "paragraph":{n+=this.renderer.paragraph(s);continue}case "text":{let a=s,o=this.renderer.text(a);for(;r+1<e.length&&e[r+1].type==="text";)a=e[++r],o+=`
`+this.renderer.text(a);t?n+=this.renderer.paragraph({type:"paragraph",raw:o,text:o,tokens:[{type:"text",raw:o,text:o,escaped:true}]}):n+=o;continue}default:{let a='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,t=this.renderer){let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==false||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){n+=a||"";continue}}let s=i;switch(s.type){case "escape":{n+=t.text(s);break}case "html":{n+=t.html(s);break}case "link":{n+=t.link(s);break}case "image":{n+=t.image(s);break}case "strong":{n+=t.strong(s);break}case "em":{n+=t.em(s);break}case "codespan":{n+=t.codespan(s);break}case "br":{n+=t.br(s);break}case "del":{n+=t.del(s);break}case "text":{n+=t.text(s);break}default:{let a='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}};var S=class{options;block;constructor(e){this.options=e||T;}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?x.lex:x.lexInline}provideParser(){return this.block?b.parse:b.parseInline}};var B=class{defaults=L();options=this.setOptions;parse=this.parseMarkdown(true);parseInline=this.parseMarkdown(false);Parser=b;Renderer=P;TextRenderer=$;Lexer=x;Tokenizer=y;Hooks=S;constructor(...e){this.use(...e);}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case "table":{let i=r;for(let s of i.header)n=n.concat(this.walkTokens(s.tokens,t));for(let s of i.rows)for(let a of s)n=n.concat(this.walkTokens(a.tokens,t));break}case "list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(s=>{let a=i[s].flat(1/0);n=n.concat(this.walkTokens(a,t));}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)));}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||false,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let s=t.renderers[i.name];s?t.renderers[i.name]=function(...a){let o=i.renderer.apply(this,a);return o===false&&(o=s.apply(this,a)),o}:t.renderers[i.name]=i.renderer;}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=t[i.level];s?s.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]));}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens);}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new P(this.defaults);for(let s in n.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;let a=s,o=n.renderer[a],p=i[a];i[a]=(...u)=>{let c=o.apply(i,u);return c===false&&(c=p.apply(i,u)),c||""};}r.renderer=i;}if(n.tokenizer){let i=this.defaults.tokenizer||new y(this.defaults);for(let s in n.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let a=s,o=n.tokenizer[a],p=i[a];i[a]=(...u)=>{let c=o.apply(i,u);return c===false&&(c=p.apply(i,u)),c};}r.tokenizer=i;}if(n.hooks){let i=this.defaults.hooks||new S;for(let s in n.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;let a=s,o=n.hooks[a],p=i[a];S.passThroughHooks.has(s)?i[a]=u=>{if(this.defaults.async&&S.passThroughHooksRespectAsync.has(s))return (async()=>{let g=await o.call(i,u);return p.call(i,g)})();let c=o.call(i,u);return p.call(i,c)}:i[a]=(...u)=>{if(this.defaults.async)return (async()=>{let g=await o.apply(i,u);return g===false&&(g=await p.apply(i,u)),g})();let c=o.apply(i,u);return c===false&&(c=p.apply(i,u)),c};}r.hooks=i;}if(n.walkTokens){let i=this.defaults.walkTokens,s=n.walkTokens;r.walkTokens=function(a){let o=[];return o.push(s.call(this,a)),i&&(o=o.concat(i.call(this,a))),o};}this.defaults={...this.defaults,...r};}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return x.lex(e,t??this.defaults)}parser(e,t){return b.parse(e,t??this.defaults)}parseMarkdown(e){return (n,r)=>{let i={...r},s={...this.defaults,...i},a=this.onError(!!s.silent,!!s.async);if(this.defaults.async===true&&i.async===false)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=e),s.async)return (async()=>{let o=s.hooks?await s.hooks.preprocess(n):n,u=await(s.hooks?await s.hooks.provideLexer():e?x.lex:x.lexInline)(o,s),c=s.hooks?await s.hooks.processAllTokens(u):u;s.walkTokens&&await Promise.all(this.walkTokens(c,s.walkTokens));let h=await(s.hooks?await s.hooks.provideParser():e?b.parse:b.parseInline)(c,s);return s.hooks?await s.hooks.postprocess(h):h})().catch(a);try{s.hooks&&(n=s.hooks.preprocess(n));let p=(s.hooks?s.hooks.provideLexer():e?x.lex:x.lexInline)(n,s);s.hooks&&(p=s.hooks.processAllTokens(p)),s.walkTokens&&this.walkTokens(p,s.walkTokens);let c=(s.hooks?s.hooks.provideParser():e?b.parse:b.parseInline)(p,s);return s.hooks&&(c=s.hooks.postprocess(c)),c}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+w(n.message+"",true)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}};var _=new B;function k(l,e){return _.parse(l,e)}k.options=k.setOptions=function(l){return _.setOptions(l),k.defaults=_.defaults,G(k.defaults),k};k.getDefaults=L;k.defaults=T;k.use=function(...l){return _.use(...l),k.defaults=_.defaults,G(k.defaults),k};k.walkTokens=function(l,e){return _.walkTokens(l,e)};k.parseInline=_.parseInline;k.Parser=b;k.parser=b.parse;k.Renderer=P;k.TextRenderer=$;k.Lexer=x;k.lexer=x.lex;k.Tokenizer=y;k.Hooks=S;k.parse=k;k.options;k.setOptions;k.use;k.walkTokens;k.parseInline;b.parse;x.lex;

const initMessageElement=e=>{const s=document.createElement("div"),t=window.getMWidget?.();s.id=`message-${e.id}`;const a=new Date(e.createdAt).toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit",hour12:false});let i="";if(e.repliedTo){const s=e.repliedTo.content.length>40?e.repliedTo.content.substring(0,40)+"...":e.repliedTo.content;i=`\n        <div class="mw-replied-to-preview" data-reply-message-id="${e.repliedTo.id}">\n          <div class="mw-replied-to-header">\n            <span class="mw-replied-to-sender">${"USER"===e.repliedTo.type?"شما":"پشتیبان"}</span>\n          </div>\n          <div class="mw-replied-to-content">${s}</div>\n        </div>\n      `;}let d="";if(e.fileSrc){const s=e.fileSrc.length>20?e.fileSrc.substring(0,17)+"...":e.fileSrc;d=`\n        <a href="${e.fileSrc}" target="_blank" rel="noopener noreferrer" class="mw-file-preview" title="دانلود فایل">\n          <div class="mw-file-preview-icon">\n            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6m4 18H6V4h7v5h5v11z"/></svg>\n          </div>\n          <div class="mw-file-preview-info">\n            <div class="mw-file-preview-name">${s}</div>\n            <div class="mw-file-preview-type">file</div>\n          </div>\n        </a>\n      `;}s.innerHTML=`\n    <div class="mw-chat-message ${"USER"===e.type?"mw-chat-message-user":"mw-chat-message-supporter"}">\n    ${i}\n    ${d}\n        <div class="mw-message-content">${k.parse(e.content)}</div>\n      </div>\n      <div class="mw-message-footer">\n      ${"USER"!==e.type?`\n        <div class="mw-message-feedback">\n        <button class="mw-feedback-btn mw-feedback-dislike" data-message-id="${e.id}" title="مفید نبود">\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 14l-.986.164A1 1 0 0 1 15 13zM4 14v1a1 1 0 0 1-1-1zm16.522-2.392l.98-.196zM6 3h11.36v2H6zm12.56 12H15v-2h3.56zm-2.573-1.164l.805 4.835L14.82 19l-.806-4.836zM14.82 21h-.214v-2h.214zm-3.543-1.781l-2.515-3.774l1.664-1.11l2.516 3.774zM7.93 15H4v-2h3.93zM3 14V6h2v8zm17.302-8.588l1.2 6l-1.96.392l-1.2-6zM8.762 15.445A1 1 0 0 0 7.93 15v-2a3 3 0 0 1 2.496 1.336zm8.03 3.226A2 2 0 0 1 14.82 21v-2zM18.56 13a1 1 0 0 0 .981-1.196l1.961-.392A3 3 0 0 1 18.561 15zm-1.2-10a3 3 0 0 1 2.942 2.412l-1.96.392A1 1 0 0 0 17.36 5zm-2.754 18a4 4 0 0 1-3.328-1.781l1.664-1.11a2 2 0 0 0 1.664.891zM6 5a1 1 0 0 0-1 1H3a3 3 0 0 1 3-3z"/><path stroke="currentColor" stroke-width="2" d="M8 14V4"/></g></svg>\n        </button>\n        <button class="mw-feedback-btn mw-feedback-like" data-message-id="${e.id}" title="مفید بود">\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 10l-.74-.123a.75.75 0 0 0 .74.873zM4 10v-.75a.75.75 0 0 0-.75.75zm16.522 2.392l.735.147zM6 20.75h11.36v-1.5H6zm12.56-11.5H15v1.5h3.56zm-2.82.873l.806-4.835l-1.48-.247l-.806 4.836zm-.92-6.873h-.214v1.5h.213zm-3.335 1.67L8.97 8.693l1.248.832l2.515-3.773zM7.93 9.25H4v1.5h3.93zM3.25 10v8h1.5v-8zm16.807 8.54l1.2-6l-1.47-.295l-1.2 6zM8.97 8.692a1.25 1.25 0 0 1-1.04.557v1.5c.92 0 1.778-.46 2.288-1.225zm7.576-3.405A1.75 1.75 0 0 0 14.82 3.25v1.5a.25.25 0 0 1 .246.291zm2.014 5.462c.79 0 1.38.722 1.226 1.495l1.471.294A2.75 2.75 0 0 0 18.56 9.25zm-1.2 10a2.75 2.75 0 0 0 2.697-2.21l-1.47-.295a1.25 1.25 0 0 1-1.227 1.005zm-2.754-17.5a3.75 3.75 0 0 0-3.12 1.67l1.247.832a2.25 2.25 0 0 1 1.873-1.002zM6 19.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 6 20.75z"/><path stroke="currentColor" stroke-width="1.5" d="M8 10v10"/></g></svg>\n        </button>\n        </div>\n        `:""}\n    <div class="mw-message-time">${a}</div>\n    </div>\n    `,s.className="mw-message-wrapper "+("USER"===e.type?"mw-message-wrapper-user":"mw-message-wrapper-supporter"),t?.chat?.conversation.containerElement?.appendChild(s),addMessageElementListeners(e),"USER"!==e.type&&addMessageFeedbackListeners(e),e.repliedTo&&addMessageRepliedToListener(e);},addMessageElementListeners=e=>{const s=window.getMWidget?.(),t=getMessageElement(e);t?.addEventListener("dblclick",()=>{s?.chat.replyMaster.setReply(e);});},addMessageFeedbackListeners=e=>{const s=getMessageElement(e),t=s?.querySelector(".mw-feedback-like"),a=s?.querySelector(".mw-feedback-dislike");t&&t.addEventListener("click",()=>{sendMessageFeedBack(e,true);}),a&&a.addEventListener("click",()=>{sendMessageFeedBack(e,false);});},sendMessageFeedBack=async(e,s)=>{const t=getMessageElement(e);if(!e.hasFeedback){disableMessageFeedbackButtons(e);try{await e.sendFeedBack(s);const a=t?.querySelector(".mw-feedback-like"),i=t?.querySelector(".mw-feedback-dislike");s&&a?a.classList.add("mw-feedback-active"):!s&&i&&i.classList.add("mw-feedback-active");}catch{enableMessageFeedbackButtons(e);}}},disableMessageFeedbackButtons=e=>{const s=getMessageElement(e),t=s?.querySelector(".mw-feedback-like"),a=s?.querySelector(".mw-feedback-dislike");t&&(t.disabled=true,t.classList.add("mw-feedback-disabled")),a&&(a.disabled=true,a.classList.add("mw-feedback-disabled"));},addMessageRepliedToListener=e=>{const s=getMessageElement(e),t=getMessageElement(e.repliedTo||{}),a=s?.querySelector(".mw-replied-to-preview");a&&t&&a.addEventListener("click",()=>{t?.scrollIntoView({behavior:"smooth",block:"center"}),t?.classList.add("mw-message-highlight"),setTimeout(()=>{t?.classList.remove("mw-message-highlight");},2e3);});},getMessageElement=e=>{const s=window.getMWidget?.();return s?.chat.conversation.containerElement?.querySelector(`#message-${e.id}`)},showMessageTooltip=e=>{const s=window.getMWidget?.(),t=s?.container?.querySelector(".mw-toggle-tooltip"),a=s?.container?.querySelector(".mw-toggle-tooltip-text");if(t&&a){t.classList.remove("mw-hidden");const s=e.content.length>50?e.content.substring(0,50)+"...":e.content;a.textContent=s,setTimeout(()=>{t.classList.add("mw-hidden");},3e3);}},enableMessageFeedbackButtons=e=>{const s=getMessageElement(e),t=s?.querySelector(".mw-feedback-like"),a=s?.querySelector(".mw-feedback-dislike");t&&(t.disabled=false,t.classList.remove("mw-feedback-disabled")),a&&(a.disabled=false,a.classList.remove("mw-feedback-disabled"));};

const PhoneNumberRegex=/^(\+98|0)?9\d{9}$/;

const sendMessage=async e=>{if(e.trim().length){if(!checkIfUserHasPhoneNumber())throw new Error("User has not submitted the phone number form");{const t=window.getMWidget?.();if(t){const r=t.chat.fileMaster.file,o=t.chat.replyMaster.replyingTo?.id;if(t?.conversation?.d?.uuid){const e=t.container?.querySelector(".mw-chat-input");e&&(e.value="");}t.chat.fileMaster.clearFile(),t.chat.replyMaster.clearReply(),await(t?.chat.sendMessage(e,{file:r,replyTo:o}));}else console.error("Widget instance not found");}}},checkIfUserHasPhoneNumber=()=>{const e=window.getMWidget?.();return !!e?.customerData?.hasSubmittedPhoneForm()||(switchToPhoneNumberFormView(),false)},switchToPhoneNumberFormView=()=>{const e=window.getMWidget?.().container?.querySelector(".mw-form-overlay");e&&(e.classList.remove("mw-hidden"),e.classList.add("mw-active"));},submitPhoneNumberForm=e=>{const t=e.replace(/[۰-۹٠-٩]/g,e=>{const t="۰۱۲۳۴۵۶۷۸۹".indexOf(e);if(t>-1)return String(t);const r="٠١٢٣٤٥٦٧٨٩".indexOf(e);return r>-1?String(r):e});if(""===t.trim()||PhoneNumberRegex.test(t)){const t=window.getMWidget?.();if(t){t.customerData.savePhoneNumber(e.trim()||void 0);const r=t.container?.querySelector(".mw-form-overlay");r&&(r.classList.remove("mw-active"),r.classList.add("mw-hidden")),t.container?.querySelector(".mw-send-message-btn")?.click();}else console.error("Widget instance not found");}else alert("لطفا شماره تلفن معتبر وارد کنید یا فیلد را خالی بگذارید.");};

const registerListeners=e=>{let t=e.querySelector(".mw-chat-body");const r=e.querySelector(".mw-toggle-chat-btn");let s=false;const i=e.querySelector(".mw-footer-link");if(i){const e=window.getMWidget?.();i.href=`https://modochats.com?utm_source=${encodeURIComponent(window.location.origin)}`,i.title=`مودوچت v${e?.version||"0.1"}`;}r&&r.addEventListener("click",()=>{const e=window.getMWidget?.();s=!s,s?e?.onOpen():e?.onClose(),t?.classList.toggle("mw-hidden"),r.classList.toggle("mw-chat-open",s);},{capture:false}),registerSendMessageListener(e),registerPhoneNumberFormListeners(e),registerNewConversationListener(e),registerFileUploadListener(e),registerReplyPreviewListener(e),registerTooltipCloseListener(e);},registerSendMessageListener=e=>{const t=e.querySelector(".mw-chat-input"),r=e.querySelector(".mw-send-message-btn");let s=false;function i(){s=!s,t.disabled=s,r.disabled=s,r.setAttribute("data-is-loading",String(s));}t.addEventListener("keydown",e=>{if("Enter"===e.key){e.preventDefault();const r=t.value;i(),sendMessage(r).then(()=>{t.value="";}).finally(i);}}),r.addEventListener("click",e=>{e.preventDefault();const r=t.value;i(),sendMessage(r).then(()=>{t.value="";}).finally(i);});},registerPhoneNumberFormListeners=e=>{const t=e.querySelector(".mw-form-overlay"),r=e.querySelector(".mw-phone-input"),s=e.querySelector(".mw-form-submit-btn"),i=e.querySelector(".mw-form-cancel-btn");s.addEventListener("click",()=>{const e=r.value;submitPhoneNumberForm(e);}),i.addEventListener("click",()=>{t.classList.add("mw-hidden");});},registerNewConversationListener=e=>{e.querySelector(".mw-new-conversation-btn").addEventListener("click",()=>{const e=window.getMWidget?.();e&&e.chat.clear();});},registerFileUploadListener=e=>{const t=e.querySelector(".mw-file-upload-btn"),r=e.querySelector(".mw-file-input"),s=window?.getMWidget?.();t.addEventListener("click",()=>{s?.chat.fileMaster.file?s?.chat.fileMaster.clearFile():r.click();}),r.addEventListener("change",()=>{r.files&&r.files.length>0&&s?.chat.fileMaster.setFile(r.files[0]);});},registerReplyPreviewListener=e=>{const t=e.querySelector(".mw-reply-preview"),r=e.querySelector(".mw-reply-preview-close"),s=e.querySelector(".mw-reply-preview-info");t&&r&&s&&(r.addEventListener("click",e=>{e.stopPropagation();const t=window.getMWidget?.();t?.chat&&t.chat.replyMaster.clearReply();}),s.addEventListener("click",()=>{const t=window.getMWidget?.(),r=getMessageElement(t?.chat.replyMaster.replyingTo||{});if(r){e.querySelector(".mw-chat-messages-con")&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("mw-message-highlight"),setTimeout(()=>{r?.classList.remove("mw-message-highlight");},2e3));}}));},registerTooltipCloseListener=e=>{const t=window.getMWidget?.(),r=e.querySelector(".mw-toggle-tooltip-close"),s=e.querySelector(".mw-toggle-tooltip");r&&r.addEventListener("click",e=>{localStorage.setItem(`modochats:${t?.publicKey}-has-seen-greeting-message`,"true"),e.stopPropagation(),s&&s.classList.add("mw-hidden");});};

const createChatContainer=n=>{n.container=document.createElement("div"),n.container.textContent="Start Chat",n.container.classList.add("modo-widget"),n.options.fullScreen&&n.container.classList.add("mw-fullscreen"),document.body.appendChild(n.container);let t=document.createElement("div");n.container.appendChild(t),n.container.innerHTML=`\n  <div dir="rtl" class="mw-chat-inner">\n  <div class="mw-chat-body ${n.options.fullScreen?"mw-active":"mw-hidden"}">\n    <div class="mw-chat-container">\n      \x3c!-- Chat Header --\x3e\n      <div class="mw-chat-header">\n        <div style="display: flex; align-items: center; gap: 8px;">\n          <h3 class="mw-chat-title">پشتیبانی چت</h3>\n          <div class="mw-conversation-status-icon mw-hidden">\n            \x3c!-- Clean AI/Bot icon --\x3e\n            <svg class="mw-ai-chat-icon" style="width: 14px; height: 14px;" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">\x3c!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --\x3e<path fill="currentColor" d="M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1m-1 3h-2v3H5v-3H3v-1h2v-2c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5v2h2zM8.5 13.5l2.36 2.36l-1.18 1.18l-1.18-1.18l-1.18 1.18l-1.18-1.18zm7 0l2.36 2.36l-1.18 1.18l-1.18-1.18l-1.18 1.18l-1.18-1.18z"/></svg>\n            \x3c!-- Clean Human/Person icon --\x3e\n            <svg class="mw-human-chat-icon" viewBox="0 0 24 24" width="18" height="18">\n              <path fill="currentColor" d="M12 4C13.66 4 15 5.34 15 7C15 8.66 13.66 10 12 10C10.34 10 9 8.66 9 7C9 5.34 10.34 4 12 4ZM12 12C15.31 12 18 13.34 18 15V18H6V15C6 13.34 8.69 12 12 12Z"/>\n            </svg>\n            <div class="mw-tooltip">\n              <span class="mw-tooltip-text-ai">چت بات هوشمند</span>\n              <span class="mw-tooltip-text-human">پشتیبان انسانی</span>\n            </div>\n          </div>\n          <div class="mw-connection-status mw-disconnected"></div>\n        </div>\n        <div style="display: flex; align-items: center; gap: 8px;">\n          <button class="mw-new-conversation-btn mw-hidden">\n            +\n          </button>\n          <button class="mw-voice-call-btn mw-hidden">\n           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">\x3c!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --\x3e<path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/></svg>\n           <div class="mw-voice-call-tooltip mw-hidden">\n             <div class="mw-voice-call-tooltip-text">مکالمه با هوش مصنوعی</div>\n            </div>\n          </button>\n        </div>\n      </div>\n\n      <div class="mw-chat-messages-con">\n      </div> \n      <div class="mw-starters-con">\n        <div class="mw-starter-welcome">\n          <img class="mw-starter-logo" src="" alt="لوگو چت بات" style="display: none;">\n          <h2 class="mw-starter-title">پشتیبانی چت</h2>\n        </div>\n        <div class="mw-starter-items">\n        </div>\n      </div>\n\n      <div class="mw-reply-preview mw-hidden">\n        <div class="mw-reply-preview-content">\n          <div class="mw-reply-preview-info">\n            <span class="mw-reply-preview-label">پاسخ به:</span>\n            <span class="mw-reply-preview-text"></span>\n          </div>\n          <button class="mw-reply-preview-close" title="لغو پاسخ">\n            <svg viewBox="0 0 24 24" width="16" height="16">\n              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>\n            </svg>\n          </button>\n        </div>\n      </div>\n\n      <div class="mw-chat-input-area">\n        <input type="text" placeholder="پیام خود را تایپ کنید..." class="mw-chat-input">\n        <button class="mw-file-upload-btn" title="آپلود فایل">\n          <input type="file" class="mw-file-input" hidden />\n          <svg class="mw-file-upload-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">\x3c!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --\x3e<path fill="currentColor" d="M16.346 11.385V6.769h1v4.616zm-5.538 5.457q-.452-.269-.726-.734q-.274-.466-.274-1.031V6.769h1zM11.96 21q-2.271 0-3.846-1.595t-1.575-3.867v-8.73q0-1.587 1.09-2.697Q8.722 3 10.309 3t2.678 1.11t1.091 2.698V14h-1V6.789q-.006-1.166-.802-1.977T10.308 4q-1.163 0-1.966.821q-.804.821-.804 1.987v8.73q-.005 1.853 1.283 3.157Q10.11 20 11.961 20q.556 0 1.056-.124t.945-.372v1.11q-.468.2-.972.293q-.505.093-1.03.093m4.386-1v-2.616h-2.615v-1h2.615V13.77h1v2.615h2.616v1h-2.616V20z"/></svg>\n          <svg class="mw-file-remove-icon mw-hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">\x3c!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --\x3e<path fill="currentColor" d="M11.962 21q-2.273 0-3.848-1.594t-1.575-3.867V7.954L2.091 3.508L2.8 2.8l18.4 18.4l-.708.708l-3.805-3.806q-.664 1.298-1.913 2.098t-2.812.8M7.539 8.954v6.584q-.006 1.852 1.282 3.157T11.961 20q1.356 0 2.413-.727t1.574-1.91l-1.98-1.98q-.087.742-.656 1.295q-.568.553-1.35.553q-.881 0-1.518-.627q-.636-.627-.636-1.527v-3.854zm3.269 3.269v2.854q0 .479.328.816q.328.338.806.338q.474 0 .801-.335t.334-.808v-.596zm5.538 1.33V6.77h1v7.804zm-3.269-3.307V6.79q-.006-1.166-.805-1.977T10.308 4q-.708 0-1.281.32q-.573.319-.961.857l-.714-.713q.529-.68 1.285-1.072T10.307 3q1.587 0 2.679 1.11t1.091 2.698v4.458zm-2.27-3.477v1.189l-1-1.02V6.77z"/></svg>\n        </button>\n        <button class="mw-send-message-btn" data-is-loading="false">\n          <svg class="mw-send-icon" viewBox="0 0 24 24">\n            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>\n          </svg>\n          <span class="mw-btn-loading">\n            <svg class="mw-loading-spinner" viewBox="0 0 24 24">\n              <circle class="mw-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>\n              <path class="mw-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n            </svg>\n          </span>\n        </button>\n      </div>\n\n      <div class="mw-form-overlay mw-hidden">\n        <div class="mw-form-content">\n          <h3 class="mw-form-title">اطلاعات تماس</h3>\n          <p class="mw-form-subtitle">لطفا برای اطلاع رسانی بهتر پیام ها شماره خود را وارد کنید (اختیاری)</p>\n          <div class="mw-form-input-area">\n            <input type="tel" placeholder="شماره تلفن (اختیاری)" class="mw-phone-input">\n          </div>\n          <div class="mw-form-buttons">\n            <button class="mw-form-submit-btn">\n              ارسال\n            </button>\n            <button class="mw-form-cancel-btn">\n              لغو\n            </button>\n          </div>\n        </div>\n      </div>\n\n      \x3c!-- Chat Footer --\x3e\n      <div class="mw-chat-footer">\n        <span class="mw-footer-text">ساخته شده با </span>\n        <a href="" class="mw-footer-link" target="_blank" rel="noopener noreferrer" title="">مودوچت</a>\n      </div>\n\n      \x3c!-- Voice Agent Overlay --\x3e\n      <div class="mw-voice-agent-overlay mw-hidden">\n        <div class="mw-voice-agent-content">\n          <button class="mw-voice-close-btn">\n            <svg viewBox="0 0 24 24" width="24" height="24">\n              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>\n            </svg>\n          </button>\n          \n          <div class="mw-voice-agent-center">\n            <img class="mw-voice-agent-logo" src="" alt="چت بات" />\n            <h2 class="mw-voice-agent-title">تماس صوتی</h2>\n            <p class="mw-voice-agent-status">درحال اتصال...</p>\n          </div>\n\n          <div class="mw-voice-agent-controls">\n            <button class="mw-voice-disconnect-btn" title="قطع تماس">\n              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">\x3c!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --\x3e<path fill="currentColor" d="M231.59 90.13C175.44 34 80.56 34 24.41 90.13c-20 20-21.92 49.49-4.69 71.71A16 16 0 0 0 32.35 168a15.8 15.8 0 0 0 5.75-1.08l49-17.37l.29-.11a16 16 0 0 0 9.75-11.73l5.9-29.52a76.52 76.52 0 0 1 49.68-.11l6.21 29.75a16 16 0 0 0 9.72 11.59l.29.11l49 17.39a16 16 0 0 0 18.38-5.06c17.19-22.24 15.26-51.73-4.73-71.73M223.67 152l-.3-.12l-48.82-17.33l-6.21-29.74A16 16 0 0 0 158 93a92.56 92.56 0 0 0-60.34.13a16 16 0 0 0-10.32 12l-5.9 29.51l-48.81 17.22c-.1 0-.17.13-.27.17c-12.33-15.91-11-36.23 3.36-50.58c25-25 58.65-37.53 92.28-37.53s67.27 12.51 92.28 37.53c14.33 14.35 15.72 34.67 3.39 50.55m.32 48a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"/></svg>\n            </button>\n          </div>\n        </div>\n      </div>\n    </div> \n  </div>\n  ${n.options.fullScreen?"":'\n    <button class="mw-toggle-chat-btn">\n      <img\n        class="mw-chat-toggle-image"\n        src=""\n        alt="شروع گفتگو" />\n      <svg\n        class="mw-chat-toggle-close"\n        viewBox="0 0 24 24"\n        width="24"\n        height="24">\n        <path\n          fill="currentColor"\n          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />\n      </svg>\n      \x3c!-- Badge for unread messages --\x3e\n      <div class="mw-badge mw-hidden">\n        <span class="mw-badge-text">0</span>\n      </div>\n      \x3c!-- Tooltip for toggle button --\x3e\n      <div class="mw-toggle-tooltip mw-hidden">\n        <div class="mw-tooltip-inner">\n          <div\n            class="mw-toggle-tooltip-close"\n            title="بستن">\n            <svg\n              viewBox="0 0 24 24"\n              width="16"\n              height="16">\n              <path\n                fill="currentColor"\n                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />\n            </svg>\n          </div>\n          <span class="mw-toggle-tooltip-text">شروع گفتگو</span>\n        </div>\n      </div>\n    </button>\n  '}\n  </div>\n  `,registerListeners(n.container);};

const generateUUID=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(x){const e=16*Math.random()|0;return ("x"===x?e:3&e|8).toString(16)});

class CustomerData{_uniqueId;_userData;widget;phoneNumber;constructor(e,t){this.widget=e,this.initializeUniqueId(),this.updateUserData(t),this.initializePhoneNumber();}initializePhoneNumber(){const e=localStorage.getItem(`modo-chat:${this.widget.publicKey}-user-phone-number`);e&&(this.phoneNumber=e);}initializeUniqueId(){const e=localStorage.getItem(`modo-chat:${this.widget.publicKey}-user-unique-id`);e?this._uniqueId=e:(this._uniqueId=crypto.randomUUID?crypto.randomUUID():generateUUID(),localStorage.setItem(`modo-chat:${this.widget.publicKey}-user-unique-id`,this._uniqueId));}get uniqueId(){return this._uniqueId}get userData(){return this._userData||{}}async updateUserData(e){e&&"object"==typeof e?this._userData=e:e&&console.warn("Invalid user data");}hasSubmittedPhoneForm(){return Boolean(this.phoneNumber)}savePhoneNumber(e){this.phoneNumber=e||"no phone number",localStorage.setItem(`modo-chat:${this.widget.publicKey}-user-phone-number`,e||"no phone number");}async fetchUpdate(){await fetchUpdateUserData(this.widget.chatbot?.uuid,this.uniqueId,this.userData);}}

function switchToConversationLayout(){const t=window.getMWidget?.();t?.container?.querySelector(".mw-new-conversation-btn")?.classList.remove("mw-hidden"),t?.container?.querySelector(".mw-starters-con")?.classList.add("mw-hidden");}function switchToStarterLayout(){const t=window.getMWidget?.();t?.container?.querySelector(".mw-new-conversation-btn")?.classList.add("mw-hidden"),t?.container?.querySelector(".mw-starters-con")?.classList.remove("mw-hidden"),t?.container?.querySelector(".mw-conversation-status-icon")?.classList.add("mw-hidden");}function setConversationType(t){const e=window.getMWidget?.();e?.container?.querySelector(".mw-conversation-status-icon")?.classList.remove("mw-hidden");const o=e?.container?.querySelector(".mw-conversation-status-icon");o&&(o.classList.remove("mw-ai-mode","mw-human-mode"),"AI_CHAT"===t?o.classList.add("mw-ai-mode"):o.classList.add("mw-human-mode"));}function loadStarters(){const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-starters-con"),o=t?.container?.querySelector(".mw-starter-items");e?.classList.remove("mw-hidden");for(const e of t?.chatbot?.starters||[]){const n=document.createElement("div");n.className="mw-starter-item",n.textContent=e,n.addEventListener("click",async()=>{const o=t?.container?.querySelector(".mw-chat-input"),n=t?.container?.querySelector(".mw-send-message-btn");switchToConversationLayout(),o&&(o.value=e,n.click());}),o?.appendChild(n);}}function updateChatToggleImage(){const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-chat-toggle-image"),o=t?.container?.querySelector(".mw-starter-logo"),n="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.9 23 5 23H11V21H5V3H13V9H21ZM23 18V16H15V18L19 22L15 26V28H23V26H19L23 22L19 18H23Z'/%3E%3C/svg%3E";e&&(t?.chatbot?.image?(e.src=t.chatbot.image,e.alt=t.chatbot.name||"شروع گفتگو",e.onerror=()=>{e.src=n,e.alt="پشتیبانی چت";}):(e.src=n,e.alt="پشتیبانی چت")),o&&(t?.chatbot?.image?(o.src=t.chatbot.image,o.alt=t.chatbot.name||"لوگو چت بات",o.style.display="block",o.onerror=()=>{o.style.display="none";}):o.style.display="none");}function updateChatTitle(){const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-chat-title"),o=t?.container?.querySelector(".mw-starter-title");if(e||o){const n=t?.options?.title||t?.chatbot?.name||"Modo";e&&(e.textContent=n),o&&(o.textContent=n);}}function applyModoOptions(){const t=window.getMWidget?.();if(!t?.container||!t?.options)return;const e=t.container,o=t.options;applyPositionOption(e,o.position),applyThemeOption(e,o.theme),applyPrimaryColorOption(e,o.primaryColor),applyForegroundColorOption(e,o.foregroundColor);}function applyPositionOption(t,e){const o=window.getMWidget?.()?.container;if(o)if("left"===e){o.style.right="auto",o.style.left="32px",o.style.direction="ltr";const t=o.querySelector(".mw-chat-body");t&&(t.style.right="auto",t.style.left="0");}else {const t=o.querySelector(".mw-chat-body");t&&(t.style.left="auto",t.style.right="0");}}function applyThemeOption(t,e){const o=document.querySelector(".modo-widget");"light"===e?o?.setAttribute("data-theme","light"):o?.removeAttribute("data-theme"),localStorage.setItem("modo-component:theme",e);}function applyPrimaryColorOption(t,e){const o=document.querySelector(".modo-widget");if(o){o?.style.setProperty("--primary-color",e);const t=adjustColorBrightness(e,-20);o?.style.setProperty("--primary-hover",t);const n=adjustColorBrightness(e,15);o?.style.setProperty("--primary-gradient",`linear-gradient(135deg, ${e} 0%, ${n} 100%)`);}else console.error("modo chat widget not found");}function applyForegroundColorOption(t,e){const o=document.querySelector(".modo-widget");o?(o?.style.setProperty("--foreground-color",e),o?.style.setProperty("--white",e)):console.error("modo chat widget not found");}function adjustColorBrightness(t,e){t=t.replace(/^#/,"");const o=parseInt(t,16),n=Math.round(2.55*e),r=(o>>16)+n,a=(o>>8&255)+n,s=(255&o)+n;return `#${(Math.max(0,Math.min(255,r))<<16|Math.max(0,Math.min(255,a))<<8|Math.max(0,Math.min(255,s))).toString(16).padStart(6,"0")}`}async function loadCss(){return await new Promise(t=>{const e=document.createElement("link"),o=isDev$1?"/css/index.css":"https://cdn.jsdelivr.net/gh/modochats/webcomponent@latest/live/css/index.css";e.rel="stylesheet",e.href=o,document.head.appendChild(e),e.addEventListener("load",()=>{t("css loaded");});})}

// src/services/emitter/event-emitter.ts
var EventEmitter$1 = class EventEmitter {
  constructor() {
    this.listeners = {};
    this.onceListeners = {};
    this.wildcardListeners = /* @__PURE__ */ new Set();
  }
  on(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = /* @__PURE__ */ new Set();
    }
    this.listeners[eventType].add(listener);
    return () => this.off(eventType, listener);
  }
  once(eventType, listener) {
    if (!this.onceListeners[eventType]) {
      this.onceListeners[eventType] = /* @__PURE__ */ new Set();
    }
    this.onceListeners[eventType].add(listener);
    return () => this.offOnce(eventType, listener);
  }
  off(eventType, listener) {
    const listeners = this.listeners[eventType];
    if (listeners) {
      listeners.delete(listener);
    }
  }
  offOnce(eventType, listener) {
    const listeners = this.onceListeners[eventType];
    if (listeners) {
      listeners.delete(listener);
    }
  }
  onAny(listener) {
    this.wildcardListeners.add(listener);
    return () => this.offAny(listener);
  }
  offAny(listener) {
    this.wildcardListeners.delete(listener);
  }
  async emit(event) {
    const regularListeners = this.listeners[event.type];
    if (regularListeners) {
      const promises = Array.from(regularListeners).map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
    const onceListeners = this.onceListeners[event.type];
    if (onceListeners) {
      const listeners = Array.from(onceListeners);
      onceListeners.clear();
      const promises = listeners.map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
    if (this.wildcardListeners.size > 0) {
      const promises = Array.from(this.wildcardListeners).map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
  }
  async safeInvoke(listener, event) {
    try {
      await listener(event);
    } catch (error) {
      console.error(`Error in event listener for ${event.type}:`, error);
    }
  }
  removeAllListeners(eventType) {
    if (eventType) {
      delete this.listeners[eventType];
      delete this.onceListeners[eventType];
    } else {
      this.listeners = {};
      this.onceListeners = {};
      this.wildcardListeners.clear();
    }
  }
  listenerCount(eventType) {
    const regular = this.listeners[eventType]?.size || 0;
    const once = this.onceListeners[eventType]?.size || 0;
    return regular + once;
  }
  hasListeners(eventType) {
    if (eventType) {
      return this.listenerCount(eventType) > 0;
    }
    return Object.keys(this.listeners).length > 0 || Object.keys(this.onceListeners).length > 0 || this.wildcardListeners.size > 0;
  }
  getEventTypes() {
    const types = /* @__PURE__ */ new Set();
    Object.keys(this.listeners).forEach((key) => types.add(key));
    Object.keys(this.onceListeners).forEach((key) => types.add(key));
    return Array.from(types);
  }
};

// src/services/shared/types/events.ts
var EventType$1 = /* @__PURE__ */ ((EventType2) => {
  EventType2["CONNECTED"] = "connected";
  EventType2["DISCONNECTED"] = "disconnected";
  EventType2["CONNECTION_ERROR"] = "connection_error";
  EventType2["TURN_CHANGED"] = "turn_changed";
  EventType2["MICROPHONE_PAUSED"] = "microphone_paused";
  EventType2["MICROPHONE_RESUMED"] = "microphone_resumed";
  EventType2["AI_PLAYBACK_CHUNK"] = "ai_playback_chunk";
  EventType2["ERROR"] = "error";
  EventType2["WARNING"] = "warning";
  EventType2["INFO"] = "info";
  EventType2["DEBUG"] = "debug";
  return EventType2;
})(EventType$1 || {});

// src/services/web-socket/service.ts
var WebSocketService = class {
  constructor(config, eventEmitter, connectionState) {
    this.ws = null;
    this.pingInterval = null;
    this.reconnectAttempt = 0;
    this.intentionalDisconnect = false;
    this.turn = "Ai";
    this.config = config;
    this.eventEmitter = eventEmitter;
    this.connectionState = connectionState;
  }
  async connect() {
    if (this.connectionState.isConnected() || this.connectionState.isConnecting()) {
      return;
    }
    this.intentionalDisconnect = false;
    this.connectionState.setState("connecting" /* CONNECTING */);
    try {
      const url = this.buildWebSocketURL();
      this.ws = new WebSocket(url);
      this.ws.binaryType = "arraybuffer";
      await this.setupWebSocket();
    } catch (error) {
      this.connectionState.setState("error" /* ERROR */);
      await this.eventEmitter.emit({
        type: "connection_error" /* CONNECTION_ERROR */,
        timestamp: Date.now(),
        error,
        message: error.message
      });
      throw error;
    }
  }
  buildWebSocketURL() {
    const protocol = this.config.url.startsWith("https") ? "wss" : "ws";
    const host = this.config.url.replace(/^https?:\/\//, "");
    const params = new URLSearchParams({
      chatbot_uuid: this.config.chatbotUuid,
      user_unique_id: this.config.userUniqueId
    });
    return `${protocol}://${host}/ws/modo-live?${params.toString()}`;
  }
  setupWebSocket() {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error("WebSocket not initialized"));
        return;
      }
      const connectionTimeout = setTimeout(() => {
        reject(new Error("Connection timeout"));
        this.disconnect();
      }, this.config.connectionTimeout || 1e4);
      this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        this.connectionState.setState("connected" /* CONNECTED */);
        this.connectionState.resetReconnectAttempts();
        this.startPingInterval();
        this.eventEmitter.emit({
          type: "connected" /* CONNECTED */,
          timestamp: Date.now(),
          chatbotUuid: this.config.chatbotUuid,
          userUniqueId: this.config.userUniqueId
        });
        resolve();
      };
      this.ws.onerror = (event) => {
        clearTimeout(connectionTimeout);
        this.eventEmitter.emit({
          type: "error" /* ERROR */,
          timestamp: Date.now(),
          error: new Error("WebSocket error"),
          message: "WebSocket connection error"
        });
        reject(new Error("WebSocket connection error"));
      };
      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };
      this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        this.handleClose(event);
      };
    });
  }
  async handleMessage(event) {
    this.connectionState.incrementMessagesReceived();
    if (event.data instanceof ArrayBuffer) {
      this.connectionState.addBytesReceived(event.data.byteLength);
      await this.handleBinaryMessage(event.data);
    } else if (typeof event.data === "string") {
      try {
        const message = JSON.parse(event.data);
        await this.handleTextMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    }
  }
  async handleBinaryMessage(data) {
    await this.eventEmitter.emit({
      type: "ai_playback_chunk" /* AI_PLAYBACK_CHUNK */,
      timestamp: Date.now(),
      data: new Uint8Array(data),
      size: data.byteLength,
      totalReceived: this.connectionState.getMetrics().bytesReceived
    });
  }
  async handleTextMessage(message) {
    switch (message.type) {
      case "TURN" /* TURN */:
        const turnMsg = message;
        if (turnMsg.message && "turn" in turnMsg.message) {
          const turn = turnMsg.message.turn;
          this.turn = turn === "ai" ? "Ai" : "User";
          await this.eventEmitter.emit({
            type: "turn_changed" /* TURN_CHANGED */,
            timestamp: Date.now(),
            turn
          });
        }
        break;
      case "error" /* ERROR */:
        if (message.data && typeof message.data === "object" && "message" in message.data) {
          await this.eventEmitter.emit({
            type: "error" /* ERROR */,
            timestamp: Date.now(),
            error: new Error(message.data.message),
            message: message.data.message
          });
        }
        break;
    }
  }
  handleClose(event) {
    this.stopPingInterval();
    this.connectionState.setLastError({
      code: event.code,
      reason: event.reason,
      timestamp: Date.now(),
      wasClean: event.wasClean
    });
    this.eventEmitter.emit({
      type: "disconnected" /* DISCONNECTED */,
      timestamp: Date.now(),
      reason: event.reason,
      code: event.code
    });
    if (!this.intentionalDisconnect && this.config.reconnect && this.reconnectAttempt < (this.config.maxReconnectAttempts || 5)) {
      this.scheduleReconnect();
    } else {
      this.connectionState.setState("disconnected" /* DISCONNECTED */);
    }
  }
  scheduleReconnect() {
    this.reconnectAttempt++;
    this.connectionState.incrementReconnectAttempts();
    const delay = this.config.reconnectDelay || 1e3;
    const timer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
    this.connectionState.setReconnectTimer(timer);
  }
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }
    this.ws.send(data);
    this.connectionState.incrementMessagesSent();
    const byteSize = Math.ceil(data.length * 0.75);
    this.connectionState.addBytesSent(byteSize);
  }
  disconnect() {
    if (!this.ws) return;
    this.intentionalDisconnect = true;
    this.connectionState.setState("disconnecting" /* DISCONNECTING */);
    this.stopPingInterval();
    this.connectionState.clearReconnectTimer();
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close(1e3, "Client disconnect");
    }
    this.ws = null;
    this.connectionState.setState("disconnected" /* DISCONNECTED */);
    this.reconnectAttempt = 0;
  }
  startPingInterval() {
    return;
  }
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  isConnected() {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
  getReadyState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
};

// src/services/shared/types/config.ts
var DEFAULT_CONFIG = {
  audio: {
    constraints: {
      sampleRate: 16e3,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    },
    minBufferSize: 32e3,
    targetChunks: 16,
    chunkSize: 1024,
    playbackRetryInterval: 10,
    playbackRetryMaxAttempts: 50,
    resumeDelay: 150,
    failsafeResumeTimeout: 1e4
  },
  websocket: {
    reconnect: false,
    // Disabled by default, original client doesn't auto-reconnect
    maxReconnectAttempts: 5,
    reconnectDelay: 1e3,
    reconnectBackoffMultiplier: 1.5,
    maxReconnectDelay: 3e4,
    pingInterval: 3e4,
    pongTimeout: 5e3,
    connectionTimeout: 1e4,
    binaryType: "arraybuffer"
  }
};

// src/services/audio/input-processor.ts
var AudioInputProcessor = class {
  constructor(config, eventEmitter) {
    this.playbackState = "idle" /* IDLE */;
    this.recordingState = "idle" /* IDLE */;
    this.audioQueue = [];
    this.audioBuffer = [];
    this.audioBufferSize = 0;
    this.isStreamingComplete = false;
    this.currentAudioElement = null;
    this.recordingStartTime = 0;
    this.playbackStartTime = 0;
    this.totalBytesReceived = 0;
    this.totalBytesSent = 0;
    this.playbackRetryTimer = null;
    this.config = config;
    this.eventEmitter = eventEmitter;
  }
  getPlaybackState() {
    return this.playbackState;
  }
  setPlaybackState(state) {
    this.playbackState = state;
  }
  getRecordingState() {
    return this.recordingState;
  }
  setRecordingState(state) {
    this.recordingState = state;
    if (state === "recording" /* RECORDING */) {
      this.recordingStartTime = Date.now();
    }
  }
  isPlaying() {
    return this.playbackState === "playing" /* PLAYING */;
  }
  isRecording() {
    return this.recordingState === "recording" /* RECORDING */;
  }
  addToQueue(chunk) {
    this.audioQueue.push(chunk);
  }
  getQueue() {
    return this.audioQueue;
  }
  clearQueue() {
    this.audioQueue = [];
  }
  addToBuffer(chunk) {
    this.audioBuffer.push(chunk);
    this.audioBufferSize += chunk.byteLength;
    this.totalBytesReceived += chunk.byteLength;
  }
  getBuffer() {
    return this.audioBuffer;
  }
  getBufferSize() {
    return this.audioBufferSize;
  }
  getBufferInfo() {
    return {
      chunks: this.audioBuffer.length,
      totalBytes: this.audioBufferSize,
      duration: this.audioBufferSize / (this.config.constraints.sampleRate * 2),
      isStreaming: !this.isStreamingComplete
    };
  }
  clearBuffer() {
    this.audioBuffer = [];
    this.audioBufferSize = 0;
    this.isStreamingComplete = false;
  }
  setStreamingComplete(complete) {
    this.isStreamingComplete = complete;
  }
  isStreamComplete() {
    return this.isStreamingComplete;
  }
  setCurrentAudioElement(element) {
    this.currentAudioElement = element;
    if (element) {
      this.playbackStartTime = Date.now();
    }
  }
  getCurrentAudioElement() {
    return this.currentAudioElement;
  }
  getPlaybackMetrics() {
    if (!this.currentAudioElement) return null;
    return {
      currentTime: this.currentAudioElement.currentTime,
      duration: this.currentAudioElement.duration,
      buffered: this.currentAudioElement.buffered,
      readyState: this.currentAudioElement.readyState,
      networkState: this.currentAudioElement.networkState
    };
  }
  getRecordingMetrics() {
    return {
      startTime: this.recordingStartTime,
      duration: this.recordingStartTime ? Date.now() - this.recordingStartTime : 0,
      totalBytes: this.totalBytesSent,
      sampleRate: this.config.constraints.sampleRate,
      channelCount: 1
    };
  }
  addBytesSent(bytes) {
    this.totalBytesSent += bytes;
  }
  getTotalBytesReceived() {
    return this.totalBytesReceived;
  }
  getTotalBytesSent() {
    return this.totalBytesSent;
  }
  async handleIncomingAudioChunk(unit8Array) {
    this.addToBuffer(unit8Array);
    if (!this.isPlaying()) {
      try {
        await this.attemptPlayback();
      } catch (error) {
        console.error("Error during playback attempt:", error);
      }
    }
  }
  async attemptPlayback() {
    const bufferInfo = this.getBufferInfo();
    const minSize = this.isPlaying() ? this.config.minBufferSize * 0.75 : this.config.minBufferSize;
    const minChunks = this.isPlaying() ? this.config.targetChunks * 0.75 : this.config.targetChunks;
    const shouldStart = bufferInfo.totalBytes >= minSize || bufferInfo.chunks >= minChunks || this.isStreamComplete() && bufferInfo.totalBytes > 0;
    if (shouldStart) {
      await this.playNextSegment();
    } else if (!this.playbackRetryTimer) {
      this.playbackRetryTimer = setTimeout(() => {
        this.playbackRetryTimer = null;
        this.attemptPlayback();
      }, this.config.playbackRetryInterval);
    }
  }
  async playNextSegment() {
    if (this.playbackRetryTimer) {
      clearTimeout(this.playbackRetryTimer);
      this.playbackRetryTimer = null;
    }
    const buffer = this.getBuffer();
    if (buffer.length === 0) {
      await this.completePlayback();
      return;
    }
    this.eventEmitter.emit({
      type: "microphone_paused" /* MICROPHONE_PAUSED */,
      timestamp: Date.now()
    });
    const combined = this.combineBuffers(buffer);
    this.clearBuffer();
    const blob = new Blob([combined.buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    this.setCurrentAudioElement(audio);
    this.setPlaybackState("playing" /* PLAYING */);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      Promise.resolve().then(() => {
        this.playNextSegment();
      });
    };
    audio.onerror = (error) => {
      URL.revokeObjectURL(url);
    };
    try {
      await audio.play();
    } catch (error) {
      console.error("Failed to start audio playback:", error);
    }
  }
  combineBuffers(buffers) {
    const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.byteLength;
    }
    return result;
  }
  async setStreamComplete() {
    this.setStreamingComplete(true);
    if (this.getBufferSize() > 0 && !this.isPlaying()) {
      await this.playNextSegment();
    }
  }
  async completePlayback() {
    this.eventEmitter.emit({
      type: "microphone_resumed" /* MICROPHONE_RESUMED */,
      timestamp: Date.now()
    });
    this.setPlaybackState("completed" /* COMPLETED */);
  }
  reset() {
    if (this.playbackRetryTimer) {
      clearTimeout(this.playbackRetryTimer);
    }
    this.playbackState = "idle" /* IDLE */;
    this.recordingState = "idle" /* IDLE */;
    this.audioQueue = [];
    this.audioBuffer = [];
    this.audioBufferSize = 0;
    this.isStreamingComplete = false;
    this.currentAudioElement = null;
    this.recordingStartTime = 0;
    this.playbackStartTime = 0;
  }
  resetPlayback() {
    this.playbackState = "idle" /* IDLE */;
    this.audioQueue = [];
    this.audioBuffer = [];
    this.audioBufferSize = 0;
    this.isStreamingComplete = false;
    this.currentAudioElement = null;
    this.playbackStartTime = 0;
    if (this.playbackRetryTimer) {
      clearTimeout(this.playbackRetryTimer);
    }
  }
  resetRecording() {
    this.recordingState = "idle" /* IDLE */;
    this.recordingStartTime = 0;
    this.totalBytesSent = 0;
  }
};

// src/services/audio/output-processor.ts
var AudioOutputProcessor = class {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.mediaStreamSource = null;
    this.scriptProcessorNode = null;
    this.recordedChunks = [];
    this.bufferSize = 4096;
    this.actualNumChannels = 0;
    this.chunkAddCounter = 0;
    this.getVolume = () => 0;
  }
  init({
    audioContext,
    mediaStream,
    tempChunkCreateCallback,
    getVolume
  }) {
    this.recordedChunks = [];
    this.tempChunkCreateCallback = tempChunkCreateCallback;
    if (getVolume) {
      this.getVolume = getVolume;
    }
    try {
      this.audioContext = audioContext;
      this.mediaStream = mediaStream;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      const audioTrack = this.mediaStream.getAudioTracks()[0];
      const trackSettings = audioTrack.getSettings();
      this.actualNumChannels = trackSettings.channelCount || this.mediaStreamSource.channelCount || 1;
      this.scriptProcessorNode = this.audioContext.createScriptProcessor(this.bufferSize, this.actualNumChannels, this.actualNumChannels);
      this.scriptProcessorNode.onaudioprocess = (event) => {
        const volume = this.getVolume();
        this.addChunk(event);
        if (this.chunkAddCounter >= 3) {
          this.processAndEncode({ processAll: false });
          this.chunkAddCounter = 0;
        }
      };
      this.mediaStreamSource.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.audioContext.destination);
    } catch (err) {
      console.error("Generator: Error starting recording:", err);
      this.processAndEncode();
    }
  }
  async addChunk(event) {
    const inputBuffer = event.inputBuffer;
    const bufferChannels = [];
    for (let i = 0; i < this.actualNumChannels; i++) {
      bufferChannels.push(new Float32Array(inputBuffer.getChannelData(i)));
    }
    this.recordedChunks.push(bufferChannels);
    this.chunkAddCounter++;
  }
  async reset() {
    await this.processAndEncode();
    this.recordedChunks = [];
    this.chunkAddCounter = 0;
  }
  async processAndEncode({ processAll } = { processAll: true }) {
    if (this.recordedChunks.length === 0) return;
    const chunksCopy = [...this.recordedChunks];
    const chunksToProcess = processAll ? chunksCopy : chunksCopy.slice(-3);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const numberOfChannels = chunksToProcess[0].length;
          const totalLength = chunksToProcess.reduce((sum, chunks) => sum + chunks[0].length, 0);
          const combinedChannels = [];
          for (let i = 0; i < numberOfChannels; i++) {
            const channelData = new Float32Array(totalLength);
            let offset = 0;
            chunksToProcess.forEach((buffer, index) => {
              channelData.set(buffer[i], offset);
              offset += buffer[i].length;
            });
            combinedChannels.push(channelData);
          }
          if (processAll) this.recordedChunks = [];
          const targetNumChannels = parseInt("1", 10);
          let finalChannelData = [];
          if (numberOfChannels === 1 && targetNumChannels === 2) {
            finalChannelData.push(combinedChannels[0]);
            finalChannelData.push(new Float32Array(combinedChannels[0]));
          } else if (numberOfChannels === 2 && targetNumChannels === 1) {
            const monoData = new Float32Array(totalLength);
            for (let i = 0; i < totalLength; i++) {
              monoData[i] = (combinedChannels[0][i] + combinedChannels[1][i]) / 2;
            }
            finalChannelData.push(monoData);
          } else {
            finalChannelData = combinedChannels;
          }
          const outputNumChannels = finalChannelData.length;
          let interleavedData;
          if (outputNumChannels === 1) {
            interleavedData = finalChannelData[0];
          } else {
            interleavedData = new Float32Array(totalLength * 2);
            for (let i = 0; i < totalLength; i++) {
              interleavedData[i * 2] = finalChannelData[0][i];
              interleavedData[i * 2 + 1] = finalChannelData[1][i];
            }
          }
          let outputBuffer;
          const numSamples = interleavedData.length;
          outputBuffer = new Int16Array(numSamples);
          for (let i = 0; i < numSamples; i++) {
            const sample = Math.max(-1, Math.min(1, interleavedData[i]));
            outputBuffer[i] = Math.round(sample * 32767);
          }
          const base64String = arrayBufferToBase64(outputBuffer.buffer);
          resolve(base64String);
          if (!processAll && this.tempChunkCreateCallback) this.tempChunkCreateCallback(base64String);
        } catch (err) {
          reject(err);
        }
      }, 50);
    });
  }
};
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// src/services/audio/service.ts
var AudioService = class {
  constructor(eventEmitter, config) {
    this.sendAudioToServer = null;
    this.volume = 0;
    this.audioContext = null;
    this.mediaStream = null;
    this.micResumeTimeout = null;
    this.micPaused = false;
    this.eventEmitter = eventEmitter;
    this.inputProcessor = new AudioInputProcessor(config, this.eventEmitter);
    this.config = config;
    this.outputProcessor = new AudioOutputProcessor();
  }
  setSendAudioCallback(callback) {
    this.sendAudioToServer = callback;
  }
  async initialize(deviceId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : void 0,
          ...this.config.constraints
        }
      });
      this.mediaStream = stream;
      this.audioContext = new AudioContext({ sampleRate: this.config.constraints.sampleRate });
      await this.audioContext.audioWorklet.addModule("https://moderndata.s3.ir-thr-at1.arvanstorage.ir/audio.js");
      let microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
      const node = new AudioWorkletNode(this.audioContext, "vumeter");
      node.port.onmessage = (event) => {
        let _volume = 0;
        let _sensibility = 5;
        if (event.data.volume) _volume = event.data.volume;
        this.volume = Math.round(_volume * 100 / _sensibility);
      };
      microphone.connect(node).connect(this.audioContext.destination);
      this.audioContext.resume();
      try {
        this.outputProcessor.init({
          audioContext: this.audioContext,
          mediaStream: this.mediaStream,
          tempChunkCreateCallback: (data) => {
            if (this.micPaused) return;
            this.sendAudioToServer?.(data);
          },
          getVolume: () => this.volume
        });
      } catch (err) {
        console.error("Generator: Error starting recording:", err);
      }
      this.inputProcessor.setRecordingState("recording" /* RECORDING */);
    } catch (error) {
      await this.eventEmitter.emit({
        type: "error" /* ERROR */,
        timestamp: Date.now(),
        error,
        message: `Failed to initialize audio: ${error.message}`
      });
      throw error;
    }
  }
  async handleIncomingAudioChunk(unit8Array) {
    this.inputProcessor.handleIncomingAudioChunk(unit8Array);
  }
  async pauseMicrophone() {
    this.micPaused = true;
    this.mediaStream?.getAudioTracks().forEach((track) => track.enabled = false);
  }
  async resumeMicrophone() {
    this.micPaused = false;
    this.mediaStream?.getAudioTracks().forEach((track) => track.enabled = true);
  }
  async getAvailableDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput").map((device) => ({
      deviceId: device.deviceId,
      label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
      kind: device.kind,
      groupId: device.groupId
    }));
  }
  async cleanup() {
    if (this.micResumeTimeout) {
      clearTimeout(this.micResumeTimeout);
    }
    const currentElement = this.inputProcessor.getCurrentAudioElement();
    if (currentElement) {
      currentElement.pause();
      currentElement.src = "";
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      await this.audioContext.close();
      this.audioContext = null;
    }
    this.inputProcessor.reset();
    this.outputProcessor.reset();
  }
};

// src/services/shared/utils/validators.ts
var ValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
};
function validateConfig(config) {
  if (!config.chatbotUuid || typeof config.chatbotUuid !== "string") {
    throw new ValidationError("chatbotUuid is required and must be a string");
  }
  if (!config.userUniqueId || typeof config.userUniqueId !== "string") {
    throw new ValidationError("userUniqueId is required and must be a string");
  }
  if (!config.apiBase || typeof config.apiBase !== "string") {
    throw new ValidationError("apiBase is required and must be a string");
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(config.chatbotUuid)) {
    throw new ValidationError("chatbotUuid must be a valid UUID");
  }
  if (config.audio) {
    validateAudioConfig(config.audio);
  }
  if (config.websocket) {
    validateWebSocketConfig(config.websocket);
  }
}
function validateAudioConfig(config) {
  if (!config) return;
  if (config.constraints) {
    if (config.constraints.sampleRate && config.constraints.sampleRate < 8e3) {
      throw new ValidationError("sampleRate must be at least 8000");
    }
    if (config.constraints.channelCount && config.constraints.channelCount < 1) {
      throw new ValidationError("channelCount must be at least 1");
    }
  }
}
function validateWebSocketConfig(config) {
  if (!config) return;
  if (config.maxReconnectAttempts !== void 0 && config.maxReconnectAttempts < 0) {
    throw new ValidationError("maxReconnectAttempts must be non-negative");
  }
  if (config.reconnectDelay !== void 0 && config.reconnectDelay < 0) {
    throw new ValidationError("reconnectDelay must be non-negative");
  }
  if (config.connectionTimeout !== void 0 && config.connectionTimeout < 1e3) {
    throw new ValidationError("connectionTimeout must be at least 1000ms");
  }
}

// src/services/web-socket/connection-state.ts
var ConnectionState2 = class {
  constructor() {
    this.state = "disconnected" /* DISCONNECTED */;
    this.metrics = {
      duration: 0,
      reconnectAttempts: 0,
      bytesSent: 0,
      bytesReceived: 0,
      messagesSent: 0,
      messagesReceived: 0
    };
    this.lastError = null;
    this.reconnectTimer = null;
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    if (state === "connected" /* CONNECTED */) {
      this.metrics.connectedAt = Date.now();
      this.metrics.reconnectAttempts = 0;
    } else if (state === "disconnected" /* DISCONNECTED */ && this.metrics.connectedAt) {
      this.metrics.disconnectedAt = Date.now();
      this.metrics.duration = this.metrics.disconnectedAt - this.metrics.connectedAt;
    }
  }
  isConnected() {
    return this.state === "connected" /* CONNECTED */;
  }
  isConnecting() {
    return this.state === "connecting" /* CONNECTING */;
  }
  isDisconnected() {
    return this.state === "disconnected" /* DISCONNECTED */;
  }
  isDisconnecting() {
    return this.state === "disconnecting" /* DISCONNECTING */;
  }
  hasError() {
    return this.state === "error" /* ERROR */;
  }
  getMetrics() {
    const current = { ...this.metrics };
    if (this.metrics.connectedAt && !this.metrics.disconnectedAt) {
      current.duration = Date.now() - this.metrics.connectedAt;
    }
    return current;
  }
  incrementReconnectAttempts() {
    this.metrics.reconnectAttempts++;
  }
  getReconnectAttempts() {
    return this.metrics.reconnectAttempts;
  }
  resetReconnectAttempts() {
    this.metrics.reconnectAttempts = 0;
  }
  addBytesSent(bytes) {
    this.metrics.bytesSent += bytes;
  }
  addBytesReceived(bytes) {
    this.metrics.bytesReceived += bytes;
  }
  incrementMessagesSent() {
    this.metrics.messagesSent++;
  }
  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
  }
  setLastError(error) {
    this.lastError = error;
    this.state = "error" /* ERROR */;
  }
  getLastError() {
    return this.lastError;
  }
  clearError() {
    this.lastError = null;
    if (this.state === "error" /* ERROR */) {
      this.state = "disconnected" /* DISCONNECTED */;
    }
  }
  setReconnectTimer(timer) {
    this.clearReconnectTimer();
    this.reconnectTimer = timer;
  }
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  reset() {
    this.state = "disconnected" /* DISCONNECTED */;
    this.metrics = {
      duration: 0,
      reconnectAttempts: 0,
      bytesSent: 0,
      bytesReceived: 0,
      messagesSent: 0,
      messagesReceived: 0
    };
    this.lastError = null;
    this.clearReconnectTimer();
  }
  getDuration() {
    if (this.metrics.connectedAt) {
      const end = this.metrics.disconnectedAt || Date.now();
      return end - this.metrics.connectedAt;
    }
    return 0;
  }
};

// src/app.ts
var VoiceClient = class {
  constructor(config) {
    this.initialized = false;
    validateConfig(config);
    this.config = this.mergeWithDefaults(config);
    this.eventEmitter = new EventEmitter$1();
    this.connectionState = new ConnectionState2();
    this.webSocketService = new WebSocketService(
      {
        url: this.config.apiBase,
        chatbotUuid: this.config.chatbotUuid,
        userUniqueId: this.config.userUniqueId,
        ...this.config.websocket
      },
      this.eventEmitter,
      this.connectionState
    );
    this.audioService = new AudioService(this.eventEmitter, this.config.audio);
    this.audioService.setSendAudioCallback((base64Audio) => {
      if (this.webSocketService.isConnected()) {
        try {
          this.webSocketService.send(base64Audio);
        } catch (error) {
        }
      }
    });
    this.setupInternalListeners();
  }
  mergeWithDefaults(config) {
    return {
      apiBase: config.apiBase,
      chatbotUuid: config.chatbotUuid,
      userUniqueId: config.userUniqueId,
      audio: { ...DEFAULT_CONFIG.audio, ...config.audio },
      websocket: { ...DEFAULT_CONFIG.websocket, ...config.websocket }
    };
  }
  setupInternalListeners() {
    this.eventEmitter.on("ai_playback_chunk" /* AI_PLAYBACK_CHUNK */, async (event) => {
      if ("data" in event && event.data instanceof Uint8Array) {
        await this.audioService.handleIncomingAudioChunk(event.data);
      }
    });
    this.eventEmitter.on("microphone_paused" /* MICROPHONE_PAUSED */, async () => {
      await this.audioService.pauseMicrophone();
    });
    this.eventEmitter.on("microphone_resumed" /* MICROPHONE_RESUMED */, async () => {
      await this.audioService.resumeMicrophone();
    });
    this.eventEmitter.on("turn_changed" /* TURN_CHANGED */, async (event) => {
    });
  }
  async connect(deviceId) {
    if (this.connectionState.isConnected()) {
      return;
    }
    try {
      await this.audioService.initialize(deviceId);
      this.initialized = true;
      await this.webSocketService.connect();
    } catch (error) {
      throw error;
    }
  }
  async disconnect() {
    if (!this.connectionState.isConnected()) {
      return;
    }
    try {
      this.webSocketService.disconnect();
      await this.audioService.cleanup();
      this.initialized = false;
    } catch (error) {
      throw error;
    }
  }
  on(eventType, listener) {
    return this.eventEmitter.on(eventType, listener);
  }
  once(eventType, listener) {
    return this.eventEmitter.once(eventType, listener);
  }
  off(eventType, listener) {
    this.eventEmitter.off(eventType, listener);
  }
  onAny(listener) {
    return this.eventEmitter.onAny(listener);
  }
  offAny(listener) {
    this.eventEmitter.offAny(listener);
  }
  isConnected() {
    return this.connectionState.isConnected();
  }
  isInitialized() {
    return this.initialized;
  }
  getConnectionMetrics() {
    return this.connectionState.getMetrics();
  }
  async getAvailableDevices() {
    return this.audioService.getAvailableDevices();
  }
  getConfig() {
    return { ...this.config };
  }
  updateConfig(updates) {
    if (this.connectionState.isConnected()) {
      throw new Error("Cannot update config while connected");
    }
    this.config = this.mergeWithDefaults({ ...this.config, ...updates });
  }
};

function initVoiceChatLayout(){const e=window.getMWidget?.(),t=e?.container?.querySelector(".mw-voice-agent-overlay"),o=t?.querySelector(".mw-voice-close-btn"),n=t?.querySelector(".mw-voice-disconnect-btn"),i=e?.container?.querySelector(".mw-voice-call-btn");i&&(i.classList.remove("mw-hidden"),i.classList.add("mw-visible"));const c=t?.querySelector(".mw-voice-agent-logo");c&&e?.chatbot?.image&&(c.src=e.chatbot.image,c.alt=e.chatbot.name||"چت بات");const a=t?.querySelector(".mw-voice-agent-title");a&&(a.textContent=e?.chatbot?.name||"تماس صوتی"),i?.addEventListener("click",()=>{t&&(t.classList.remove("mw-hidden"),t.classList.add("mw-active"),e?.voiceChat?.connect());}),o?.addEventListener("click",()=>{t&&(t.classList.remove("mw-active"),t.classList.add("mw-hidden"),e?.voiceChat?.disconnect());}),n?.addEventListener("click",()=>{t&&(t.classList.remove("mw-active"),t.classList.add("mw-hidden"),e?.voiceChat?.disconnect());});}function updateVoiceChatStatus(e,t){const o=window.getMWidget?.(),n=o?.container?.querySelector(".mw-voice-agent-status");n&&(n.textContent=e,t&&(n.style.color=t));}function handleVoiceConnected(){const e=window.getMWidget?.(),t=e?.container?.querySelector(".mw-voice-agent-logo"),o=e?.container?.querySelector(".mw-voice-agent-status");t&&(t.style.animation="mw-voice-pulse 2s ease-in-out infinite"),o&&(o.style.animation="mw-pulse 1.5s ease-in-out infinite"),updateVoiceChatStatus("متصل ✓","#68d391");}function handleVoiceDisconnected(e){const t=window.getMWidget?.(),o=t?.container?.querySelector(".mw-voice-agent-logo"),n=t?.container?.querySelector(".mw-voice-agent-status");o&&(o.style.animation="none"),n&&(n.style.animation="none");updateVoiceChatStatus(e?`قطع شد: ${e}`:"قطع شد","#fc8181");}function handleVoiceConnectionError(e){updateVoiceChatStatus(`خطا: ${e}`,"#fbb040"),console.error("🔴 Voice Connection Error:",e);}function handleMicrophonePaused(){updateVoiceChatStatus("⏸ میکروفن متوقف شد","#fbb040");}function handleMicrophoneResumed(){updateVoiceChatStatus("🎤 میکروفن فعال","#68d391");}

class VoiceChat{instance;isFirstInSession=true;constructor(){const e=window.getMWidget?.();this.instance=new VoiceClient({apiBase:"https://live.modochats.com",chatbotUuid:e?.chatbot?.uuid,userUniqueId:e?.customerData.uniqueId}),this.instance.on(EventType$1.CONNECTED,e=>{handleVoiceConnected();}),this.instance.on(EventType$1.DISCONNECTED,e=>{e.reason,handleVoiceDisconnected(e.reason);}),this.instance.on(EventType$1.CONNECTION_ERROR,e=>{handleVoiceConnectionError(e.message);}),this.instance.on(EventType$1.MICROPHONE_PAUSED,()=>{handleMicrophonePaused();}),this.instance.on(EventType$1.MICROPHONE_RESUMED,()=>{handleMicrophoneResumed();}),this.initHtml();"true"===sessionStorage.getItem("modochats:voice-agent-seen")?this.isFirstInSession=false:sessionStorage.setItem("modochats:voice-agent-seen","true"),this.isFirstInSession&&this.showTooltip();}async connect(){try{await(this.instance?.connect());}catch(e){}}async disconnect(){await(this.instance?.disconnect());}initHtml(){initVoiceChatLayout();}toggleLayout(){this.toggleLayout();}showTooltip(){const e=document.querySelector(".mw-voice-call-tooltip");e?.classList.remove("mw-hidden"),setTimeout(()=>{e?.classList.add("mw-hidden");},6e3);}}

// src/services/chatbot/model.ts
var Chatbot = class {
  constructor(uuid) {
    this.uuid = uuid;
  }
};

// src/constants/index.ts
var getEnvironment = () => {
  if (typeof window !== "undefined" && window.ENVIRONMENT) {
    return window.ENVIRONMENT;
  }
  if (typeof process !== "undefined" && "development") {
    return "development".toUpperCase();
  }
  return "PROD";
};
var isDev = getEnvironment() === "DEV";
var BASE_API_URL = isDev ? "https://dev-api.modochats.com" : "https://api.modochats.com";
var BASE_WEBSOCKET_URL = isDev ? "wss://dev-api.modochats.com/ws" : "wss://api.modochats.com/ws";
var MAX_SOCKET_RECONNECT_COUNT = 20;

// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
var HASH_RE = /#/g;
var AMPERSAND_RE = /&/g;
var SLASH_RE = /\//g;
var EQUAL_RE = /=/g;
var PLUS_RE = /\+/g;
var ENC_CARET_RE = /%5e/gi;
var ENC_BACKTICK_RE = /%60/gi;
var ENC_PIPE_RE = /%7c/gi;
var ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
var protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

// node_modules/ofetch/dist/shared/ofetch.CWycOUEr.mjs
var FetchError = class extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
};
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}
var payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
var textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers2) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers2
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers2) {
  if (!defaults) {
    return new Headers2(input);
  }
  const headers = new Headers2(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers2(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}
var retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
var nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch: fetch2 = globalThis.fetch,
    Headers: Headers2 = globalThis.Headers,
    AbortController: AbortController2 = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers2
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers2)) {
        context.options.headers = new Headers2(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController2();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch2(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch2 = async function $fetch22(request, options) {
    const r2 = await $fetchRaw(request, options);
    return r2._data;
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.native = (...args) => fetch2(...args);
  $fetch2.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch2;
}

// node_modules/ofetch/dist/index.mjs
var _globalThis = (function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
})();
var fetch = _globalThis.fetch ? (...args) => _globalThis.fetch(...args) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
var Headers = _globalThis.Headers;
var AbortController = _globalThis.AbortController;
var ofetch = createFetch({ fetch, Headers, AbortController });

// src/tools/fetch.ts
var $fetch = ofetch.create({
  baseURL: BASE_API_URL
});

// src/utils/fetch.ts
var fetchSendMessage = async (chatbotId, content, uniqueId, conversationUuid, phoneNumber, options) => {
  const formData = new FormData();
  formData.append("chatbot_uuid", chatbotId.toString());
  formData.append("content", content);
  formData.append("message_type", "0");
  formData.append("unique_id", uniqueId);
  if (conversationUuid) formData.append("conversation_id", conversationUuid);
  formData.append("url", window?.location?.href || "");
  formData.append("title", document?.title || "");
  if (phoneNumber && phoneNumber !== "no phone number") formData.append("phone_number", phoneNumber);
  if (options?.file) formData.append("file", options.file);
  if (options?.replyTo) formData.append("response_to", options.replyTo.toString());
  return await $fetch("/v2/conversations/website/send-message/", {
    method: "POST",
    body: formData
  });
};
var fetchGetAccessTokenForSocket = async (chatbotId, conversationUuid, uniqueId) => {
  return await $fetch("/v2/conversations/websocket/auth/", {
    method: "POST",
    body: {
      chatbot_id: chatbotId,
      conversation_uuid: conversationUuid,
      unique_id: uniqueId
    }
  });
};
var fetchConversationMessages = async (conversationUuid, chatbotUuid) => {
  return await $fetch(`/v2/conversations/website/conversations/${conversationUuid}/chatbot/${chatbotUuid}/messages/`);
};
var fetchReadMessage = async (id) => {
  return await $fetch(`/v2/conversations/messages/${id}/`, {
    method: "POST"
  });
};
var fetchMarkConversationAsRead = async (conversationUuid, uniqueId) => {
  return await $fetch(`/v2/conversations/website/conversations/${conversationUuid}/messages/seen`, {
    method: "POST",
    body: {
      unique_id: uniqueId
    }
  });
};
var fetchMessageFeedback = async (id, uniqueId, conversationUuid, liked) => {
  return await $fetch(`/v2/conversations/website/conversations/messages/feedback`, {
    method: "POST",
    body: {
      unique_id: uniqueId,
      feedback: liked ? 1 : 0,
      message_id: id,
      conversation_uuid: conversationUuid
    }
  });
};
var fetchConversations = async (conversationUuid, uniqueId) => {
  return await $fetch(`/v2/conversations/website/conversations/${conversationUuid}/customer/${uniqueId}`);
};

// src/services/shared/types/events.ts
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2[EventType2["SOCKET_CONNECTED"] = 0] = "SOCKET_CONNECTED";
  EventType2[EventType2["SOCKET_DISCONNECTED"] = 1] = "SOCKET_DISCONNECTED";
  EventType2[EventType2["CONNECTION_ERROR"] = 2] = "CONNECTION_ERROR";
  EventType2[EventType2["CONVERSATION_MESSAGE"] = 3] = "CONVERSATION_MESSAGE";
  EventType2[EventType2["CONVERSATION_MESSAGES_CLEAR"] = 4] = "CONVERSATION_MESSAGES_CLEAR";
  EventType2[EventType2["CONVERSATION_MESSAGES_LOAD"] = 5] = "CONVERSATION_MESSAGES_LOAD";
  EventType2[EventType2["CONVERSATION_SYSTEM_MESSAGE"] = 6] = "CONVERSATION_SYSTEM_MESSAGE";
  EventType2[EventType2["CONVERSATION_LOAD"] = 7] = "CONVERSATION_LOAD";
  return EventType2;
})(EventType || {});

// src/services/chat/conversation.model.ts
var Conversation$1 = class Conversation {
  constructor(init) {
    this.messages = [];
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadCount = init.unread_count;
    this.uniqueId = init.unique_id;
    this.setStatus(init.status);
    this.onInit();
  }
  addMessage(init, options) {
    const chat = window.getMChat?.();
    const message = new ConversationMessage(init);
    this.messages.push(message);
    chat?.eventEmitter.emit({ type: 3 /* CONVERSATION_MESSAGE */, message, incoming: !!options?.incoming });
    if (options?.incoming) {
      this.unreadCount++;
    }
  }
  addSystemMessage(message) {
    const chat = window.getMChat?.();
    chat?.eventEmitter.emit({ type: 6 /* CONVERSATION_SYSTEM_MESSAGE */, message });
  }
  clear() {
    this.messages = [];
  }
  onInit() {
  }
  setStatus(status) {
    switch (status) {
      case "ai_chat":
        this.status = "AI_CHAT";
        break;
      case "supporter_chat":
        this.status = "SUPPORTER_CHAT";
        break;
      case "resolved":
        this.status = "RESOLVED";
        break;
      default:
        this.status = "UNKNOWN";
    }
  }
  async loadMessages() {
    const chat = window.getMChat?.();
    const res = await fetchConversationMessages(this.uuid, chat?.chatbot.uuid);
    this.messages = [];
    chat?.eventEmitter.emit({ type: 4 /* CONVERSATION_MESSAGES_CLEAR */ });
    for (const message of res.results) this.addMessage(message);
    chat?.eventEmitter.emit({ type: 5 /* CONVERSATION_MESSAGES_LOAD */, messages: this.messages });
    return this.messages;
  }
  async markAsRead() {
    const chat = window.getMChat?.();
    await fetchMarkConversationAsRead(this.uuid, chat?.user.uuid);
    this.unreadCount = 0;
  }
};
var ConversationMessage = class {
  constructor(init) {
    this.isRead = false;
    this.hasFeedback = false;
    this.id = init.id;
    this.content = init.content;
    this.isRead = init.is_read || false;
    switch (init.message_type) {
      case 0:
        this.type = "USER";
        break;
      case 1:
        this.type = "AI";
        break;
      case 2:
        this.type = "SUPPORTER";
        break;
      case 3:
        this.type = "SYSTEM";
        break;
      default:
        this.type = "UNKNOWN";
    }
    this.createdAt = init.created_at;
    if (init.response_to) this.repliedToId = init.response_to;
    if (init.file) this.fileSrc = init.file;
  }
  async fetchRead() {
    if (this.isRead === false && this.type !== "USER") {
      this.isRead = true;
      await fetchReadMessage(this.id);
    }
  }
  async sendFeedBack(liked) {
    const chat = window.getMChat?.();
    if (this.hasFeedback) return;
    this.hasFeedback = true;
    try {
      await fetchMessageFeedback(this.id, chat?.user?.uuid, chat?.conversationUuid, liked);
    } catch {
      this.hasFeedback = false;
    }
  }
  get repliedTo() {
    const chat = window.getMChat?.();
    const message = chat?.conversationMessages?.find(({ id }) => id === this.repliedToId);
    return message;
  }
};

// src/services/emitter/event-emitter.ts
var EventEmitter = class {
  constructor() {
    this.listeners = {};
    this.onceListeners = {};
    this.wildcardListeners = /* @__PURE__ */ new Set();
  }
  on(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = /* @__PURE__ */ new Set();
    }
    this.listeners[eventType].add(listener);
    return () => this.off(eventType, listener);
  }
  once(eventType, listener) {
    if (!this.onceListeners[eventType]) {
      this.onceListeners[eventType] = /* @__PURE__ */ new Set();
    }
    this.onceListeners[eventType].add(listener);
    return () => this.offOnce(eventType, listener);
  }
  off(eventType, listener) {
    const listeners = this.listeners[eventType];
    if (listeners) {
      listeners.delete(listener);
    }
  }
  offOnce(eventType, listener) {
    const listeners = this.onceListeners[eventType];
    if (listeners) {
      listeners.delete(listener);
    }
  }
  onAny(listener) {
    this.wildcardListeners.add(listener);
    return () => this.offAny(listener);
  }
  offAny(listener) {
    this.wildcardListeners.delete(listener);
  }
  async emit(event) {
    const regularListeners = this.listeners[event.type];
    if (regularListeners) {
      const promises = Array.from(regularListeners).map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
    const onceListeners = this.onceListeners[event.type];
    if (onceListeners) {
      const listeners = Array.from(onceListeners);
      onceListeners.clear();
      const promises = listeners.map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
    if (this.wildcardListeners.size > 0) {
      const promises = Array.from(this.wildcardListeners).map((listener) => this.safeInvoke(listener, event));
      await Promise.all(promises);
    }
  }
  async safeInvoke(listener, event) {
    try {
      await listener(event);
    } catch (error) {
      console.error(`Error in event listener for ${event.type}:`, error);
    }
  }
  removeAllListeners(eventType) {
    if (eventType) {
      delete this.listeners[eventType];
      delete this.onceListeners[eventType];
    } else {
      this.listeners = {};
      this.onceListeners = {};
      this.wildcardListeners.clear();
    }
  }
  listenerCount(eventType) {
    const regular = this.listeners[eventType]?.size || 0;
    const once = this.onceListeners[eventType]?.size || 0;
    return regular + once;
  }
  hasListeners(eventType) {
    if (eventType) {
      return this.listenerCount(eventType) > 0;
    }
    return Object.keys(this.listeners).length > 0 || Object.keys(this.onceListeners).length > 0 || this.wildcardListeners.size > 0;
  }
  getEventTypes() {
    const types = /* @__PURE__ */ new Set();
    Object.keys(this.listeners).forEach((key) => types.add(key));
    Object.keys(this.onceListeners).forEach((key) => types.add(key));
    return Array.from(types);
  }
};

// src/services/socket/socket.ts
var Socket = class {
  constructor() {
    this.socket = null;
    this.reconnectCount = 0;
    this.isConnected = false;
    this.forceClosed = false;
  }
  async connect(isReconnect = false) {
    const chat = window.getMChat?.();
    if (!this.token) await this.fetchToken();
    const wsUrl = `${BASE_WEBSOCKET_URL}/conversations/${chat?.conversationUuid}/messages/?token=${this.token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      this.socket?.send(
        JSON.stringify({
          type: "join_messages"
        })
      );
      chat?.eventEmitter.emit({ type: 0 /* SOCKET_CONNECTED */ });
      if (isReconnect) {
        chat?.loadConversationMessages();
        this.reconnectCount++;
      }
    });
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => this.onclose();
  }
  updateConnectionStatus(connected) {
  }
  onMessage(message) {
    const chat = window.getMChat?.();
    switch (message.type) {
      case "new_message":
        const newMessage = new ConversationMessage(message.message);
        if (newMessage.type === "USER") return;
        else {
          chat?.addConversationMessage(message.message, { incoming: true });
        }
        break;
      case "ai_response":
        chat?.addConversationMessage(message.message, { incoming: true });
        break;
      case "conversation_status_change":
        chat?.setConversationStatus(message.status);
        chat?.addSystemMessage(message.message);
        break;
      default:
        console.info("modo chat : unknown message type :", message);
    }
  }
  close() {
    this.forceClosed = true;
    this.isConnected = false;
    this.updateConnectionStatus(false);
    this.socket?.close();
    this.token = void 0;
  }
  onclose() {
    const chat = window.getMChat?.();
    this.isConnected = false;
    this.updateConnectionStatus(false);
    chat?.eventEmitter.emit({ type: 1 /* SOCKET_DISCONNECTED */ });
    if (this.forceClosed === false) {
      setTimeout(() => {
        if (this.reconnectCount <= MAX_SOCKET_RECONNECT_COUNT) {
          this.connect(true);
        }
      }, 3e3);
    }
  }
  async fetchToken() {
    const chat = window.getMChat?.();
    const accessTokenRes = await fetchGetAccessTokenForSocket(chat?.chatbot?.uuid, chat?.conversationUuid, chat?.user.uuid);
    this.token = accessTokenRes.access_token;
  }
};

// src/services/user/model.ts
var User = class {
  constructor({ uuid, phoneNumber }) {
    this.uuid = uuid;
    this.phoneNumber = phoneNumber;
  }
};

// src/services/chat/utils.ts
var sendConversationMessage = async (message, { file, replyTo } = {}) => {
  const chat = window.getMChat?.();
  if (chat) {
    const fileSrc = file ? URL.createObjectURL(file) : void 0;
    if (chat?.conversation?.uuid) {
      chat.conversation.addMessage({
        id: "temp",
        content: message,
        message_type: 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        response_to: replyTo,
        file: fileSrc
      });
    }
    const sendMsgRes = await fetchSendMessage(chat?.chatbot?.uuid, message, chat?.user.uuid, chat?.conversation?.uuid, chat?.user.phoneNumber, {
      file,
      replyTo
    });
    if (!chat?.conversation?.uuid) {
      chat.conversation = new Conversation$1(sendMsgRes.conversation);
      chat.eventEmitter.emit({ type: 7 /* CONVERSATION_LOAD */ });
      chat.conversation?.addMessage(sendMsgRes);
      await chat.socket.connect();
      if (chat.conversation?.status === "AI_CHAT") await chat.conversation.loadMessages();
    }
  } else {
    console.error("Chat instance not found");
  }
};
var loadConversation = async (uuid) => {
  const chat = window.getMChat?.();
  if (chat) {
    const res = await fetchConversations(uuid, chat.user.uuid);
    if (res.results.length > 0) {
      chat.conversation = new Conversation$1(res.results[0]);
      chat.eventEmitter.emit({ type: 7 /* CONVERSATION_LOAD */ });
    }
  }
};

// src/app.ts
var ChatClient = class {
  constructor({ chatbotUuid, userData, conversationUUid }) {
    this.user = new User(userData);
    this.chatbot = new Chatbot(chatbotUuid);
    this.eventEmitter = new EventEmitter();
    window.getMChat = () => this;
    if (conversationUUid) this.loadConversation(conversationUUid);
    this.socket = new Socket();
  }
  get conversationUuid() {
    return this.conversation?.uuid;
  }
  get conversationMessages() {
    return this.conversation?.messages;
  }
  loadConversationMessages() {
    return this.conversation?.loadMessages();
  }
  addConversationMessage(...args) {
    return this.conversation?.addMessage(...args);
  }
  setConversationStatus(...args) {
    return this.conversation?.setStatus(...args);
  }
  addSystemMessage(...args) {
    return this.conversation?.addSystemMessage(...args);
  }
  sendMessage(...args) {
    return sendConversationMessage(...args);
  }
  loadConversation(...args) {
    return loadConversation(...args);
  }
  // event emitter
  on(eventType, listener) {
    return this.eventEmitter.on(eventType, listener);
  }
  once(eventType, listener) {
    return this.eventEmitter.once(eventType, listener);
  }
  off(eventType, listener) {
    this.eventEmitter.off(eventType, listener);
  }
  onAny(listener) {
    return this.eventEmitter.onAny(listener);
  }
  offAny(listener) {
    this.eventEmitter.offAny(listener);
  }
  clearConversation() {
    this.socket.close();
    this.conversation = void 0;
  }
};

const onSocketConnectionUpdate=n=>{const t=window.getMWidget?.(),e=t?.container?.querySelector(".mw-connection-status");e&&(e.className="mw-connection-status "+(n?"mw-connected":"mw-disconnected"));};

const audioCache=new Map,preloadAudio=e=>new Promise((a,o)=>{if(audioCache.has(e))return void a(audioCache.get(e));const t=new Audio(e);t.volume=.5,t.preload="auto",t.addEventListener("canplaythrough",()=>{audioCache.set(e,t),a(t);}),t.addEventListener("error",e=>{o(e);}),t.load();}),playAudio=async e=>{try{let a=audioCache.get(e);a||(a=new Audio(e),a.volume=.5,a.preload="auto"),await a.play();}catch(e){console.warn("Failed to play audio:",e);try{const e=new(window.AudioContext||window.webkitAudioContext),a=e.createOscillator(),o=e.createGain();a.connect(o),o.connect(e.destination),a.frequency.setValueAtTime(800,e.currentTime),a.type="sine",o.gain.setValueAtTime(.3,e.currentTime),o.gain.exponentialRampToValueAtTime(.01,e.currentTime+.5),a.start(e.currentTime),a.stop(e.currentTime+.5);}catch(e){console.warn("Audio fallback also failed:",e);}}};

class Conversation{constructor(){}get d(){return window.getMWidget?.().chat?.conversationD}addMessage(e,t){const s=window.getMWidget?.();initMessageElement(e),t?.incoming&&(s?.isOpen?this.markAsRead():(this.addBadge(),showMessageTooltip(e),playAudio(NEW_MESSAGE_AUDIO_URL).catch(console.warn))),this.scrollToBottom();}clearContainerEl(){const e=document.querySelector(".mw-chat-messages-con");e&&(e.innerHTML="");}addSystemMessage(e){const t=document.querySelector(".mw-chat-messages-con");if(t){const s=document.createElement("div");s.className="mw-system-message",s.innerHTML=`\n        <div class="mw-system-message-content">\n          ${e}\n        </div>\n      `,t.appendChild(s),this.scrollToBottom();}}scrollToBottom(){const e=document.querySelector(".mw-chat-messages-con");e&&(e.scrollTop=e.scrollHeight);}clear(){this.d?.clear(),this.d.messages=[];const e=window.getMWidget?.();localStorage.removeItem(`modo-chat:${e?.publicKey}-conversation-uuid`),this.clearContainerEl(),switchToStarterLayout();}onInit(){switchToConversationLayout(),preloadAudio("./audio/new-message.mp3").catch(console.warn),this?.d?.status&&setConversationType(this.d?.status);}setStatus(){setConversationType(this.d?.status);}async loadMessages(){const e=window.getMWidget?.(),t=await(this.d?.loadMessages()),s=e?.container?.querySelector(".mw-chat-messages-con");s&&(s.innerHTML="");for(const e of t||[])this.addMessage(e);}addBadge(){const e=window.getMWidget?.();if(!e?.isOpen&&this.unreadCount>0&&e){const t=e.container?.querySelector(".mw-badge"),s=e.container?.querySelector(".mw-badge-text");if(t&&s){t.classList.remove("mw-hidden");const e=this.unreadCount>99?"99+":this.unreadCount.toString();s.textContent=e,this.unreadCount>99?t.classList.add("mw-badge-plus"):t.classList.remove("mw-badge-plus");}}}get unreadCount(){return this.d?.unreadCount||0}hideBadge(){const e=window.getMWidget?.(),t=e?.container?.querySelector(".mw-badge");t&&t.classList.add("mw-hidden");}hideTooltip(){const e=window.getMWidget?.(),t=e?.container?.querySelector(".mw-toggle-tooltip");t&&t.classList.add("mw-hidden");}async markAsRead(){window.getMWidget?.();await(this.d?.markAsRead()),this.hideBadge();}get containerElement(){return document.querySelector(".mw-chat-messages-con")}}

class Chat{instance;fileMaster;replyMaster;conversation;constructor(){this.fileMaster=new CFileMaster,this.replyMaster=new CReplyMaster,this.conversation=new Conversation;}initInstance(){const e=window.getMWidget?.(),t=localStorage.getItem(`modo-chat:${e?.chatbot?.uuid}-conversation-uuid`);this.instance=new ChatClient({chatbotUuid:e?.chatbot?.uuid,userData:{uuid:e?.customerData.uniqueId,phoneNumber:e?.customerData.phoneNumber},conversationUUid:t||void 0}),this.instance.on(EventType.CONVERSATION_SYSTEM_MESSAGE,e=>{this.conversation.addSystemMessage(e.message);}),this.instance.on(EventType.CONVERSATION_MESSAGE,e=>{this.conversation.addMessage(e.message,{incoming:e.incoming});}),this.instance.on(EventType.SOCKET_CONNECTED,e=>{onSocketConnectionUpdate(true);}),this.instance.on(EventType.SOCKET_DISCONNECTED,e=>{onSocketConnectionUpdate(false);}),this.instance.on(EventType.CONVERSATION_LOAD,t=>{this.conversation.clearContainerEl(),this.conversation.setStatus(),this.conversation.onInit(),localStorage.setItem(`modo-chat:${e?.chatbot?.uuid}-conversation-uuid`,this.instance?.conversation?.uuid);}),this.instance.on(EventType.CONVERSATION_MESSAGES_CLEAR,()=>{this.conversation.clearContainerEl();});}get socket(){return this.instance?.socket}get conversationD(){return this.instance?.conversation}clear(){this.conversation.clear(),this.instance?.clearConversation();}sendMessage(...e){return this.instance?.sendMessage(...e)}}class CFileMaster{file;clearFile(){this.file=void 0,this.toggleUiState();}setFile(e){this.file=e,this.toggleUiState();}toggleUiState(){const e=window.getMWidget?.().container,t=e?.querySelector(".mw-file-upload-btn"),i=e?.querySelector(".mw-file-input"),n=e?.querySelector(".mw-file-upload-icon"),s=e?.querySelector(".mw-file-remove-icon");this.file?(n.classList.add("mw-hidden"),s.classList.remove("mw-hidden"),t.classList.add("mw-file-uploaded")):(i.value="",n.classList.remove("mw-hidden"),s.classList.add("mw-hidden"),t.classList.remove("mw-file-uploaded"));}}class CReplyMaster{replyingTo;setReply(e){this.replyingTo=e,this.updateReplyUI();}clearReply(){this.replyingTo=void 0,this.updateReplyUI();}updateReplyUI(){const e=window.getMWidget?.().container,t=e?.querySelector(".mw-reply-preview"),i=e?.querySelector(".mw-reply-preview-text"),n=e?.querySelector(".mw-chat-messages-con");if(this.replyingTo){if(t&&i){const e=this.replyingTo.content.length>50?this.replyingTo.content.substring(0,50)+"...":this.replyingTo.content;i.textContent=e,t.classList.remove("mw-hidden"),n&&n.classList.add("mw-reply-active");}}else t&&(t.classList.add("mw-hidden"),n&&n.classList.remove("mw-reply-active"));}}

class Widget{container;publicKey;chatbot;customerData;chat;options={};openedCount=0;version;isInitialized=false;isOpen=false;voiceChat;constructor(t,o){this.publicKey=t,this.customerData=new CustomerData(this,o?.userData),this.chat=new Chat,this.version=VERSION,this.options={position:o?.position||"right",theme:o?.theme,primaryColor:o?.primaryColor,title:o?.title||"",userData:o?.userData,foregroundColor:o?.foregroundColor,fullScreen:"boolean"==typeof o?.fullScreen&&o?.fullScreen},o?.autoInit&&this.init();}async init(){if(this.isInitialized)throw new Error("Widget already initialized");const t=await fetchChatbot(this.publicKey);if(this.chatbot=new Chatbot$1(t),this.options={...this.options,theme:this.options?.theme||this.chatbot?.uiConfig?.theme||"dark",primaryColor:this.options?.primaryColor||this.chatbot?.uiConfig?.primaryColor||"#667eea",foregroundColor:this.options?.foregroundColor||this.chatbot?.uiConfig?.foregroundColor||"#fff"},!checkIfHostIsAllowed(this))throw new Error("host not allowed");if(await loadCss(),window.getMWidget=()=>this,createChatContainer(this),applyModoOptions(),loadStarters(),updateChatToggleImage(),updateChatTitle(),this.isInitialized=true,this.chatbot.showTooltip(),this.options.fullScreen){const t=this.container?.querySelector(".mw-chat-body");t&&(t.classList.remove("mw-hidden"),t.classList.add("mw-active"));try{this.chat.initInstance();}finally{this.onOpen();}}else this.chat.initInstance();}async onOpen(){this.isOpen=true,this.openedCount++,this.conversation?.hideTooltip(),this.chatbot?.hideTooltip(),this.conversation?.markAsRead(),this.conversation?.scrollToBottom(),1===this.openedCount&&(this.chat.conversationD&&(await(this.conversation?.loadMessages()),await(this.chat?.socket?.connect())),this.chatbot?.voiceChat&&(this.voiceChat=new VoiceChat),await this.customerData.fetchUpdate());}onClose(){this.isOpen=false;}async updateUserData(t){await this.customerData.updateUserData(t);}get conversation(){return this.chat.conversation}}window.ModoChat=Widget,window.ModoWidget=Widget;

  
  // Return the ModoChat class for UMD usage
  return typeof ModoChat !== 'undefined' ? ModoChat : (typeof window !== 'undefined' && window.ModoChat ? window.ModoChat : null);
});