
exports.formatDate = (date) => {
    const dateObj = new Date(date);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options);
    return formattedDate;
  };