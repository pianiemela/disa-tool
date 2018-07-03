export const addSkillToTask = data => new Promise((resolve, reject) => {
  const response = {
    message: '<addSkillToTaskSuccess>',
    data
  }
  setTimeout(resolve, 100, response);
});