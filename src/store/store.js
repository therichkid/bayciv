import Vuex from "vuex";
import Vue from "vue";

import api from "../services/api";
import formatter from "../services/formatter";

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
    calendarView: "",
    calendarFocus: "",
    region: ""
  },

  getters: {
    getFetchedPosts: state => (page, groupName) => {
      let posts;
      if (groupName) {
        posts = state.postsPerGroup[groupName] ? state.postsPerGroup[groupName][page] : null;
      } else {
        posts = state.posts[page];
      }
      return posts ? [true, posts] : [false, null];
    },
    getFetchedPostBySlug: state => slug => {
      for (const page in state.posts) {
        for (const post of state.posts[page]) {
          if (post.slug === slug) {
            return [true, post];
          }
        }
      }
      for (const groupName in state.postsPerGroup) {
        const postsPerGroup = state.postsPerGroup[groupName];
        for (const page in postsPerGroup) {
          for (const post of postsPerGroup[page]) {
            if (post.slug === slug) {
              return [true, post];
            }
          }
        }
      }
      return [false, null];
    },
    getFetchedEvents: state => (year, month) => {
      if (state.events[year] && state.events[year][month]) {
        const events = [...state.events[year][month]];
        return [true, events];
      }
      return [false, null];
    },
    getFetchedMainEvents: state => () => {
      if (state.mainEvents.length) {
        const events = [...state.mainEvents];
        return [true, events];
      }
      return [false, null];
    },
    getFetchedEventsPerGroup: state => groupName => {
      if (state.eventsPerGroup[groupName] && state.eventsPerGroup[groupName].length) {
        const events = [...state.eventsPerGroup[groupName]];
        return [true, events];
      }
      return [false, null];
    },
    getFetchedEventBySlug: state => (slug, year, month) => {
      if (state.events[year] && state.events[year][month]) {
        for (const event of state.events[year][month]) {
          if (event.slug === slug) {
            return [true, event];
          }
        }
      }
      for (const event of state.mainEvents) {
        if (event.slug === slug) {
          return [true, event];
        }
      }
      for (const groupName in state.eventsPerGroup) {
        const eventsPerGroup = state.eventsPerGroup[groupName];
        for (const event of eventsPerGroup) {
          if (event.slug === slug) {
            return [true, event];
          }
        }
      }
      return [false, null];
    },
    getFetchedPageBySlug: state => slug => {
      const page = state.pages[slug];
      if (page) {
        return [true, page];
      }
      return [false, null];
    },
    getFetchedGroups: state => () => {
      const groups = state.groups;
      return groups && groups.length ? [true, groups] : [false, null];
    },
    getFetchedFacilities: state => () => {
      const facilities = state.facilities;
      return facilities && facilities.length ? [true, facilities] : [false, null];
    }
  },

  mutations: {
    changeFontSize(state, action) {
      if (action && state.fontSize) {
        state.fontSize += action;
      } else {
        state.fontSize = 16;
      }
    },
    changePostsLoading(state, value) {
      state.postsLoading = value;
    },
    changePostsLoadingError(state, value) {
      state.postsLoadingError = value;
    },
    storePosts(state, { posts, page }) {
      state.posts[page] = posts;
    },
    storePostsPerGroup(state, { posts, page, groupName }) {
      if (!state.postsPerGroup[groupName]) {
        state.postsPerGroup[groupName] = {};
      }
      state.postsPerGroup[groupName][page] = posts;
    },
    incrementFailedRequests(state, num) {
      if (!num) {
        state.failedRequests = 0;
      } else {
        state.failedRequests += 1;
      }
    },
    setPostHeaders(state, headers) {
      state.totalPosts = parseInt(headers["x-wp-total"], 10);
      state.totalPostPages = parseInt(headers["x-wp-totalpages"], 10);
    },
    setPostHeadersPerGroup(state, { headers, groupName }) {
      state.totalPostPagesPerGroup[groupName] = parseInt(headers["x-wp-totalpages"], 10);
    },
    changeEventsLoading(state, { value, onlyMainEvents }) {
      if (onlyMainEvents) {
        state.mainEventsLoading = value;
      } else {
        state.eventsLoading = value;
      }
    },
    changeEventsLoadingError(state, { value, onlyMainEvents }) {
      if (onlyMainEvents) {
        state.mainEventsLoadingError = value;
      } else {
        state.eventsLoadingError = value;
      }
    },
    storeEvents(state, { events, year, month }) {
      if (!state.events[year]) {
        state.events[year] = {};
      }
      state.events[year][month] = [...events];
    },
    storeMainEvents(state, events) {
      state.mainEvents = [...events];
    },
    storeEventsPerGroup(state, { events, groupName }) {
      if (!state.eventsPerGroup[groupName]) {
        state.eventsPerGroup[groupName] = {};
      }
      state.eventsPerGroup[groupName] = events;
    },
    changePageLoading(state, value) {
      state.pageLoading = value;
    },
    changePageLoadingError(state, value) {
      state.pageLoadingError = value;
    },
    storePage(state, { page, slug }) {
      state.pages[slug] = page;
    },
    changeGroupsLoading(state, value) {
      state.groupsLoading = value;
    },
    changeGroupsLoadingError(state, value) {
      state.groupsLoadingError = value;
    },
    storeGroups(state, groups) {
      state.groups = groups;
    },
    changeFacilitiesLoading(state, value) {
      state.facilitiesLoading = value;
    },
    changeFacilitiesLoadingError(state, value) {
      state.facilitiesLoadingError = value;
    },
    storeFacilities(state, facilities) {
      state.facilities = facilities;
    },
    changeCalendarType(state, view) {
      state.calendarView = view;
    },
    changeCalendarFocus(state, focus) {
      state.calendarFocus = focus;
    },
    changeRegion(state, region) {
      state.region = region;
    }
  },

  actions: {
    fetchPosts(context, { page, groupName }) {
      context.commit("changePostsLoading", true);
      context.commit("changePostsLoadingError", false);
      const path = "wp/v2/posts";
      const params = {
        _embed: true,
        page,
        per_page: 6
      };
      if (groupName) {
        Object.assign(params, {
          "filter[category_name]": groupName
        });
      }
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data, headers } = response;
              const posts = formatter.formatPosts(data);
              if (groupName) {
                context.commit("storePostsPerGroup", {
                  posts,
                  page,
                  groupName
                });
                context.commit("setPostHeadersPerGroup", {
                  headers,
                  groupName
                });
              } else {
                context.commit("storePosts", { posts, page });
                context.commit("setPostHeaders", headers);
              }
              context.commit("incrementFailedRequests", 0);
              resolve(posts);
            },
            error => {
              context.commit("changePostsLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changePostsLoading", false);
          });
      });
    },
    fetchPostBySlug(context, slug) {
      context.commit("changePostsLoading", true);
      context.commit("changePostsLoadingError", false);
      const path = "wp/v2/posts";
      const params = {
        _embed: true,
        slug
      };
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data } = response;
              const posts = formatter.formatPosts(data);
              context.commit("incrementFailedRequests", 0);
              resolve(posts[0]);
            },
            error => {
              context.commit("changePostsLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changePostsLoading", false);
          });
      });
    },
    fetchPostsBySearchTerm(context, search) {
      const path = "wp/v2/posts";
      const params = {
        search
      };
      return new Promise((resolve, reject) => {
        api.fetchData(path, params).then(
          response => {
            let { data } = response;
            const posts = data;
            resolve(posts);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    fetchEvents(context, { startDate, endDate, onlyMainEvents, groupName }) {
      context.commit("changeEventsLoading", { value: true, onlyMainEvents });
      context.commit("changeEventsLoadingError", {
        value: false,
        onlyMainEvents
      });
      let year, month;
      const path = "wp/v2/events";
      const params = {
        _embed: true,
        per_page: 100
        // "filter[meta_query][relation]": "OR"
      };
      if (startDate) {
        Object.assign(params, {
          "filter[meta_query][0][key]": "event_datum",
          "filter[meta_query][0][value]": startDate,
          "filter[meta_query][0][compare]": ">="
        });
        year = parseInt(startDate.slice(0, 4), 10);
        month = parseInt(startDate.slice(4, 6), 10);
      }
      if (endDate) {
        Object.assign(params, {
          "filter[meta_query][1][key]": "event_datum",
          "filter[meta_query][1][value]": endDate,
          "filter[meta_query][1][compare]": "<"
        });
      }
      if (onlyMainEvents) {
        Object.assign(params, {
          "filter[meta_query][2][key]": "hauptevent",
          "filter[meta_query][2][value]": 1
        });
      }
      if (groupName) {
        Object.assign(params, {
          "filter[category_name]": groupName
        });
      }
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data } = response;
              const events = formatter.formatEvents(data);
              if (year && month && !onlyMainEvents && !groupName) {
                context.commit("storeEvents", { events, year, month });
              } else if (onlyMainEvents) {
                context.commit("storeMainEvents", events);
              } else if (groupName) {
                context.commit("storeEventsPerGroup", { events, groupName });
              }
              context.commit("incrementFailedRequests", 0);
              resolve(events);
            },
            error => {
              context.commit("changeEventsLoadingError", {
                value: true,
                onlyMainEvents
              });
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changeEventsLoading", {
              value: false,
              onlyMainEvents
            });
          });
      });
    },
    fetchEventBySlug(context, slug) {
      context.commit("changeEventsLoading", true);
      context.commit("changeEventsLoadingError", false);
      const path = "wp/v2/events";
      const params = {
        _embed: true,
        slug
      };
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              const { data } = response;
              const events = formatter.formatEvents(data);
              context.commit("incrementFailedRequests", 0);
              resolve(events[0]);
            },
            error => {
              context.commit("changeEventsLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changeEventsLoading", false);
          });
      });
    },
    fetchPageBySlug(context, slug) {
      context.commit("changePageLoading", true);
      context.commit("changePageLoadingError", false);
      const path = "wp/v2/pages";
      const params = {
        _embed: true,
        slug
      };
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data } = response;
              const page = formatter.formatPage(data);
              context.commit("storePage", { page, slug });
              context.commit("incrementFailedRequests", 0);
              resolve(page);
            },
            error => {
              context.commit("changePageLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changePageLoading", false);
          });
      });
    },
    fetchGroups(context) {
      context.commit("changeGroupsLoading", true);
      context.commit("changeGroupsLoadingError", false);
      const path = "wp/v2/shgs";
      const params = {
        _embed: true,
        per_page: 100
      };
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data } = response;
              const groups = formatter.formatGroups(data);
              context.commit("storeGroups", groups);
              context.commit("incrementFailedRequests", 0);
              resolve(groups);
            },
            error => {
              context.commit("changeGroupsLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changeGroupsLoading", false);
          });
      });
    },
    fetchFacilities(context) {
      context.commit("changeFacilitiesLoading", true);
      context.commit("changeFacilitiesLoadingError", false);
      const path = "wp/v2/einrichtungen";
      const params = {
        _embed: true,
        per_page: 100
      };
      return new Promise((resolve, reject) => {
        api
          .fetchData(path, params)
          .then(
            response => {
              let { data } = response;
              const facilities = formatter.formatGroups(data);
              context.commit("storeFacilities", facilities);
              context.commit("incrementFailedRequests", 0);
              resolve(facilities);
            },
            error => {
              context.commit("changeFacilitiesLoadingError", true);
              context.commit("incrementFailedRequests", 1);
              reject(error);
            }
          )
          .finally(() => {
            context.commit("changeFacilitiesLoading", false);
          });
      });
    }
  }
});
