import type { Product } from "../types";
import type { PaginatedResponse } from "../api/api";

// Mock Products Data (8 products total)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Amazon Gift Card",
    gvtId: 1001,
    productTagline: "Shop millions of items on Amazon",
    shortDescription:
      "Redeemable on Amazon.com for millions of items including electronics, books, clothing and more.",
    longDescription:
      "Amazon Gift Cards are redeemable on Amazon.com for millions of items including electronics, books, clothing, home and garden, toys, and more. Perfect for birthdays, holidays, or any special occasion.",
    logoLocation: "https://example.com/logos/amazon.png",
    productUrl: "https://amazon.com",
    voucherTypeName: "Digital Gift Card",
    orderUrl: "https://example.com/order/amazon",
    productTitle: "Amazon Gift Card - Digital",
    variableDenomPriceMinAmount: "25.00",
    variableDenomPriceMaxAmount: "2000.00",
    __typename: "ProductInfo",
  },
  {
    id: 2,
    name: "Starbucks Gift Card",
    gvtId: 1002,
    productTagline: "Enjoy premium coffee and beverages",
    shortDescription:
      "Redeem at any Starbucks location for coffee, food, and merchandise.",
    longDescription:
      "Starbucks Gift Cards can be used at any Starbucks location worldwide for coffee, tea, food, and merchandise. Available in various denominations.",
    logoLocation: "https://example.com/logos/starbucks.png",
    productUrl: "https://starbucks.com",
    voucherTypeName: "Gift Card",
    orderUrl: "https://example.com/order/starbucks",
    productTitle: "Starbucks Gift Card",
    variableDenomPriceMinAmount: "10.00",
    variableDenomPriceMaxAmount: "500.00",
    __typename: "ProductInfo",
  },
  {
    id: 3,
    name: "Netflix Subscription",
    gvtId: 1003,
    productTagline: "Stream unlimited movies and TV shows",
    shortDescription:
      "1-month Netflix Premium subscription with unlimited streaming.",
    longDescription:
      "Enjoy unlimited streaming of movies and TV shows on Netflix with this 1-month Premium subscription. Watch on multiple devices simultaneously.",
    logoLocation: "https://example.com/logos/netflix.png",
    productUrl: "https://netflix.com",
    voucherTypeName: "Digital Subscription",
    orderUrl: "https://example.com/order/netflix",
    productTitle: "Netflix Premium - 1 Month",
    __typename: "ProductInfo",
  },
  {
    id: 4,
    name: "iTunes Gift Card",
    gvtId: 1004,
    productTagline: "Music, movies, apps and more",
    shortDescription:
      "Redeem for apps, music, movies, TV shows, and books on the App Store and iTunes.",
    longDescription:
      "iTunes Gift Cards can be used to purchase apps, music, movies, TV shows, books, and more from the App Store and iTunes. Works across all Apple devices.",
    logoLocation: "https://example.com/logos/itunes.png",
    productUrl: "https://apple.com/itunes",
    voucherTypeName: "Digital Gift Card",
    orderUrl: "https://example.com/order/itunes",
    productTitle: "iTunes Gift Card",
    variableDenomPriceMinAmount: "10.00",
    variableDenomPriceMaxAmount: "500.00",
    __typename: "ProductInfo",
  },
  {
    id: 5,
    name: "PlayStation Store Gift Card",
    gvtId: 1005,
    productTagline: "Games, DLC, and entertainment",
    shortDescription:
      "Purchase games, add-ons, and entertainment content on PlayStation Store.",
    longDescription:
      "PlayStation Store Gift Cards allow you to purchase games, downloadable content, movies, TV shows, and other entertainment content on the PlayStation Store.",
    logoLocation: "https://example.com/logos/playstation.png",
    productUrl: "https://playstation.com",
    voucherTypeName: "Gaming Gift Card",
    orderUrl: "https://example.com/order/playstation",
    productTitle: "PlayStation Store Gift Card",
    variableDenomPriceMinAmount: "20.00",
    variableDenomPriceMaxAmount: "1000.00",
    __typename: "ProductInfo",
  },
  {
    id: 6,
    name: "Uber Gift Card",
    gvtId: 1006,
    productTagline: "Ride and eat with Uber",
    shortDescription:
      "Use for Uber rides and Uber Eats food delivery services.",
    longDescription:
      "Uber Gift Cards can be used for Uber rides and Uber Eats food delivery. Available in various denominations and redeemable worldwide.",
    logoLocation: "https://example.com/logos/uber.png",
    productUrl: "https://uber.com",
    voucherTypeName: "Transportation Gift Card",
    orderUrl: "https://example.com/order/uber",
    productTitle: "Uber Gift Card",
    variableDenomPriceMinAmount: "15.00",
    variableDenomPriceMaxAmount: "300.00",
    __typename: "ProductInfo",
  },
  {
    id: 7,
    name: "Spotify Premium",
    gvtId: 1007,
    productTagline: "Music streaming without ads",
    shortDescription:
      "3-month Spotify Premium subscription with ad-free music streaming.",
    longDescription:
      "Enjoy ad-free music streaming, offline downloads, and high-quality audio with this 3-month Spotify Premium subscription.",
    logoLocation: "https://example.com/logos/spotify.png",
    productUrl: "https://spotify.com",
    voucherTypeName: "Digital Subscription",
    orderUrl: "https://example.com/order/spotify",
    productTitle: "Spotify Premium - 3 Months",
    __typename: "ProductInfo",
  },
  {
    id: 8,
    name: "Google Play Gift Card",
    gvtId: 1008,
    productTagline: "Apps, games, movies and more",
    shortDescription:
      "Purchase apps, games, movies, books, and music on Google Play.",
    longDescription:
      "Google Play Gift Cards can be used to purchase apps, games, movies, TV shows, books, and music on Google Play Store.",
    logoLocation: "https://example.com/logos/google-play.png",
    productUrl: "https://play.google.com",
    voucherTypeName: "Digital Gift Card",
    orderUrl: "https://example.com/order/google-play",
    productTitle: "Google Play Gift Card",
    variableDenomPriceMinAmount: "10.00",
    variableDenomPriceMaxAmount: "500.00",
    __typename: "ProductInfo",
  },
];

// Mock Paginated Responses
export const mockPaginatedResponse: PaginatedResponse<Product> = {
  data: mockProducts.slice(0, 5),
  page: 1,
  limit: 10,
  total: mockProducts.length,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

export const mockPaginatedResponsePage2: PaginatedResponse<Product> = {
  data: mockProducts.slice(5, 8),
  page: 2,
  limit: 5,
  total: mockProducts.length,
  totalPages: 2,
  hasNext: false,
  hasPrev: true,
};

// Mock Single Product
export const mockSingleProduct: Product = mockProducts[0];

// Mock Product for Creation (without ID)
export const mockProductForCreation: Omit<Product, "id"> = {
  name: "Steam Gift Card",
  gvtId: 1009,
  productTagline: "Games and software on Steam",
  shortDescription: "Purchase games, software, and DLC on the Steam platform.",
  longDescription:
    "Steam Gift Cards can be used to purchase games, software, downloadable content, and other items on the Steam platform.",
  logoLocation: "https://example.com/logos/steam.png",
  productUrl: "https://store.steampowered.com",
  voucherTypeName: "Gaming Gift Card",
  orderUrl: "https://example.com/order/steam",
  productTitle: "Steam Gift Card",
  variableDenomPriceMinAmount: "5.00",
  variableDenomPriceMaxAmount: "200.00",
  __typename: "ProductInfo",
};

// Mock Product for Update
export const mockUpdatedProduct: Product = {
  ...mockSingleProduct,
  name: "Amazon Gift Card - Updated",
  productTagline: "Updated - Shop millions of items on Amazon",
  shortDescription:
    "Updated - Redeemable on Amazon.com for millions of items including electronics, books, clothing and more.",
  longDescription:
    "Updated - Amazon Gift Cards are redeemable on Amazon.com for millions of items including electronics, books, clothing, home and garden, toys, and more. Perfect for birthdays, holidays, or any special occasion.",
};

// Helper Functions for Tests
export const createMockProduct = (
  overrides: Partial<Product> = {}
): Product => ({
  id: 999,
  name: "Test Product",
  gvtId: 9999,
  productTagline: "Test tagline",
  shortDescription: "Test short description",
  longDescription: "Test long description",
  logoLocation: "https://example.com/test-logo.png",
  productUrl: "https://example.com/test-product",
  voucherTypeName: "Test Voucher",
  orderUrl: "https://example.com/order/test",
  productTitle: "Test Product Title",
  variableDenomPriceMinAmount: "10.00",
  variableDenomPriceMaxAmount: "100.00",
  __typename: "ProductInfo",
  ...overrides,
});

export const createMockPaginatedResponse = (
  products: Product[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<Product> => ({
  data: products,
  page,
  limit,
  total: products.length,
  totalPages: Math.ceil(products.length / limit),
  hasNext: page < Math.ceil(products.length / limit),
  hasPrev: page > 1,
});
