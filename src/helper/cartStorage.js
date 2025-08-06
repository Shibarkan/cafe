const CART_KEY = 'sharedCart';

export const saveCart = (cart) =>
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

export const loadCart = () =>
  JSON.parse(localStorage.getItem(CART_KEY) || '[]');