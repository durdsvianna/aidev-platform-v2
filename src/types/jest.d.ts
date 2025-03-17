import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(className: string): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | string[] | number): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeRequired(): R
      toBeValid(): R
      toBeInvalid(): R
      toBeVisible(): R
      toBeChecked(): R
      toBeEmpty(): R
      toBeEmptyDOMElement(): R
      toHaveFocus(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(htmlText: string): R
    }
  }
} 