import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null}
  // state = { hasError: false, error: null, info: null}

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // this.setState({this.hasError, error, info})
    console.error(error, info);
  }

  render() {
    return this.state.hasError
      ? this.props.fallback // set fallback="Error...""
      : this.props.children;
  }

  // return this.state.hasError ? (
  //   <div><h1>Something went wrong.</h1>
  //     {process.env.NODE_ENV !== 'production' && (
  //       <details style={{ whiteSpace: 'pre-wrap' }}>
  //         <summary>Click for error details</summary>
  //         {this.state.error && this.state.error.toString()}
  //         <br />
  //         {this.state.info && this.state.info.componentStack}
  //       </details>
  //     )}
  //   </div>
  // ) : this.props.children
}

export default ErrorBoundary
