<template>
  <v-dialog :value="dialog" max-width="750" persistent>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="headline">Kalender-Export</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="closeDialog()" dark v-on="on" aria-label="Schließen">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Schließen</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text class="mt-2" style="overflow-y: auto; max-height: calc(90vh - 122px)">
        <!-- Alert -->
        <v-alert v-if="alert" :type="alertType" dismissible>
          {{ alertMessage }}
        </v-alert>

        <!-- Date -->
        <h3 class="subheading">Zeitraum:</h3>
        <v-row align="center">
          <v-col cols="12" sm="6">
            <v-menu
              v-model="isStartDateOpen"
              :close-on-content-click="false"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDateFormatted"
                  label="Von"
                  prepend-icon="mdi-calendar"
                  readonly
                  hide-details
                  v-on="on"
                  class="date-select"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                type="month"
                locale="de-DE"
                no-title
                @input="isStartDateOpen = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              v-model="isEndDateOpen"
              :close-on-content-click="false"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDateFormatted"
                  label="Bis einschließlich"
                  prepend-icon="mdi-calendar"
                  readonly
                  hide-details
                  v-on="on"
                  class="date-select"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                type="month"
                locale="de-DE"
                no-title
                @input="isEndDateOpen = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <!-- Group filter -->
        <h3 class="subheading mt-2">Filter:</h3>
        <v-radio-group v-model="groupFilter" @change="resetGroupFilter()">
          <v-radio value="all" label="Alles"></v-radio>
          <v-radio value="onlySpecific">
            <template v-slot:label>
              <v-row align="start">
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="selectedGroups"
                    :items="groups"
                    item-text="name"
                    item-value="category.slug"
                    clearable
                    multiple
                    label="Selbsthilfegruppen"
                    hide-details
                    :disabled="groupFilter === 'all'"
                    class="mt-0 pt-0"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="includeMainEvents"
                    label="Inklusive Hauptveranstaltungen"
                    hide-details
                    :disabled="groupFilter === 'all'"
                    class="mt-0"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </template>
          </v-radio>
        </v-radio-group>

        <!-- Format -->
        <h3 class="subheading mt-2">Format:</h3>
        <v-row align="start">
          <v-col cols="12" sm="4">
            <v-select
              :items="formatOptions"
              v-model="format"
              prepend-icon="mdi-file-outline"
              hide-details
              class="mt-0 pt-0"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="8">
            <v-alert
              type="info"
              colored-border
              border="left"
              elevation="2"
              v-model="showFormatInfo"
            >
              <span class="body-2 text--secondary" v-html="formatInfo"></span>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn left @click="closeDialog()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          :disabled="!startDate || !endDate || endDate < startDate"
          :loading="isExporting"
          @click="exportEvents()"
        >
          <span>Exportieren</span>
          <v-icon right>mdi-export</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    groups: Array
  },

  data() {
    return {
      startDate: null,
      isStartDateOpen: false,
      endDate: null,
      isEndDateOpen: false,
      groupFilter: "all",
      selectedGroups: [],
      includeMainEvents: true,
      formatOptions: [
        { text: "iCalendar", value: "iCal" },
        { text: "Excel", value: "csv" }
      ],
      format: "iCal",
      showFormatInfo: true,
      isExporting: false,
      alert: false,
      alertType: "",
      alertMessage: ""
    };
  },

  computed: {
    startDateFormatted() {
      return this.formatDate(this.startDate);
    },
    endDateFormatted() {
      return this.formatDate(this.endDate);
    },
    formatInfo() {
      if (this.format === "iCal") {
        return "Importformat für <b>Google Kalender</b>, <b>iCloud Kalender</b>, <b>Microsoft Outlook</b>, <b>Mozilla Thunderbird</b>, ...";
      } else {
        return "CSV-Dateiformat zum Lesen und Bearbeiten in <b>Microsoft Excel</b>, <b>LibreOffice Calc</b>, ...";
      }
    }
  },

  methods: {
    formatDate(date) {
      if (!date) {
        return null;
      }
      if (typeof Intl == "object" && typeof Intl.DateTimeFormat == "function") {
        return new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "long" }).format(
          new Date(date)
        );
      } else {
        const [year, month] = date.split("-");
        return `${month}.${year}`;
      }
    },
    closeDialog() {
      this.alert = false;
      this.$emit("dialog");
    },
    resetGroupFilter() {
      if (this.groupFilter === "all") {
        this.selectedGroups = [];
        this.includeMainEvents = true;
      }
    },
    async exportEvents() {
      this.isExporting = true;
      this.alert = false;
      let events = [];
      try {
        if (this.groupFilter === "onlySpecific") {
          events = await this.getGroupEvents();
        } else {
          events = await this.getAllEvents();
        }
      } catch (error) {
        console.error(error);
        return this.showAlert("error");
      } finally {
        this.isExporting = false;
      }
      if (this.format === "iCal") {
        const icsString = this.createIcsData(events);
        this.openDownloadPrompt(icsString, "ics");
      } else if (this.format === "csv") {
        const bom = "\uFEFF"; // Byte order mark: force excel to use utf-8 encoding
        const csvString = this.createCsvData(events);
        this.openDownloadPrompt(bom + csvString, "csv");
      }
      this.showAlert("success");
    },
    async getGroupEvents() {
      let events = [];
      const [startYear, startMonth] = this.shared.splitDate(this.startDate, true);
      const startDate = this.shared.getStartOfMonthDate(startYear, startMonth);
      const [endYear, endMonth] = this.shared.splitDate(this.endDate, true);
      const endDate = this.shared.getEndOfMonthDate(endYear, endMonth);
      const nowDate = new Date().toISOString().substr(0, 7).split("-").join("") + "01";
      for (const group of this.selectedGroups) {
        const eventsFetched = this.$store.getters.getFetchedEventsPerGroup(group);
        if (eventsFetched[0] && startDate >= nowDate) {
          // Already fetched
          events.push(...this.filterEvents(eventsFetched[1], startDate, endDate));
        } else {
          // Not fetched yet
          events.push(
            ...(await this.$store
              .dispatch("fetchEvents", {
                startDate,
                endDate,
                groupName: group
              })
              .catch(error => {
                throw error;
              }))
          );
        }
      }
      if (this.includeMainEvents) {
        const eventsFetched = this.$store.getters.getFetchedMainEvents();
        if (eventsFetched[0] && startDate >= nowDate) {
          // Already fetched
          events.push(...this.filterEvents(eventsFetched[1], startDate, endDate));
        } else {
          // Not fetched yet
          events.push(
            ...(await this.$store
              .dispatch("fetchEvents", {
                startDate,
                endDate,
                onlyMainEvents: true
              })
              .catch(error => {
                throw error;
              }))
          );
        }
      }
      return events;
    },
    async getAllEvents() {
      let events = [];
      let [startYear, startMonth] = this.shared.splitDate(this.startDate, true);
      let [endYear, endMonth] = this.shared.splitDate(this.endDate, true);
      // Filter first and last month
      let firstEventsFetched = [true, null];
      while (firstEventsFetched[0] && (startMonth < endMonth || startYear < endYear)) {
        firstEventsFetched = this.$store.getters.getFetchedEvents(startYear, startMonth);
        if (firstEventsFetched[0]) {
          events.push(...firstEventsFetched[1]);
          if (startMonth === 12) {
            startMonth = 1;
            startYear += 1;
          } else {
            startMonth += 1;
          }
        }
      }
      let lastEventsFetched = [true, null];
      while (lastEventsFetched[0] && (startMonth < endMonth || startYear < endYear)) {
        lastEventsFetched = this.$store.getters.getFetchedEvents(endYear, endMonth);
        if (lastEventsFetched[0]) {
          events.push(...lastEventsFetched[1]);
          if (endMonth === 1) {
            endMonth = 12;
            endYear -= 1;
          } else {
            endMonth -= 1;
          }
        }
      }
      const startDate = this.shared.getStartOfMonthDate(startYear, startMonth);
      const endDate = this.shared.getEndOfMonthDate(endYear, endMonth);
      events.push(
        ...(await this.$store.dispatch("fetchEvents", { startDate, endDate }).catch(error => {
          throw error;
        }))
      );
      return events;
    },
    filterEvents(events, startDate, endDate) {
      return events.filter(event => {
        const eventDate = event.startDate.split("-").join("");
        return eventDate >= startDate && eventDate <= endDate;
      });
    },
    createIcsData(events) {
      return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:https://www.bayciv.de/events
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events
  .map(
    event => `BEGIN:VEVENT
UID:bayciv-event-${event.slug}
SUMMARY:${event.title}
DESCRIPTION:${this.shared.stripHtml(event.excerpt)}
DTSTAMP:${this.createIcsDateString(event.start)}
DTSTART:${this.createIcsDateString(event.start)}
DTEND:${this.createIcsDateString(event.end) || this.createIcsDateString(event.start)}
CATEGORIES:${event.groups.map(group => group.name).join()}
LOCATION:${event.address}
URL:https://www.bayciv.de/events/${event.startDate}/${event.slug}
END:VEVENT`
  )
  .join("\n")}
END:VCALENDAR`.replace(/\r?\n/g, "\r\n");
    },
    createIcsDateString(date) {
      if (date) {
        const dt = new Date(date).toISOString();
        return `${dt.substr(0, 10).split("-").join("")}T${dt.substr(11, 8).split(":").join("")}Z`;
      }
      return "";
    },
    createCsvData(events) {
      const header = "Datum von,Zeit von,Datum bis,Zeit bis,Veranstaltung,Kategorien,Adresse,Link";
      const rows = events
        .sort((a, b) => a.start.localeCompare(b.start, undefined, { sensitivity: "base" }))
        .map(event => [
          this.createCsvDateString(event.startDate),
          event.startTime,
          this.createCsvDateString(event.endDate),
          event.endTime,
          `"${this.escapeCsvCharacters(event.title)}"`,
          `"${this.addCsvCategories(event)}"`,
          `"${this.escapeCsvCharacters(event.address)}"`,
          `https://www.bayciv.de/events/${event.startDate}/${event.slug}`
        ]);
      return [header, ...rows].join("\n");
    },
    createCsvDateString(date) {
      if (date) {
        return new Date(date).toLocaleDateString("de-DE");
      }
      return "";
    },
    escapeCsvCharacters(string) {
      return string.replace(/"/g, '""');
    },
    addCsvCategories(event) {
      const categories = [];
      if (event.featured) {
        categories.push("Hauptveranstaltung");
      }
      event.groups.forEach(group => categories.push(group.name));
      return categories.join(", ");
    },
    openDownloadPrompt(string, extension) {
      const element = document.createElement("a");
      const dataType = extension === "ics" ? "text/calendar" : "text/csv";
      element.setAttribute("href", `data:${dataType};charset=utf-8,${encodeURIComponent(string)}`);
      element.setAttribute(
        "download",
        `BayCIV-Veranstaltungen-${this.createIcsDateString(Date.now())}.${extension}`
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    showAlert(type) {
      this.alert = true;
      this.alertType = type;
      if (type === "success") {
        this.alertMessage = "Veranstaltungen erfolgreich exportiert!";
      } else {
        this.alertMessage =
          "Export fehlgeschlagen! Versuchen Sie es mit einem kürzeren Zeitraum oder filtern Sie die Selbsthilfegruppen.";
      }
    }
  },

  mounted() {
    const now = new Date();
    this.startDate = now.toISOString().substr(0, 7);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 6).toISOString().substr(0, 7);
  }
};
</script>

<style scoped>
.date-select >>> input {
  cursor: pointer;
}
</style>
