import { shallowRef, ref } from "vue";
import Words from "@/components/Words.vue";
import Categories from "@/components/Categories.vue";
import CategoryWords from "@/components/CategoryWords.vue";
import Favorites from "@/components/Favorites.vue";
import About from "@/components/About.vue";

const routes = [
  { path: "/", component: shallowRef(Words), name: "Words" },
  { path: "/favorites", component: shallowRef(Favorites), name: "Favorites" },
  {
    path: "/categories",
    component: shallowRef(Categories),
    name: "Categories"
  },
  {
    path: "/categories/:id",
    component: shallowRef(CategoryWords),
    name: "CategoryWords"
  },
  { path: "/about", component: shallowRef(About), name: "About" }
];

const router = {
  history: [],
  push(route) {
    if (!("name" in route)) {
      throw new Error("Route must have a name");
    }

    const r = routes.find((r) => r.name === route.name);
    if (!r) {
      throw new Error("Route not found");
    }

    let fullPath = r.path;
    if (route.params) {
      for (const [key, value] of Object.entries(route.params)) {
        fullPath = fullPath.replace(`:${key}`, value);
      }
    }

    const resolvedRoute = {
      ...r,
      fullPath,
      params: route?.params
    };

    this.history.push(resolvedRoute);

    this.currentRoute.value = resolvedRoute;
    this.currentComponent.value = resolvedRoute.component;
  },
  go() {
    this.history.pop();

    const r = this.history[this.history.length - 1];
    this.currentRoute.value = r;
    this.currentComponent.value = r.component;
  },
  currentComponent: ref(null),
  currentRoute: ref(null)
};

router.currentComponent.value = routes[0].component;
router.currentRoute.value = { ...routes[0], fullPath: "/" };

export const useStackRouter = () => {
  return {
    stackRouter: router
  };
};
