import {$fetch} from "#src/tools/fetch.js";

const fetchModoPublicData = async (publicKey: string) => {
  return await $fetch<Record<string, any>>(`/v1/chatbot/public/${publicKey}`);
};
export {fetchModoPublicData};
