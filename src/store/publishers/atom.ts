import { atom } from "recoil";
import { Publisher } from "./types";

export const publishers = atom<Publisher[]>({
  key: "publishers",
  default: [
      {
        id: '1',
        name: 'Jira Notifications',
        createdAt: new Date()
      }
    ]
});

export const loaded = atom<boolean>({
  key: "publishers_loaded",
  default: false
});
