function safeGet(obj, path) {
  const keys = path.split('.');
  return keys.reduce((current, key) => {
    return current?.[key] ?? 'Nice try but that doesn not exist here';
  }, obj);
}

const userAndCity = {
  name: 'Xavier',
  profile: {
    address: {
      city: 'Waregem',
    },
  },
};

console.log(safeGet(userAndCity, 'profile.address.city'));
console.log(safeGet(userAndCity, 'profile.phone.mobile'));
