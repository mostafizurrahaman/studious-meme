import { describe, expect, it } from "vitest";
import { authFormSchemas, dashboardFormSchemas } from "./form-validation";

describe("form validation schemas", () => {
  it("validates forgot password flow fields", () => {
    expect(
      authFormSchemas.forgotPassword.safeParse({ email: "USER@EXAMPLE.COM" })
        .success,
    ).toBe(true);
    expect(
      authFormSchemas.forgotPasswordOtp.safeParse({ otp: "123456" }).success,
    ).toBe(true);
    expect(
      authFormSchemas.forgotPasswordReset.safeParse({
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }).success,
    ).toBe(true);
  });

  it("rejects mismatched reset passwords", () => {
    const result = authFormSchemas.forgotPasswordReset.safeParse({
      newPassword: "Strong@123",
      confirmPassword: "Strong@124",
    });

    expect(result.success).toBe(false);
  });

  it("accepts stock values on dashboard products", () => {
    expect(
      dashboardFormSchemas.product.safeParse({
        title: "Test",
        slug: "test",
        sku: "SKU-1",
        price: "100",
        oldPrice: "",
        brand: "Brand",
        category: "Category",
        stock: "12",
        rating: "5",
        isFeatured: false,
        isActive: true,
      }).success,
    ).toBe(true);
  });
});
