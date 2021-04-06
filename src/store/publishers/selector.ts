// import { selector } from "recoil";
// import { publishers } from ".";
// import { getPublishers as queryPublishers } from "./requests";

// export const getPublishers = selector({
//   key: "publishers",
//   get: async () => queryPublishers
// })
import { selector } from "recoil";
import { fromDictionary } from "../../utils/parsers";
import { publishers } from "./atom";
import { Publisher } from "./types";

export const publishersSelector = selector<Publisher[]>({
  key: "publishersSelector",
  get: ({ get }) => {
    const publishersList = get(publishers);
    return fromDictionary(publishersList);
  }
});