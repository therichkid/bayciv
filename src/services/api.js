import axios from "axios";

const wpInstance = axios.create({
  baseURL: "https://admin.bayciv.de/wp-json/",
  timeout: 7500
});

export default {
  async fetchData(path, params) {
    const response = await wpInstance.get(path, { params }).catch(error => {
      throw error;
    });
    return { data: response.data, headers: response.headers };
  },

  async postData(type, data, endpoint) {
    const response = await axios
      .post("/includes/submit.php", { type, data, endpoint })
      .catch(error => {
        if (typeof error === "string") {
          // Validation errors
          throw error;
        } else {
          console.error(error);
          throw defaultErrorMessage;
        }
      });
    const { success, message } = handleResponse(response, type, endpoint);
    if (success) {
      return message;
    } else {
      throw message;
    }
  }
};

const defaultErrorMessage =
  "Leider ist etwas schiefgegangen. Bitte versuchen Sie es später noch einmal.";

const handleResponse = (response, type, endpoint) => {
  if (type === "form") {
    return handleFormResponse(response);
  } else if (type === "newsletter") {
    return handleNewsletterResponse(response, endpoint);
  }
};

const handleFormResponse = response => {
  if (response.data.status === "mail_sent") {
    return {
      success: true,
      message: "Ihr Formular wurde erfolgreich versendet. Vielen Dank!"
    };
  } else {
    console.error(response);
    return {
      success: false,
      message: response.data.message || defaultErrorMessage
    };
  }
};

const handleNewsletterResponse = (response, endpoint) => {
  if (response.data.status === 201) {
    let successMessage;
    if (endpoint === "subscribe") {
      successMessage = "Registrierung erfolgreich! Sie erhalten in Kürze eine E-Mail.";
    } else {
      successMessage = "Sie haben sich erfolgreich vom Newsletter abgemeldet.";
    }
    return {
      success: true,
      message: successMessage
    };
  } else {
    let errorMessage;
    if (response.data.status === 200 && response.data.value.length) {
      const error = response.data.value[0].result.error;
      if (error.failed) {
        if (error.recipients.invalid.email) {
          errorMessage = "Die eingegebene E-Mail-Addresse ist ungültig.";
        } else if (endpoint === "subscribe" && error.recipients.duplicate.length) {
          errorMessage = "Die eingegebene E-Mail-Addresse ist bereits registriert.";
        }
      }
    }
    return {
      success: false,
      message: errorMessage || defaultErrorMessage
    };
  }
};
