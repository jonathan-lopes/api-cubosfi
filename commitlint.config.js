module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit) => /skip ci/.test(commit)],
};
