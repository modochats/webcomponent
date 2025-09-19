import {BASE_API_URL} from "#src/constants/index.js";
import {ofetch} from "ofetch";

const $fetch = ofetch.create({
  baseURL: BASE_API_URL
});
export {$fetch};
