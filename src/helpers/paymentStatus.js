const { isAfter } = require('date-fns');

const isOverdue = (dueDate, status) => {
  return isAfter(Date.now(), new Date(dueDate)) && status === 'pending';
};

const isPending = (dueDate, status) => {
  return isAfter(new Date(dueDate), Date.now()) && status === 'pending';
};

module.exports = { isOverdue, isPending };
