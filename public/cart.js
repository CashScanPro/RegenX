/* ============================================================
   RegenX x Eric Favre - Panier (cart.js)
   Systeme de panier unifie : localStorage + modale (popup),
   sur le modele "Les Jardins Enchantes", adapte pour RegenX.
   - addToCart(id, name, price, priceId, variant)
   - addToCartWithSize(btn) : lit la saveur choisie (input[name="flavor"])
   - Modale panier (showCart / closeCart) avec recap + bouton Payer
   - checkout() -> POST /api/stripe/checkout-boutique -> redirection Stripe
   ============================================================ */
(function (window) {
  'use strict';

  // Incrementer cette version purge les anciens paniers (ex: changement de prix)
  var CART_VERSION = 'regenx-v1';
  var STORAGE_KEY  = 'regenx_cart';
  var VERSION_KEY  = 'regenx_cart_version';

  /* ---------- Stockage ---------- */
  function purgeOldCart() {
    if (localStorage.getItem(VERSION_KEY) !== CART_VERSION) {
      localStorage.setItem(STORAGE_KEY, '[]');
      localStorage.setItem(VERSION_KEY, CART_VERSION);
    }
  }

  function getCart() {
    purgeOldCart();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(VERSION_KEY, CART_VERSION);
    updateCartCount();
  }

  function lineKey(item) {
    return item.priceId + '::' + (item.variant || '');
  }

  /* ---------- Compteur header ---------- */
  function updateCartCount() {
    var cart = getCart();
    var n = cart.reduce(function (s, it) { return s + (it.qty || 1); }, 0);
    document.querySelectorAll('#cart-count, .cart-count').forEach(function (el) {
      el.textContent = n;
    });
  }

  /* ---------- Ajout ---------- */
  function addToCart(id, name, price, priceId, variant) {
    if (!priceId) { console.warn('addToCart: priceId manquant'); return; }
    var cart = getCart();
    var item = {
      id: id || priceId,
      name: name || 'Produit',
      price: parseFloat(price) || 0,
      priceId: priceId,
      variant: variant || '',
      qty: 1
    };
    var key = lineKey(item);
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) { found = cart[i]; break; }
    }
    if (found) { found.qty = (found.qty || 1) + 1; }
    else { cart.push(item); }
    saveCart(cart);
    showToast((variant ? name + ' (' + variant + ')' : name) + ' ajoute au panier');
  }

  // Lit la saveur choisie sur la fiche produit (input[name="flavor"]:checked)
  function addToCartWithSize(btn) {
    var scope = btn.closest('[data-product]') || document;
    var checked = scope.querySelector('input[name="flavor"]:checked, input[name="size"]:checked');
    var variant = checked ? checked.value : '';
    var priceId = (checked && checked.getAttribute('data-price-id')) ||
                  btn.getAttribute('data-product-id');
    addToCart(
      btn.getAttribute('data-product-id-base') || btn.getAttribute('data-product-name'),
      btn.getAttribute('data-product-name'),
      btn.getAttribute('data-product-price'),
      priceId,
      variant
    );
  }

  /* ---------- Quantites / suppression ---------- */
  function setQty(key, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) { cart[i].qty = Math.max(1, qty); break; }
    }
    saveCart(cart); renderCartModal();
  }
  function removeItem(key) {
    var cart = getCart().filter(function (it) { return lineKey(it) !== key; });
    saveCart(cart); renderCartModal();
  }
  function clearCart() { saveCart([]); renderCartModal(); }

  function cartTotal() {
    return getCart().reduce(function (s, it) { return s + (it.price || 0) * (it.qty || 1); }, 0);
  }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' \u20ac'; }

  /* ---------- Toast ---------- */
  function showToast(message) {
    var t = document.getElementById('regenx-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'regenx-toast';
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,#c8a85a,#e7d3a1);color:#0a0a0c;padding:14px 28px;border-radius:3px;font-family:Jost,sans-serif;font-size:.8rem;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;z-index:9999;opacity:0;transition:all .35s ease;box-shadow:0 10px 30px -8px rgba(0,0,0,.6);';
      document.body.appendChild(t);
    }
    t.textContent = message;
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  /* ---------- Modale panier ---------- */
  function ensureCartModal() {
    if (document.getElementById('regenx-cart-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'regenx-cart-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:9998;display:none;align-items:flex-start;justify-content:flex-end;';
    overlay.innerHTML =
      '<div id="regenx-cart-panel" style="width:100%;max-width:440px;height:100%;background:linear-gradient(180deg,#141416,#0e0e10);border-left:1px solid rgba(200,168,90,.22);display:flex;flex-direction:column;font-family:Jost,sans-serif;color:#efece4;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:26px 28px;border-bottom:1px solid rgba(200,168,90,.22);">' +
          '<h3 style="font-family:\'Cormorant Garamond\',serif;color:#f2e8d2;font-size:1.5rem;margin:0;">Mon Panier</h3>' +
          '<button onclick="closeCart()" style="background:none;border:none;color:#a7a299;font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>' +
        '</div>' +
        '<div id="regenx-cart-body" style="flex:1;overflow-y:auto;padding:20px 28px;"></div>' +
        '<div id="regenx-cart-footer" style="padding:22px 28px;border-top:1px solid rgba(200,168,90,.22);"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCart(); });
  }

  function renderCartModal() {
    var body = document.getElementById('regenx-cart-body');
    var footer = document.getElementById('regenx-cart-footer');
    if (!body || !footer) return;
    var cart = getCart();
    if (!cart.length) {
      body.innerHTML = '<p style="color:#a7a299;text-align:center;padding:40px 0;">Votre panier est vide.</p>';
      footer.innerHTML = '<a href="/boutique.html" style="display:block;text-align:center;border:1px solid #c8a85a;color:#e7d3a1;padding:14px;border-radius:2px;text-decoration:none;font-size:.74rem;letter-spacing:3px;text-transform:uppercase;">Decouvrir la boutique</a>';
      return;
    }
    var rows = '';
    cart.forEach(function (it) {
      var key = lineKey(it);
      rows +=
        '<div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(200,168,90,.12);">' +
          '<div style="flex:1;">' +
            '<div style="color:#f2e8d2;font-size:1rem;">' + it.name + '</div>' +
            (it.variant ? '<div style="color:#c8a85a;font-size:.78rem;letter-spacing:.5px;">Saveur : ' + it.variant + '</div>' : '') +
            '<div style="color:#a7a299;font-size:.75rem;margin-top:2px;">' + euro(it.price) + ' / unite</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<button onclick="RegenXCart.setQty(\'' + key + '\',' + ((it.qty||1)-1) + ')" style="width:28px;height:28px;border:1px solid rgba(200,168,90,.3);background:none;color:#e7d3a1;cursor:pointer;border-radius:2px;">&minus;</button>' +
            '<span style="min-width:22px;text-align:center;">' + (it.qty || 1) + '</span>' +
            '<button onclick="RegenXCart.setQty(\'' + key + '\',' + ((it.qty||1)+1) + ')" style="width:28px;height:28px;border:1px solid rgba(200,168,90,.3);background:none;color:#e7d3a1;cursor:pointer;border-radius:2px;">+</button>' +
          '</div>' +
          '<button onclick="RegenXCart.remove(\'' + key + '\')" style="background:none;border:none;color:#a7a299;cursor:pointer;font-size:.7rem;text-transform:uppercase;letter-spacing:1px;">Retirer</button>' +
        '</div>';
    });
    body.innerHTML = rows;
    footer.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
        '<span style="color:#a7a299;letter-spacing:2px;text-transform:uppercase;font-size:.72rem;">Total</span>' +
        '<span style="font-family:\'Cormorant Garamond\',serif;color:#e7d3a1;font-size:1.7rem;font-weight:600;">' + euro(cartTotal()) + '</span>' +
      '</div>' +
      '<button onclick="RegenXCart.checkout()" data-checkout style="display:block;width:100%;text-align:center;background:linear-gradient(135deg,#c8a85a,#e7d3a1);color:#0a0a0c;padding:16px;border:none;border-radius:2px;cursor:pointer;font-family:Jost,sans-serif;font-size:.78rem;letter-spacing:3px;text-transform:uppercase;font-weight:500;">Payer</button>' +
      '<a href="/boutique.html" style="display:block;text-align:center;color:#a7a299;text-decoration:none;font-size:.72rem;letter-spacing:2px;text-transform:uppercase;margin-top:14px;">Continuer mes achats</a>';
  }

  function showCart() {
    ensureCartModal();
    renderCartModal();
    var ov = document.getElementById('regenx-cart-overlay');
    if (ov) ov.style.display = 'flex';
  }
  function closeCart() {
    var ov = document.getElementById('regenx-cart-overlay');
    if (ov) ov.style.display = 'none';
  }

  /* ---------- Checkout Stripe ---------- */
  function checkout() {
    var cart = getCart();
    if (!cart.length) { showToast('Votre panier est vide.'); return; }
    var items = cart.map(function (it) {
      return {
        priceId: it.priceId,
        quantity: it.qty || 1,
        name: it.variant ? (it.name + ' - ' + it.variant) : it.name,
        variant: it.variant || '',
        productId: it.id
      };
    });
    var btns = document.querySelectorAll('[data-checkout]');
    btns.forEach(function (b) { b.disabled = true; });
    fetch('/api/stripe/checkout-boutique', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.url) { window.location.href = data.url; }
        else { window.location.href = '/erreur.html'; }
      })
      .catch(function () {
        btns.forEach(function (b) { b.disabled = false; });
        window.location.href = '/erreur.html';
      });
  }

  /* ---------- Liaison des boutons .add-to-cart ---------- */
  function bindButtons() {
    document.querySelectorAll('.add-to-cart[data-product-id]').forEach(function (btn) {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // Si une saveur est presente sur la page, on passe par addToCartWithSize
        if (document.querySelector('input[name="flavor"], input[name="size"]')) {
          addToCartWithSize(btn);
        } else {
          addToCart(
            btn.getAttribute('data-product-name'),
            btn.getAttribute('data-product-name'),
            btn.getAttribute('data-product-price'),
            btn.getAttribute('data-product-id'),
            ''
          );
        }
        showCart();
      });
    });
  }

  /* ---------- Exposition globale ---------- */
  window.RegenXCart = {
    get: getCart, save: saveCart, add: addToCart, addWithSize: addToCartWithSize,
    setQty: setQty, remove: removeItem, clear: clearCart, total: cartTotal,
    updateCount: updateCartCount, show: showCart, close: closeCart,
    checkout: checkout, lineKey: lineKey
  };
  window.addToCart = addToCart;
  window.addToCartWithSize = addToCartWithSize;
  window.updateCartCount = updateCartCount;
  window.showCart = showCart;
  window.closeCart = closeCart;

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    bindButtons();
  });
})(window);
/* ============================================================
   RegenX x Eric Favre - Panier (cart.js)
   Systeme de panier unifie : localStorage + modale (popup),
   sur le modele "Les Jardins Enchantes", adapte pour RegenX.
   - addToCart(id, name, price, priceId, variant)
   - addToCartWithSize(btn) : lit la saveur choisie (input[name="flavor"])
   - Modale panier (showCart / closeCart) avec recap + bouton Payer
   - checkout() -> POST /api/stripe/checkout -> redirection Stripe
   ============================================================ */
(function (window) {
  'use strict';

  // Incrementer cette version purge les anciens paniers (ex: changement de prix)
  var CART_VERSION = 'regenx-v1';
  var STORAGE_KEY  = 'regenx_cart';
  var VERSION_KEY  = 'regenx_cart_version';

  /* ---------- Stockage ---------- */
  function purgeOldCart() {
    if (localStorage.getItem(VERSION_KEY) !== CART_VERSION) {
      localStorage.setItem(STORAGE_KEY, '[]');
      localStorage.setItem(VERSION_KEY, CART_VERSION);
    }
  }

  function getCart() {
    purgeOldCart();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(VERSION_KEY, CART_VERSION);
    updateCartCount();
  }

  function lineKey(item) {
    return item.priceId + '::' + (item.variant || '');
  }

  /* ---------- Compteur header ---------- */
  function updateCartCount() {
    var cart = getCart();
    var n = cart.reduce(function (s, it) { return s + (it.qty || 1); }, 0);
    document.querySelectorAll('#cart-count, .cart-count').forEach(function (el) {
      el.textContent = n;
    });
  }

  /* ---------- Ajout ---------- */
  function addToCart(id, name, price, priceId, variant) {
    if (!priceId) { console.warn('addToCart: priceId manquant'); return; }
    var cart = getCart();
    var item = {
      id: id || priceId,
      name: name || 'Produit',
      price: parseFloat(price) || 0,
      priceId: priceId,
      variant: variant || '',
      qty: 1
    };
    var key = lineKey(item);
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) { found = cart[i]; break; }
    }
    if (found) { found.qty = (found.qty || 1) + 1; }
    else { cart.push(item); }
    saveCart(cart);
    showToast((variant ? name + ' (' + variant + ')' : name) + ' ajoute au panier');
  }

  // Lit la saveur choisie sur la fiche produit (input[name="flavor"]:checked)
  function addToCartWithSize(btn) {
    var scope = btn.closest('[data-product]') || document;
    var checked = scope.querySelector('input[name="flavor"]:checked, input[name="size"]:checked');
    var variant = checked ? checked.value : '';
    var priceId = (checked && checked.getAttribute('data-price-id')) ||
                  btn.getAttribute('data-product-id');
    addToCart(
      btn.getAttribute('data-product-id-base') || btn.getAttribute('data-product-name'),
      btn.getAttribute('data-product-name'),
      btn.getAttribute('data-product-price'),
      priceId,
      variant
    );
  }

  /* ---------- Quantites / suppression ---------- */
  function setQty(key, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) { cart[i].qty = Math.max(1, qty); break; }
    }
    saveCart(cart); renderCartModal();
  }
  function removeItem(key) {
    var cart = getCart().filter(function (it) { return lineKey(it) !== key; });
    saveCart(cart); renderCartModal();
  }
  function clearCart() { saveCart([]); renderCartModal(); }

  function cartTotal() {
    return getCart().reduce(function (s, it) { return s + (it.price || 0) * (it.qty || 1); }, 0);
  }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' \u20ac'; }

  /* ---------- Toast ---------- */
  function showToast(message) {
    var t = document.getElementById('regenx-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'regenx-toast';
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,#c8a85a,#e7d3a1);color:#0a0a0c;padding:14px 28px;border-radius:3px;font-family:Jost,sans-serif;font-size:.8rem;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;z-index:9999;opacity:0;transition:all .35s ease;box-shadow:0 10px 30px -8px rgba(0,0,0,.6);';
      document.body.appendChild(t);
    }
    t.textContent = message;
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  /* ---------- Modale panier ---------- */
  function ensureCartModal() {
    if (document.getElementById('regenx-cart-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'regenx-cart-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:9998;display:none;align-items:flex-start;justify-content:flex-end;';
    overlay.innerHTML =
      '<div id="regenx-cart-panel" style="width:100%;max-width:440px;height:100%;background:linear-gradient(180deg,#141416,#0e0e10);border-left:1px solid rgba(200,168,90,.22);display:flex;flex-direction:column;font-family:Jost,sans-serif;color:#efece4;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:26px 28px;border-bottom:1px solid rgba(200,168,90,.22);">' +
          '<h3 style="font-family:\'Cormorant Garamond\',serif;color:#f2e8d2;font-size:1.5rem;margin:0;">Mon Panier</h3>' +
          '<button onclick="closeCart()" style="background:none;border:none;color:#a7a299;font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>' +
        '</div>' +
        '<div id="regenx-cart-body" style="flex:1;overflow-y:auto;padding:20px 28px;"></div>' +
        '<div id="regenx-cart-footer" style="padding:22px 28px;border-top:1px solid rgba(200,168,90,.22);"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCart(); });
  }

  function renderCartModal() {
    var body = document.getElementById('regenx-cart-body');
    var footer = document.getElementById('regenx-cart-footer');
    if (!body || !footer) return;
    var cart = getCart();
    if (!cart.length) {
      body.innerHTML = '<p style="color:#a7a299;text-align:center;padding:40px 0;">Votre panier est vide.</p>';
      footer.innerHTML = '<a href="/boutique.html" style="display:block;text-align:center;border:1px solid #c8a85a;color:#e7d3a1;padding:14px;border-radius:2px;text-decoration:none;font-size:.74rem;letter-spacing:3px;text-transform:uppercase;">Decouvrir la boutique</a>';
      return;
    }
    var rows = '';
    cart.forEach(function (it) {
      var key = lineKey(it);
      rows +=
        '<div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(200,168,90,.12);">' +
          '<div style="flex:1;">' +
            '<div style="color:#f2e8d2;font-size:1rem;">' + it.name + '</div>' +
            (it.variant ? '<div style="color:#c8a85a;font-size:.78rem;letter-spacing:.5px;">Saveur : ' + it.variant + '</div>' : '') +
            '<div style="color:#a7a299;font-size:.75rem;margin-top:2px;">' + euro(it.price) + ' / unite</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<button onclick="RegenXCart.setQty(\'' + key + '\',' + ((it.qty||1)-1) + ')" style="width:28px;height:28px;border:1px solid rgba(200,168,90,.3);background:none;color:#e7d3a1;cursor:pointer;border-radius:2px;">&minus;</button>' +
            '<span style="min-width:22px;text-align:center;">' + (it.qty || 1) + '</span>' +
            '<button onclick="RegenXCart.setQty(\'' + key + '\',' + ((it.qty||1)+1) + ')" style="width:28px;height:28px;border:1px solid rgba(200,168,90,.3);background:none;color:#e7d3a1;cursor:pointer;border-radius:2px;">+</button>' +
          '</div>' +
          '<button onclick="RegenXCart.remove(\'' + key + '\')" style="background:none;border:none;color:#a7a299;cursor:pointer;font-size:.7rem;text-transform:uppercase;letter-spacing:1px;">Retirer</button>' +
        '</div>';
    });
    body.innerHTML = rows;
    footer.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
        '<span style="color:#a7a299;letter-spacing:2px;text-transform:uppercase;font-size:.72rem;">Total</span>' +
        '<span style="font-family:\'Cormorant Garamond\',serif;color:#e7d3a1;font-size:1.7rem;font-weight:600;">' + euro(cartTotal()) + '</span>' +
      '</div>' +
      '<button onclick="RegenXCart.checkout()" data-checkout style="display:block;width:100%;text-align:center;background:linear-gradient(135deg,#c8a85a,#e7d3a1);color:#0a0a0c;padding:16px;border:none;border-radius:2px;cursor:pointer;font-family:Jost,sans-serif;font-size:.78rem;letter-spacing:3px;text-transform:uppercase;font-weight:500;">Payer</button>' +
      '<a href="/boutique.html" style="display:block;text-align:center;color:#a7a299;text-decoration:none;font-size:.72rem;letter-spacing:2px;text-transform:uppercase;margin-top:14px;">Continuer mes achats</a>';
  }

  function showCart() {
    ensureCartModal();
    renderCartModal();
    var ov = document.getElementById('regenx-cart-overlay');
    if (ov) ov.style.display = 'flex';
  }
  function closeCart() {
    var ov = document.getElementById('regenx-cart-overlay');
    if (ov) ov.style.display = 'none';
  }

  /* ---------- Checkout Stripe ---------- */
  function checkout() {
    var cart = getCart();
    if (!cart.length) { showToast('Votre panier est vide.'); return; }
    var items = cart.map(function (it) {
      return {
        priceId: it.priceId,
        quantity: it.qty || 1,
        name: it.variant ? (it.name + ' - ' + it.variant) : it.name,
        variant: it.variant || '',
        productId: it.id
      };
    });
    var btns = document.querySelectorAll('[data-checkout]');
    btns.forEach(function (b) { b.disabled = true; });
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.url) { window.location.href = data.url; }
        else { window.location.href = '/erreur.html'; }
      })
      .catch(function () {
        btns.forEach(function (b) { b.disabled = false; });
        window.location.href = '/erreur.html';
      });
  }

  /* ---------- Liaison des boutons .add-to-cart ---------- */
  function bindButtons() {
    document.querySelectorAll('.add-to-cart[data-product-id]').forEach(function (btn) {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // Si une saveur est presente sur la page, on passe par addToCartWithSize
        if (document.querySelector('input[name="flavor"], input[name="size"]')) {
          addToCartWithSize(btn);
        } else {
          addToCart(
            btn.getAttribute('data-product-name'),
            btn.getAttribute('data-product-name'),
            btn.getAttribute('data-product-price'),
            btn.getAttribute('data-product-id'),
            ''
          );
        }
        showCart();
      });
    });
  }

  /* ---------- Exposition globale ---------- */
  window.RegenXCart = {
    get: getCart, save: saveCart, add: addToCart, addWithSize: addToCartWithSize,
    setQty: setQty, remove: removeItem, clear: clearCart, total: cartTotal,
    updateCount: updateCartCount, show: showCart, close: closeCart,
    checkout: checkout, lineKey: lineKey
  };
  window.addToCart = addToCart;
  window.addToCartWithSize = addToCartWithSize;
  window.updateCartCount = updateCartCount;
  window.showCart = showCart;
  window.closeCart = closeCart;

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    bindButtons();
  });
})(window);
