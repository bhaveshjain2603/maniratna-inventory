export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatWeight = (weight) => {
  return weight?.toFixed(3) || '0.000';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const calculateNetWeight = (gross, stone, tag) => {
  return (gross - (stone || 0) - (tag || 0)).toFixed(3);
};
