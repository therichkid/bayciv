const SHIFT_CHARS_BY = 10;

export default {
  encrypt: input => {
    const encrypted = btoa(input);
    const shifted = shift(encrypted);

    return shifted;
  },

  decrypt: input => {
    const unshifted = unshift(input);
    const decrypted = atob(unshifted);

    return decrypted;
  }
};

const shift = input => {
  return rotate(input, SHIFT_CHARS_BY);
};

const unshift = input => {
  return rotate(input, -SHIFT_CHARS_BY);
};

const rotate = (input, shiftBy) => {
  const output = [];
  for (const letter of input) {
    let code = letter.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      code += shiftBy;
      if (code < 65) {
        code += 26;
      } else if (code > 90) {
        code -= 26;
      }
    } else if (code >= 97 && code <= 122) {
      code += shiftBy;
      if (code < 97) {
        code += 26;
      } else if (code > 122) {
        code -= 26;
      }
    }
    output.push(String.fromCharCode(code));
  }
  return output.join("");
};
