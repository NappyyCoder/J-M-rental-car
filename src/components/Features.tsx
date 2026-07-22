export function Features() {
  return (
    <section className="section features">
      <div className="container">
        <div className="section-intro center">
          <p className="label">Why J&amp;M</p>
          <h2>What makes us different</h2>
        </div>
        <div className="features-showcase">
          <div className="features-copy">
            <p>
              Local ownership, transparent requirements, and a fleet you can browse before you call.
              No airport counters — just straightforward rentals in Virginia Beach.
            </p>
          </div>
          <div className="dash-card" aria-label="Rental snapshot">
            <div className="dash-row">
              <div className="dash-stat">
                <span className="dash-label">Location</span>
                <strong>Virginia Beach, VA</strong>
              </div>
              <div className="dash-stat">
                <span className="dash-label">Minimum age</span>
                <strong>25+</strong>
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-stat">
                <span className="dash-label">Deposit</span>
                <strong>$150 – $200</strong>
              </div>
              <div className="dash-stat">
                <span className="dash-label">Payment</span>
                <strong>Card only</strong>
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-stat wide">
                <span className="dash-label">Additional driver</span>
                <strong>$50.00</strong>
              </div>
            </div>
            <div className="dash-footer">
              <span>Valid license required at pickup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
