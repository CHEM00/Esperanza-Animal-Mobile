import { telUrl, whatsappUrl } from "./contact-links";

describe("contact-links", () => {
  it("arma tel: solo con dígitos", () => {
    expect(telUrl("921 123 4567")).toBe("tel:9211234567");
  });

  it("arma WhatsApp con código de país y mensaje codificado", () => {
    expect(whatsappUrl("9211234567")).toBe("https://wa.me/529211234567");
    expect(whatsappUrl("9211234567", "Hola, encontré a Toby")).toBe(
      "https://wa.me/529211234567?text=Hola%2C%20encontr%C3%A9%20a%20Toby",
    );
  });
});
