import { Component } from 'react'

// Keeps the rest of the page alive if a child (e.g. the WebGL phone) throws.
class SafeBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

export default SafeBoundary
