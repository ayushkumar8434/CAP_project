import { Link } from 'react-router-dom'
import './Orders.css'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)

const STATUS_LABELS = {
  paid: 'Paid',
  pending: 'Payment pending',
  pay_on_delivery: 'Pay on delivery',
}

function loadOrders() {
  const token = localStorage.getItem('authToken')
  if (!token) return null
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const all = JSON.parse(localStorage.getItem('orders') || '[]')
  return all.filter((o) => o.userEmail === user.email)
}

function Orders() {
  const orders = loadOrders()

  if (orders === null) {
    return (
      <main className="orders-page">
        <div className="orders-inner orders-empty">
          <h1>Your Orders</h1>
          <p>Please log in to see your orders.</p>
          <Link to="/login" className="np-button np-button--primary">Log in</Link>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-inner orders-empty">
          <h1>Your Orders</h1>
          <p>You have not placed any orders yet.</p>
          <Link to="/phones" className="np-button np-button--primary">Browse Phones</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <div className="orders-inner">
        <h1>Your Orders</h1>
        {orders.map((order) => (
          <section key={order.reference} className="order-card">
            <header className="order-card-head">
              <div>
                <p className="order-card-ref">Order {order.reference}</p>
                <p className="order-card-meta">
                  Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className={`order-status order-status--${order.paymentStatus}`}>
                {STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
              </span>
            </header>

            <div className="order-card-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-card-item">
                  <div>
                    <p className="order-card-brand">{item.brand}</p>
                    <p className="order-card-title">{item.title}</p>
                    <p className="order-card-meta">{item.storage} • {item.condition}</p>
                  </div>
                  <p className="order-card-price">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>

            <footer className="order-card-foot">
              <p className="order-card-meta">
                Payment: {order.paymentMethod || 'Card'}<br />
                Deliver to: {order.customer.address}, {order.customer.city} {order.customer.pincode}
              </p>
              <p className="order-card-total">Total {formatPrice(order.total)}</p>
            </footer>
          </section>
        ))}
      </div>
    </main>
  )
}

export default Orders
