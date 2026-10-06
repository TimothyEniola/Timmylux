export const MADE_TO_ORDER_NOTICE =
  "This item is currently made to order. Our team will contact you to confirm its estimated build timeline before production begins.";

export function isMadeToOrder(product) {
  return product?.available === false;
}
