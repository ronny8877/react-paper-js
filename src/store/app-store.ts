import { makeAutoObservable } from "mobx";
import EditorStore from "./editor-store";

type SideBarConfig = {
  variant: "default" | "floating";
};

//Root Store for the project
export class AppStore {
  // Editor state
  sideBarConfig: SideBarConfig = { variant: "default" };
  editorStore: EditorStore;

  constructor() {
    makeAutoObservable(this);
    this.editorStore = new EditorStore(this);
  }

  setSideBarConfig(config: Partial<SideBarConfig>) {
    this.sideBarConfig = { ...this.sideBarConfig, ...config };
  }
}

export const appStore = new AppStore();
