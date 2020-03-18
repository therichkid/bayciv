<template>
  <v-container>
    <h1 class="display-1 mb-2">Veranstaltungen</h1>

    <LoadingError v-if="loadingError" @retryAgain="forceUpdate()" />

    <v-row>
      <v-col>
        <!-- Header -->
        <v-card class="mb-3">
          <v-card-title>
            <v-btn outlined class="mr-2" @click="setToday()" :disabled="isLoading">
              Heute
            </v-btn>
            <v-btn fab text small @click="prev()" :disabled="isLoading">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next()" :disabled="isLoading">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <span class="headline text-truncate">{{ title }}</span>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined v-on="on">
                  <span>{{ typeToLabel[selectedType] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="type in types" :key="type" @click="onCalendarTypeChange(type)">
                  <v-list-item-title>{{ typeToLabel[type] }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <!-- Settings -->
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Filter</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="selectedGroups"
                      :items="groups"
                      item-text="name"
                      item-value="name"
                      multiple
                      clearable
                      label="Selbsthilfegruppen"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-checkbox
                      v-model="onlyMainEvents"
                      label="Nur Hauptveranstaltungen"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <!-- Calendar -->
        <!-- v-show here because the calendar ref is needed -->
        <v-sheet height="600" v-show="selectedType !== 'list'">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            locale="de-DE"
            firstInterval="8"
            intervalCount="14"
            eventMoreText="Mehr"
            :events="filteredEvents"
            :event-margin-bottom="3"
            :now="today"
            :type="selectedType !== 'list' ? selectedType : 'month'"
            :weekdays="weekdays"
            :intervalFormat="intervalFormat"
            @click:event="showEvent"
            @click:date="viewDay"
            @click:more="viewDay"
            @change="updateRange"
          ></v-calendar>

          <!-- Event popup -->
          <v-dialog
            v-model="isSelectedOpen"
            :activator="selectedElement"
            scrollable
            max-width="600px"
          >
            <EventModal :event="selectedEvent" type="popup" @close="isSelectedOpen = false" />
          </v-dialog>
        </v-sheet>

        <!-- Table list -->
        <v-simple-table class="elevation-2" v-if="selectedType === 'list'">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Datum</th>
                <th class="text-left">Zeit</th>
                <th class="text-left">Veranstaltung</th>
                <th class="text-left" v-if="!isMobile">Selbsthilfegruppe</th>
                <th style="width: 1px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in filteredEvents"
                :key="event.slug"
                :class="{ 'grey--text': event.startDate < today }"
              >
                <td>
                  <span class="title pr-1">{{ event.dayFormatted }}.</span>
                  <span class="caption pt-2">{{ event.monthFormatted }}</span>
                </td>
                <td>
                  {{ event.startTime }}
                  <span v-if="event.endTime">bis {{ event.endTime }}</span>
                </td>
                <td>
                  <span v-if="event.featured">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="secondary" class="mr-1" v-on="on">mdi-star</v-icon>
                      </template>
                      <span>Hauptevent</span>
                    </v-tooltip>
                  </span>
                  <span>{{ event.name }}</span>
                </td>
                <td v-if="!isMobile">{{ event.group }}</td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon right :to="`/events/${event.startDate}/${event.slug}`" v-on="on">
                        <v-icon>mdi-open-in-new</v-icon>
                      </v-btn>
                    </template>
                    <span>Event öffnen</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingError from "@/components/partials/LoadingError";
import EventModal from "@/components/events/EventModal";

export default {
  components: {
    LoadingError,
    EventModal
  },

  data() {
    return {
      today: null,
      focus: null,
      start: null,
      end: null,
      currentYear: null,
      currentMonth: null,
      fetchedDates: {},
      types: ["day", "4day", "week", "month", "list"],
      typeToLabel: {
        day: "Tag",
        "4day": "4 Tage",
        week: "Woche",
        month: "Monat",
        list: "Terminübersicht"
      },
      selectedGroups: [],
      groups: [],
      onlyMainEvents: false,
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      events: [],
      isLoading: false,
      selectedEvent: {},
      selectedElement: null,
      isSelectedOpen: false,
      isIE: /MSIE|Trident/.test(window.navigator.userAgent)
    };
  },

  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const prefixMonth = startMonth === endMonth ? "" : startMonth;
      const startYear = start.year;
      const endYear = end.year;
      const prefixYear = startYear === endYear ? "" : startYear;
      const startDay = start.day;
      const endDay = end.day;
      switch (this.selectedType) {
        case "day":
          return `${startDay}. ${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startDay}. ${prefixMonth} ${prefixYear} - ${endDay}. ${endMonth} ${endYear}`;
        case "month":
        case "list":
          return `${startMonth} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    loadingError() {
      return this.$store.state.eventsLoadingError;
    },
    isMobile() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return true;
      } else {
        return false;
      }
    },
    selectedType() {
      return this.$store.state.calendarView || (this.isMobile || this.isIE ? "list" : "month");
    },
    filteredEvents() {
      const filteredEvents = [];
      for (const event of this.events) {
        if (this.onlyMainEvents && !event.featured) {
          continue;
        }
        if (this.selectedGroups.length && !this.selectedGroups.includes(event.group)) {
          continue;
        }
        if (this.selectedType === "list") {
          const [eventYear, eventMonth] = this.shared.splitDate(event.start, true);
          if (
            this.currentYear > eventYear ||
            (this.currentYear === eventYear && this.currentMonth > eventMonth)
          ) {
            continue;
          }
        }
        filteredEvents.push(event);
      }
      return filteredEvents;
    }
  },

  watch: {
    focus: function(focus) {
      this.onFocusChange(focus);
    }
  },

  methods: {
    getToday() {
      return this.shared.getCurrentDate("-");
    },
    setToday() {
      this.focus = this.today;
    },
    viewDay({ date }) {
      this.focus = date;
      this.$store.commit("changeCalendarType", "day");
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.isSelectedOpen = true;
        }, 10);
      };
      if (this.isSelectedOpen) {
        this.isSelectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    async updateRange({ start, end }) {
      this.start = start;
      this.end = end;
      if (start.year !== this.currentYear || start.month !== this.currentMonth) {
        this.currentYear = start.year;
        this.currentMonth = start.month;
        try {
          this.isLoading = true;
          // Add the current events
          const currentEvents = await this.getEvents(this.currentYear, this.currentMonth);
          this.events = currentEvents;
          // Add events from the month before
          const previousYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear;
          const previousMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
          const previousEvents = await this.getEvents(previousYear, previousMonth);
          this.events.push(...previousEvents);
          // Add events from the month after
          const nextYear = this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear;
          const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1;
          const nextEvents = await this.getEvents(nextYear, nextMonth);
          this.events.push(...nextEvents);
        } catch (error) {
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async getEvents(year, month) {
      let events = [];
      const eventsFetched = this.$store.getters.getFetchedEvents(year, month);
      if (eventsFetched[0]) {
        // Already fetched
        events = eventsFetched[1];
      } else {
        // Not fetched yet
        events = await this.$store
          .dispatch("fetchEvents", {
            startDate: `${year}${month < 10 ? "0" + month : month}01`,
            endDate: `${year}${month < 9 ? "0" + (month + 1) : month + 1}01`
          })
          .catch(error => {
            throw error;
          });
      }
      return events;
    },
    forceUpdate() {
      this.currentYear = null;
      this.currentMonth = null;
      this.updateRange({ start: this.start, end: this.end });
    },
    intervalFormat(interval) {
      return interval.time;
    },
    onCalendarTypeChange(type) {
      this.$store.commit("changeCalendarType", type);
    },
    onFocusChange(focus) {
      this.$store.commit("changeCalendarFocus", focus);
    },
    async getGroups() {
      const groupsFetched = this.$store.getters.getFetchedGroups();
      if (groupsFetched[0]) {
        // Already fetched
        this.groups = groupsFetched[1];
      } else {
        // Not fetched yet
        this.groups = await this.$store
          .dispatch("fetchGroups")
          .catch(error => console.error(error));
      }
    }
  },

  created() {
    this.getGroups();
  },

  mounted() {
    this.today = this.getToday();
    this.focus = this.$store.state.calendarFocus || this.today;
    // Start checking the calendar change after the focus was updated
    setTimeout(() => {
      this.$refs.calendar.checkChange();
    }, 500);
  }
};
</script>

<style scoped>
.v-expansion-panel:before {
  box-shadow: none !important;
}
</style>
