import "./styles/legal.css";

function Legal() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Legal Information</h1>
        <p className="last-updated">Last updated: July 2026</p>

        <section>
          <h2>Privacy Policy</h2>
          <p>
            PizzaRoki respects your privacy. We only collect the information
            necessary to process your orders and provide our services.
          </p>

          <p>
            Your personal information such as your name, email address, phone
            number and delivery address is never sold or shared with third
            parties except when required to complete your order or comply with
            legal obligations.
          </p>
        </section>

        <section>
          <h2>Terms & Conditions</h2>

          <p>
            By using this website you agree to use it responsibly and provide
            accurate information when placing an order.
          </p>

          <p>
            PizzaRoki reserves the right to refuse or cancel orders in cases of
            incorrect pricing, unavailable products, suspected fraud or other
            exceptional circumstances.
          </p>
        </section>

        <section>
          <h2>Cookie Policy</h2>

          <p>
            This website uses cookies to improve your browsing experience,
            remember your preferences and keep you logged in.
          </p>

          <p>
            By continuing to use this website you consent to the use of
            cookies.
          </p>
        </section>

        <section>
          <h2>Delivery Information</h2>

          <ul>
            <li>Delivery is available within our service area.</li>
            <li>Estimated delivery times may vary during busy periods.</li>
            <li>Please ensure your delivery information is accurate.</li>
            <li>Payment is available using the methods offered at checkout.</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>

          <p>
            <strong>PR Pizzerija Roki</strong>
          </p>

          <p>📍 Aranj Janosa 32a, Zrenjanin</p>
          <p>📧 pizzaroki@gmail.com</p>
          <p>📞 +381 XX XXX XXXX</p>
        </section>
      </div>
    </div>
  );
}

export default Legal;