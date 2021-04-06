import { atom } from "recoil";
import { Dictionary } from "../../utils/types";
import { Publisher } from "./types";

export const publishers = atom<Dictionary<Publisher>>({
  key: "publishers",
  default: 
      {'1' : {
        id: '1',
        name: 'Jira Notifications',
        createdAt: new Date()
      }}
});

export const publisherForm = atom<Publisher>({
  key: "publisherForm",
  default: {
    id: '',
    name: '',
    createdAt: new Date()
  }
});

export const loaded = atom<boolean>({
  key: "publishers_loaded",
  default: false
});
