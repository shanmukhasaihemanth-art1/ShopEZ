const Cart = require('../models/Cart');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const itemSize = size || '';

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      // Cart exists — check if same product AND same size already in cart
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId && item.size === itemSize
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, size: itemSize });
      }
      await cart.save();
    } else {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity, size: itemSize }]
      });
      await cart.save();
    }

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };