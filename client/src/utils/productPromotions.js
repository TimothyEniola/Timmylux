export const INITIAL_PROMOTION_TIME = Date.now();

export function getPromotionStatus(promotion, now = INITIAL_PROMOTION_TIME) {
  if (!promotion || promotion.discountType !== "percentage") return "none";

  const discount = Number(promotion.discountValue);
  const startsAt = Date.parse(promotion.startsAt);
  const endsAt = Date.parse(promotion.endsAt);

  if (
    !Number.isFinite(discount) ||
    discount <= 0 ||
    discount > 100 ||
    !Number.isFinite(startsAt) ||
    !Number.isFinite(endsAt) ||
    endsAt <= startsAt
  ) {
    return "none";
  }

  if (now < startsAt) return "upcoming";
  if (now < endsAt) return "active";
  return "expired";
}

export function getProductPriceInfo(product, variation, now = Date.now()) {
  const regularPrice = Number(variation?.price || product?.price || 0);
  const status = getPromotionStatus(product?.promotion, now);

  if (status === "active") {
    const discountValue = Number(product.promotion.discountValue);
    return {
      status,
      regularPrice,
      price: Math.max(0, Math.round(regularPrice * (1 - discountValue / 100))),
      discountPercentage: Math.round(discountValue),
      endsAt: Date.parse(product.promotion.endsAt),
      startsAt: Date.parse(product.promotion.startsAt),
    };
  }

  if (status === "upcoming") {
    return {
      status,
      regularPrice,
      price: regularPrice,
      discountPercentage: Number(product.promotion.discountValue),
      startsAt: Date.parse(product.promotion.startsAt),
      endsAt: Date.parse(product.promotion.endsAt),
    };
  }

  const legacyOriginalPrice = Number(product?.originalPrice);
  const hasLegacyDiscount =
    Number.isFinite(legacyOriginalPrice) && legacyOriginalPrice > regularPrice;

  return {
    status,
    regularPrice,
    price: regularPrice,
    originalPrice: hasLegacyDiscount ? legacyOriginalPrice : null,
    discountPercentage: hasLegacyDiscount
      ? Math.round(((legacyOriginalPrice - regularPrice) / legacyOriginalPrice) * 100)
      : 0,
    endsAt: null,
    startsAt: null,
  };
}

export function formatRemainingTime(milliseconds) {
  const secondsTotal = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;
  const clock = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return days > 0 ? `${days}d ${clock}` : clock;
}

export function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function toIsoDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}
