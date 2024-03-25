import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fontSize: 16,
    posts: {},
    postsPerGroup: {},
    postsLoading: false,
    postsLoadingError: false,
    failedRequests: 0,
    totalPosts: 0,
    totalPostPages: 0,
    totalPostPagesPerGroup: {},
    events: {},
    eventsPerGroup: {},
    eventsLoading: false,
    eventsLoadingError: false,
    mainEvents: [],
    mainEventsLoading: false,
    mainEventsLoadingError: false,
    pages: {},
    pageLoading: false,
    pageLoadingError: false,
    groups: [],
    groupsLoading: false,
    groupsLoadingError: false,
    facilities: [],
    facilitiesLoading: false,
    facilitiesLoadingError: false,
    magazines: [],
    magazinesWithPosts: {},
    magazinesLoading: false,
    magazinesLoadingError: false,
    calendarView: "",
    calendarFocus: "",
    region: ""
  },

  getters,
  mutations,
  actions
});
