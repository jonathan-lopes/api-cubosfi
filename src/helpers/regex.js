const validatePhone = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/gm;
const validateCPFCNPJ =
  /^(\d{2}.?\d{3}.?\d{3}\/?\d{4}-?\d{2})|(\d{3}.?){2}\d{3}-?\d{2}$/gm;
const validateStatus = /^p(aid|ending)$/gm;

module.exports = {
  validatePhone,
  validateCPFCNPJ,
  validateStatus,
};
