import api from "../services/api";
import formatter from "../services/formatter";

export default {
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
    } else {
      Object.assign(params, {
        categories_exclude: [/* zahlen-fakten */ 100, /*nur-shg */ 146]
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
  fetchPostsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/posts";
    const params = {
      search,
      per_page: perPage
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
  async fetchEvents(context, { startDate, endDate, onlyMainEvents, groupName, storeEvents }) {
    context.commit("changeEventsLoading", { value: true, onlyMainEvents });
    context.commit("changeEventsLoadingError", {
      value: false,
      onlyMainEvents
    });
    let page = 1;
    let year, month;
    const path = "wp/v2/events";
    const params = {
      _embed: true,
      per_page: 100,
      page
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
        "filter[meta_query][1][compare]": "<="
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
    try {
      const response = await api.fetchData(path, params);
      const { data, headers } = response;
      let events = formatter.formatEvents(data);
      const totalPages = headers["x-wp-totalpages"];
      while (page < totalPages) {
        page++;
        params.page = page;
        const response = await api.fetchData(path, params);
        const { data } = response;
        events.push(...formatter.formatEvents(data));
      }
      if (storeEvents) {
        if (onlyMainEvents) {
          context.commit("storeMainEvents", events);
        } else if (groupName) {
          context.commit("storeEventsPerGroup", { events, groupName });
        } else {
          context.commit("storeEvents", { events, year, month });
        }
      }
      context.commit("incrementFailedRequests", 0);
      return events;
    } catch (error) {
      context.commit("changeEventsLoadingError", {
        value: true,
        onlyMainEvents
      });
      context.commit("incrementFailedRequests", 1);
    } finally {
      context.commit("changeEventsLoading", {
        value: false,
        onlyMainEvents
      });
    }
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
  fetchEventsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/events";
    const params = {
      search,
      per_page: perPage
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
    const groupEndpoints = [
      { path: "wp/v2/shgs", params: { _embed: true, per_page: 100 } },
      { path: "wp/v2/pages", params: { _embed: true, slug: "/eutb" } }
    ];
    return Promise.all(groupEndpoints.map(({ path, params }) => api.fetchData(path, params)))
      .then(responses => {
        const data = responses.map(({ data }) => data).flat();
        const groups = formatter.formatGroups(data);
        context.commit("storeGroups", groups);
        context.commit("incrementFailedRequests", 0);
        return groups;
      })
      .catch(error => {
        context.commit("changeGroupsLoadingError", true);
        context.commit("incrementFailedRequests", 1);
        throw error;
      })
      .finally(() => {
        context.commit("changeGroupsLoading", false);
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
  },
  async fetchMagazines(context) {
    context.commit("changeMagazinesLoading", true);
    context.commit("changeMagazinesLoadingError", false);
    try {
      const { data: rawMagazines } = await api.fetchData("wp/v2/magazin", {
        _embed: true,
        per_page: 100
      });
      const magazines = formatter.formatMagazines(rawMagazines);
      context.commit("storeMagazines", magazines);
      context.commit("incrementFailedRequests", 0);
      context.commit("changeMagazinesLoading", false);
      return magazines;
    } catch (error) {
      context.commit("changeMagazinesLoadingError", true);
      context.commit("incrementFailedRequests", 1);
      context.commit("changeMagazinesLoading", false);
      throw new Error(error);
    }
  },
  async fetchMagazineBySlug(context, slug) {
    context.commit("changeMagazinesLoading", true);
    context.commit("changeMagazinesLoadingError", false);
    try {
      const {
        data: [rawMagazine]
      } = await api.fetchData("wp/v2/magazin", { _embed: true, slug });
      const postIds = rawMagazine.acf.beitraege;
      const { data: rawPosts } = await api.fetchData("wp/v2/posts", {
        _embed: true,
        per_page: 100,
        include: postIds.join()
      });
      const magazine = formatter.formatMagazine(rawMagazine, rawPosts);
      context.commit("storeMagazine", { slug, magazine });
      context.commit("incrementFailedRequests", 0);
      context.commit("changeMagazinesLoading", false);
      return magazine;
    } catch (error) {
      context.commit("changeMagazinesLoadingError", true);
      context.commit("incrementFailedRequests", 1);
      context.commit("changeMagazinesLoading", false);
      throw new Error(error);
    }
  }
};
