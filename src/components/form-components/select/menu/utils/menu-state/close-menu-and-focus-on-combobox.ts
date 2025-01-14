import type { RefObject } from 'react';

interface CloseMenuAndFocusOnComboboxParams {
  containerRef: RefObject<HTMLDivElement>;
  comboboxRef: RefObject<HTMLInputElement>;
}

/**
 * Closes the menu and returns focus to the element referenced by the provided
 * `comboboxRef`.
 */
export function closeMenuAndFocusOnCombobox({
  containerRef,
  comboboxRef,
}: CloseMenuAndFocusOnComboboxParams) {
  if (containerRef.current) {
    containerRef.current.classList.add('hidden');

    if (comboboxRef.current) {
      comboboxRef.current.setAttribute('aria-expanded', 'false');
      comboboxRef.current.focus();
    }
  }
}
