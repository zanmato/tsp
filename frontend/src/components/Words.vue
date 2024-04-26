<script setup>
import { ref, reactive } from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import VueSelect from "vue-select";
import ChevronRightIcon from "bootstrap-icons/icons/chevron-right.svg?component";
import { useWordsStore } from "@/stores/words";
import { useRouter } from "vue-router";
import SearchIcon from "bootstrap-icons/icons/search.svg?component";
import CloseIcon from "bootstrap-icons/icons/x-lg.svg?component";
import { useI18n } from "vue-i18n";
import { settings } from "@/api.js";

const props = defineProps({
  navRouter: {
    required: true
  }
});

const words = useWordsStore();
words.fetchWords();

const router = useRouter();

const wordsScroller = ref(null);

let debounceTimer = null;

const searchData = reactive({
  results: [],
  selected: null
});

const onSearch = (search, loading) => {
  if (search.trim().length <= 1) {
    return;
  }

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    searchWords(loading, search, this);
  }, 250);
};

const onSelect = (item) => {
  searchData.selected = null;
  router.push({ name: "Sign", params: { id: item[1] } });
};

const searchWords = (loading, search, vm) => {
  loading(true);
  fetch(
    settings.baseURL +
      "/api/words?" +
      new URLSearchParams({
        q: search
      })
  )
    .then((response) => response.json())
    .then((data) => {
      searchData.results = data;
    })
    .finally(() => {
      loading(false);
    });
};

const scrollTo = (pos) => {
  wordsScroller.value.scrollToItem(pos);
};

const dropdownShouldOpen = (vm) => {
  return vm.search.trim().length > 0 && vm.open;
};

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="header">
    <div class="header-content">
      <h1>{{ t("words") }}</h1>
    </div>
    <form action="#">
      <VueSelect
        ref="search"
        class="search-bar"
        v-model="searchData.selected"
        :filterable="false"
        :clearable="true"
        :placeholder="t('search')"
        :options="searchData.results"
        :select-on-key-codes="[]"
        :get-option-key="(opt) => opt[0]"
        :get-option-label="(opt) => opt[2]"
        :dropdown-should-open="dropdownShouldOpen"
        @search="onSearch"
        @option:selected="onSelect">
        <template #open-indicator>
          <span class="search-icon">
            <SearchIcon />
            <CloseIcon />
          </span>
        </template>
        <template #no-options="{ loading }">
          <span v-if="loading" label="Loading..."></span>
          <span v-else>{{ t("noResults") }}</span>
        </template>
      </VueSelect>
    </form>
  </div>
  <div class="char-index">
    <a
      v-for="(pos, c) in words.charIndex"
      :key="c"
      href="#"
      @click.prevent="scrollTo(pos)">
      {{ c }}
    </a>
  </div>
  <RecycleScroller
    id="words-scoller"
    ref="wordsScroller"
    class="scroller"
    :items="words.words"
    :item-size="40"
    key-field="0"
    v-slot="{ item }">
    <router-link :to="{ name: 'Sign', params: { id: item[1] } }" class="word">
      <span>{{ item[2] }}</span>
      <small class="unusual" v-if="item[3]">{{ t("unusualSign") }}</small>
      <ChevronRightIcon />
    </router-link>
  </RecycleScroller>
</template>

<style lang="scss" scoped>
.header {
  height: 120px;
  width: 100%;
  border-bottom: 1px solid var(--separator-color);
  padding: 10px 15px;
  flex-wrap: wrap;

  .header-content {
    height: 60px;
  }

  .search-bar {
    width: 100%;
    .search-icon {
      .bi-search {
        display: inline;
      }

      .bi-x-lg {
        display: none;
      }
    }

    &.vs--open .search-icon {
      .bi-search {
        display: none;
      }

      .bi-x-lg {
        cursor: pointer;
        display: inline;
      }
    }
  }
}

.scroller {
  // Subtract tab bar and header
  height: calc(100vh - 71px - 120px);
  width: 100%;
  padding: 0 15px;
}

.char-index {
  position: absolute;
  right: 3px;
  font-size: 12px;
  line-height: 14px;
  top: 150px;
  text-align: center;
  z-index: 999;
  overflow-y: hidden;

  a {
    text-transform: uppercase;
    display: block;
  }
}

.scrollbar .char-index {
  right: 18px;
}
</style>
