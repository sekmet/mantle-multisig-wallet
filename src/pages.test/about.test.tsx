import { render, screen } from '@testing-library/react';

import About from '@/pages/about';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('About page', () => {
  describe('Render method', () => {
    it('should have two paragraphs of `Multi Signature Wallet`', () => {
      render(<About />);

      const paragraph = screen.getAllByText(
        /A simple Multi Signature Wallet for BitDAO, ERC20, ERC721 transactions on Mantle Testnet./
      );

      expect(paragraph).toHaveLength(2);
    });
  });
});
