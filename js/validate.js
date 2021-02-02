let store_error = [];
let defaults = {
  errorTag: "small",
  errorClass: "error_message",
  addClass: "",
  inputBorder: true,
  inputBorderClass: "error_input",
  addInputBorderClass: "",
};

function setDefault(e) {
  if (is_true(e.errorTag)) defaults.errorTag = e.errorTag;
  if (is_true(e.errorClass)) defaults.errorClass = e.errorClass;
  if (is_true(e.addClass)) defaults.addClass = e.addClass;
  if (is_true(e.inputBorder)) defaults.inputBorder = e.inputBorder;
  if (is_true(e.inputBorderClass))
    defaults.inputBorderClass = e.inputBorderClass;
  if (is_true(e.addInputBorderClass))
    defaults.addInputBorderClass = e.addInputBorderClass;
}

let defaultMessage = {
  required: "This filed is required",
  number: "Only number is acceptable",
  email: "Invalid email address",
  // min: "",
  // max: "",
  // minmax: "",
  // equal: "",
  // equalNumber: "",
  isHTML: "This filed is containing HTML tag",
  equalTo: "Those two filed are does not match",
  // word: "",
};

// function setDefaultMessage(e) {
//   if (is_true(e.required)) defaultMessage.required = e.required;
//   if (is_true(e.number)) defaultMessage.number = e.number;
//   if (is_true(e.email)) defaultMessage.email = e.email;
//   // if (is_true(e.min)) defaultMessage.min = e.min;
//   // if (is_true(e.max)) defaultMessage.max = e.max;
//   // if (is_true(e.minmax)) defaultMessage.minmax = e.minmax;
//   // if (is_true(e.equal)) defaultMessage.equal = e.equal;
//   // if (is_true(e.equalNumber)) defaultMessage.equalNumber = e.equalNumber;
//   if (is_true(e.isHTML)) defaultMessage.isHTML = e.isHTML;
//   if (is_true(e.equalTo)) defaultMessage.equalTo = e.equalTo;
//   // if (is_true(e.word)) defaultMessage.word = e.word;
// }

function validation_init() {
  store_error = [];

  let prev_error_mess = document.querySelectorAll(
    `form ${defaults.errorTag}.${defaults.errorClass}`
  );
  prev_error_mess.forEach((single) => {
    single.remove();
  });
  document
    .querySelectorAll(`form input.${defaults.inputBorderClass}`)
    .forEach((singleInp) => {
      singleInp.classList.remove(defaults.inputBorderClass);
    });
  setDefault({
    errorTag: "small",
    errorClass: "error_message",
    addClass: "",
    inputBorder: true,
    inputBorderClass: "error_input",
    addInputBorderClass: "",
  });
}
function is_validate() {
  if (store_error.length === 0) {
    validation_init();
    return true;
  } else {
    return false;
  }
}
// This function is for checking input value is empty or not
function required(input, message) {
  let final_message = defaultMessage.required;
  if (is_true(message)) final_message = message;

  if (get_length(input) === 0) {
    error_message(input, final_message);
  } else {
    remove_error_message(input);
  }
}
// This function is for checking input value is number or not
function number(input, message, numLimit, numLimitMessage) {
  let final_message = defaultMessage.number;
  if (is_true(message)) final_message = message;

  let Final_Num_Limit_Message = `This filed should be equal to ${numLimit} digits`;
  if (is_true(numLimitMessage)) Final_Num_Limit_Message = numLimitMessage;

  if (is_true(numLimit)) {
    if (get_value(input) !== "" && isNaN(get_value(input)))
      error_message(input, final_message);

    if (
      get_value(input) !== "" &&
      get_length(input) !== numLimit &&
      !isNaN(get_value(input))
    )
      error_message(input, Final_Num_Limit_Message);
  } else {
    if (get_value(input) !== "" && isNaN(get_value(input))) {
      error_message(input, final_message);
    } else if (get_value(input) !== "" && !isNaN(get_value(input))) {
      remove_error_message(input);
    }
  }
}
// This function is for checking email is valid or not
function email(input, message) {
  let final_message = defaultMessage.email;
  if (is_true(message)) final_message = message;

  let inputVal = get_value(input);
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(inputVal).toLowerCase()) && inputVal !== "") {
    remove_error_message(input);
  } else if (!re.test(String(inputVal).toLowerCase()) && inputVal !== "") {
    error_message(input, final_message);
  }
}
function min(input, value, message) {
  let final_message = `Must be equal or grater than ${value} charecter`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (get_length(input) < value) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

function equal(input, value, message) {
  let final_message = `Must be equal to ${value} charecter`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (get_length(input) !== value) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

function equalNumber(input, value, message) {
  let final_message = `Must be equal to ${value} charecter & must be only number`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (get_length(input) !== value || isNaN(get_value(input))) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

function max(input, value, message) {
  let final_message = `Must be equal or less than ${value} charecter`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (get_length(input) > value) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

function minmax(input, min, max, message) {
  let final_message = `Must be greater than ${min} & less than ${max} charecter`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (get_length(input) < min || get_length(input) > max) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

function isHTML(input, message) {
  let final_message = defaultMessage.isHTML;
  if (is_true(message)) final_message = message;
  if (is_fill(input)) {
    var a = document.createElement("div");
    a.innerHTML = get_value(input);

    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) error_message(input, final_message);
      return true;
    }
    remove_error_message(input);
    return false;
  }
}

// This function is for matching password and confirm password
function equalTo(password, confirm_password, message) {
  let final_message = defaultMessage.equalTo;
  if (is_true(message)) final_message = message;

  let pass = get_value(password);
  let confirm_pass = confirm_password.value.trim();
  if (pass !== "" && confirm_pass !== "" && pass !== confirm_pass) {
    error_message(confirm_password, final_message);
  } else if (pass !== "" && confirm_pass !== "" && pass === confirm_pass) {
    remove_error_message(confirm_password);
  }
}
// This function is for count word from string
function word(input, countLimit, message) {
  let words = countLimit > 1 ? "words" : "word";
  let final_message = `This filed has to be in ${countLimit} ${words}`;
  if (is_true(message)) final_message = message;

  if (is_fill(input))
    if (count_word(get_value(input)) !== countLimit) {
      error_message(input, final_message);
    } else {
      remove_error_message(input);
    }
}

// This function is for set error message
function error_message(input, message) {
  let parent = input.parentElement;
  let small = document.createElement(defaults.errorTag);
  small.innerHTML = message;
  small.classList.add(defaults.errorClass);
  if (is_true(defaults.addClass)) small.classList.add(defaults.addClass);

  if (defaults.inputBorder) input.classList.add(defaults.inputBorderClass);

  if (is_true(defaults.addInputBorderClass))
    input.classList.add(defaults.addInputBorderClass);

  if (parent.querySelector(`${defaults.errorTag}.${defaults.errorClass}`)) {
    parent.querySelector(
      `${defaults.errorTag}.${defaults.errorClass}`
    ).innerHTML = message;
  } else {
    parent.append(small);
    store_error.push("error");
  }
}
// This function is for remove error message
function remove_error_message(input) {
  let parentElemnt = input.parentElement;
  if (
    parentElemnt.querySelector(`${defaults.errorTag}.${defaults.errorClass}`)
  ) {
    parentElemnt
      .querySelector(`${defaults.errorTag}.${defaults.errorClass}`)
      .remove();
  }
  if (parentElemnt.querySelector(`.${defaults.inputBorderClass}`)) {
    parentElemnt
      .querySelector(`.${defaults.inputBorderClass}`)
      .classList.remove(defaults.inputBorderClass);
  }
}

// Extra Usefull functions

function get_value(input) {
  return input.value.trim();
}

function get_length(input) {
  return input.value.trim().length;
}

function is_fill(input) {
  if (get_value(input) !== "") {
    return true;
  } else {
    return false;
  }
}
function is_true(e) {
  if (e !== undefined && e !== null && e !== "") {
    return true;
  } else {
    return false;
  }
}

function escapeHtml(input) {
  let value = get_value(input);
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    // '"': "&quot;",
    // "'": "&#039;",
  };

  return value.replace(/[&<>]/g, function (m) {
    return map[m];
  });
}

function count_word(words) {
  return words.trim().split(" ").length;
}

function c(e) {
  console.log(e);
}

function a(e) {
  alert(e);
}
