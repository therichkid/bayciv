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

  async postData(type, data, id) {
    const response = await axios.post("/includes/submit.php", { type, data, id }).catch(error => {
      if (typeof error === "string") {
        // Validation errors
        throw error;
      } else {
        console.error(error);
        throw defaultErrorMessage;
      }
    });
    const { success, message } = handleResponse(type, response);
    if (success) {
      return message;
    } else {
      throw message;
    }
  }
};

const defaultErrorMessage =
  "Leider ist etwas schiefgegangen. Bitte versuchen Sie es später noch einmal.";

const handleResponse = (type, response) => {
  if (type === "form") {
    return handleFormResponse(response);
  } else if (type === "newsletter") {
    return handleNewsletterResponse(response);
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

const handleNewsletterResponse = response => {
  if (response.data.status === 201) {
    return {
      success: true,
      message: "Registrierung erfolgreich! Sie erhalten in Kürze eine E-Mail."
    };
  } else {
    let message;
    if (response.data.status === 200 && response.data.value.length) {
      // Only one recipient for each request -> 1st value of Array
      const error = response.data.value[0].result.error;
      if (error.failed) {
        if (error.recipients.invalid.length) {
          message = "Die eingegebene E-Mail-Addresse ist ungültig.";
        } else if (error.recipients.duplicate.length) {
          message = "Die eingegebene E-Mail-Addresse ist bereits registriert.";
        }
      }
    }
    return {
      success: false,
      message: message || defaultErrorMessage
    };
  }
};
