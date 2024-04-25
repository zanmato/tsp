<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import WordsIcon from "bootstrap-icons/icons/list.svg?component";
import FavoritesIcon from "bootstrap-icons/icons/suit-heart.svg?component";
import SubjectsIcon from "bootstrap-icons/icons/tag.svg?component";
import AboutIcon from "bootstrap-icons/icons/info-circle.svg?component";
import { useI18n } from "vue-i18n";
import { useStackRouter } from "@/composables/stackrouter";

const { t } = useI18n({ useScope: "global" });

const state = reactive({
  classNames: null
});

const route = useRoute();
const router = useRouter();

const { stackRouter } = useStackRouter();

const navRouter = () => (window.innerWidth < 768 ? router : stackRouter);

onMounted(() => {
  // Create the measurement node
  var scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);

  if (scrollDiv.offsetWidth - scrollDiv.clientWidth > 0) {
    state.classNames = ["scrollbar"];
  }

  document.body.removeChild(scrollDiv);
});
</script>
<template>
  <main class="split-view">
    <section class="sidebar d-none d-md-block">
      <section class="sidebar-view" :class="state.classNames">
        <keep-alive :max="3">
          <component
            :is="stackRouter.currentComponent.value.value"
            :nav-router="() => stackRouter"
            :key="stackRouter.currentRoute.value.fullPath" />
        </keep-alive>
      </section>
      <nav class="tab-bar">
        <a
          href="#"
          :class="{
            'router-link-active':
              stackRouter.currentRoute.value.name === 'Words'
          }"
          @click.prevent="stackRouter.push({ name: 'Words' })">
          <WordsIcon />
          <span>{{ t("words") }}</span>
        </a>
        <a
          href="#"
          :class="{
            'router-link-active':
              stackRouter.currentRoute.value.name === 'Favorites'
          }"
          @click.prevent="stackRouter.push({ name: 'Favorites' })">
          <FavoritesIcon />
          <span>{{ t("favorites") }}</span>
        </a>
        <a
          href="#"
          :class="{
            'router-link-active': ['Categories', 'CategoryWords'].includes(
              stackRouter.currentRoute.value.name
            )
          }"
          @click.prevent="stackRouter.push({ name: 'Categories' })">
          <SubjectsIcon />
          <span>{{ t("categories") }}</span>
        </a>
        <a
          href="#"
          :class="{
            'router-link-active':
              stackRouter.currentRoute.value.name === 'About'
          }"
          @click.prevent="stackRouter.push({ name: 'About' })">
          <AboutIcon />
          <span>{{ t("about") }}</span>
        </a>
      </nav>
    </section>
    <section class="main-view">
      <section :class="state.classNames">
        <router-view v-slot="{ Component }">
          <keep-alive :max="10">
            <component
              :is="Component"
              :nav-router="navRouter"
              :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </section>
      <nav class="tab-bar mobile">
        <router-link to="/">
          <WordsIcon />
          <span>{{ t("words") }}</span>
        </router-link>
        <router-link to="/favorites">
          <FavoritesIcon />
          <span>{{ t("favorites") }}</span>
        </router-link>
        <router-link to="/categories">
          <SubjectsIcon />
          <span>{{ t("categories") }}</span>
        </router-link>
        <router-link to="/about">
          <AboutIcon />
          <span>{{ t("about") }}</span>
        </router-link>
      </nav>
    </section>
  </main>
</template>

<style lang="scss">
.split-view {
  .main-view {
    float: left;
    margin-left: 320px;
    width: calc(100% - 320px);
  }

  @media screen and (max-width: 767px) {
    .sidebar {
      display: none;
    }

    .main-view {
      margin-left: 0;
      width: 100%;
    }
  }
}
.main-view {
  position: relative;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  padding-bottom: 10px;

  background: var(--background-color);
  border-top: 1px solid var(--separator-color);

  a {
    flex: 1 0;
    line-height: 1.2;
    color: var(--secondary-label-color);
    text-align: center;

    &:disabled {
      opacity: 0.6;
    }

    .bi {
      fill: var(--secondary-label-color);
    }

    &.router-link-active {
      color: var(--tint-color);

      .bi {
        fill: var(--tint-color);
      }
    }

    span {
      display: block;
      font-size: 0.8rem;
    }
  }

  &.mobile {
    @media screen and (min-width: 768px) {
      display: none;
    }
  }
}

.sidebar {
  width: 320px;
  position: fixed;
  border-right: 1px solid var(--separator-color);
  .sidebar-view {
    position: relative;
  }

  .tab-bar {
    border-right: 1px solid var(--separator-color);
    width: 320px;
  }
}
</style>
