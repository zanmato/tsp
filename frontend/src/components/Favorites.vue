<script setup>
import { onActivated, reactive } from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import ChevronRightIcon from "bootstrap-icons/icons/chevron-right.svg?component";
import { useFavoritesStore } from "@/stores/favorites";
import { useI18n } from "vue-i18n";

const props = defineProps({
  navRouter: {
    required: true
  }
});

const favorites = useFavoritesStore();

const state = reactive({
  words: []
});

const { t } = useI18n({ useScope: "global" });

onActivated(() => {
  state.words = Object.values(favorites.favorites).map((v) => ({
    id: v.id,
    w: v.words[0],
    f: v.frequency
  }));
});
</script>

<template>
  <div class="header">
    <div class="header-content">
      <h1>{{ t("favorites") }}</h1>
    </div>
  </div>

  <RecycleScroller
    class="scroller"
    :items="state.words"
    :item-size="40"
    key-field="id"
    v-slot="{ item }">
    <router-link :to="{ name: 'Sign', params: { id: item.id } }" class="word">
      <span>{{ item.w }}</span>
      <small class="unusual" v-if="item.f">{{ item.f }}</small>
      <ChevronRightIcon />
    </router-link>
  </RecycleScroller>
</template>

<style lang="scss" scoped>
.scroller {
  // Subtract tab bar and header
  height: calc(100vh - 61px - 80px - 18px);
  width: 100%;
  padding: 0 15px;
}

.word {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid var(--separator-color);
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    flex: 1;
  }
  .unusual {
    color: var(--secondary-label-color);
    font-size: 0.8rem;
  }

  .bi {
    margin: 0 5px;
  }
}
</style>
