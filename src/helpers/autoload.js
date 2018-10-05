export default ((ctx) => {
  const keys = ctx.keys();
  const values = keys.map(ctx);
  return keys.reduce((carry, key, index) => {
    const name = key.match(/([\w]+)/)[0];
    carry[name] = values[index];
    return carry;
  }, {});
});
