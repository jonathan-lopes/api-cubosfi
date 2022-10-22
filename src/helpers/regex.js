const validadePhone = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/gm;
const validateCPF =
  /([0-9]{2}.?[0-9]{3}.?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}.?[0-9]{3}.?[0-9]{3}[-]?[0-9]{2})/gm;
const validateStatus = /^p(aid|ending)$/gm;

module.exports = {
  validadePhone,
  validateCPF,
  validateStatus,
};
