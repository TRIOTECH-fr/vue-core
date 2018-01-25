const Y = f => (...args) => f(Y(f))(...args);

export default Y;
