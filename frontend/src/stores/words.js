import { defineStore } from "pinia";
import { settings } from "@/api.js";

export const useWordsStore = defineStore("words", {
  state: () => ({
    words: [],
    charIndex: {}
  }),
  actions: {
    async fetchWords() {
      if (this.words.length > 0) {
        return;
      }

      const res = await fetch(settings.baseURL + "/api/words");
      this.words = await res.json();
      this.charIndex = {};

      this.buildIndex();
    },
    async buildIndex() {
      const charIndex = {};

      let char = null;
      this.words.forEach((w, i) => {
        if (w[2].match(/^[a-zåäö]/i)) {
          char = w[2][0].toLowerCase();
        } else {
          char = "#";
        }

        if (char in charIndex) {
          if (i < charIndex[char]) {
            charIndex[char] = i;
          }
        } else {
          charIndex[char] = i;
        }
      });

      this.charIndex = charIndex;
    }
  }
});
