export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // Obtiene el nombre del mes abreviado
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  