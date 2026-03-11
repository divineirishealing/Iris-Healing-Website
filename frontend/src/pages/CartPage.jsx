import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../hooks/use-toast';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { resolveImageUrl } from '../lib/imageUtils';
import {
  ShoppingCart, Trash2, Plus, User, Monitor, Wifi, ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';

const COUNTRIES = [
  { code: "IN", name: "India" }, { code: "AE", name: "UAE" }, { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" }, { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
  { code: "SA", name: "Saudi Arabia" }, { code: "QA", name: "Qatar" }, { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" }, { code: "LK", name: "Sri Lanka" }, { code: "MY", name: "Malaysia" },
  { code: "JP", name: "Japan" }, { code: "ZA", name: "South Africa" },
].sort((a, b) => a.name.localeCompare(b.name));
const GENDERS = ["Female", "Male", "Non-Binary", "Prefer not to say"];
const RELATIONSHIPS = ["Myself", "Mother", "Father", "Sister", "Brother", "Spouse", "Friend", "Colleague", "Other"];

const emptyParticipant = (mode = 'online') => ({
  name: '', relationship: 'Myself', age: '', gender: '', country: 'AE',
  attendance_mode: mode, notify: false, email: '', phone: '',
});

const CartItemCard = ({ item, onRemove, onUpdateParticipants, symbol, getItemPrice }) => {
  const [expanded, setExpanded] = useState(true);
  const tier = item.durationTiers?.[item.tierIndex];
  const price = getItemPrice(item);
  const pCount = item.participants.length;

  const updateParticipant = (idx, field, value) => {
    const updated = [...item.participants];
    updated[idx] = { ...updated[idx], [field]: value };
    onUpdateParticipants(updated);
  };

  const addParticipant = () => {
    onUpdateParticipants([...item.participants, emptyParticipant(item.sessionMode === 'remote' ? 'offline' : 'online')]);
  };

  const removeParticipant = (idx) => {
    if (item.participants.length <= 1) return;
    onUpdateParticipants(item.participants.filter((_, i) => i !== idx));
  };

  return (
    <div data-testid={`cart-item-${item.id}`} className="bg-white rounded-xl border shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 border-b">
        <img src={resolveImageUrl(item.programImage)} alt={item.programTitle}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=100&h=100&fit=crop'; }} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{item.programTitle}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-medium">{tier?.label || 'Standard'}</span>
            <span className="text-[10px] text-gray-400">{symbol} {price.toLocaleString()} / person</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#D4AF37]">{symbol} {(price * pCount).toLocaleString()}</span>
          <button onClick={onRemove} data-testid={`cart-remove-${item.id}`} className="text-red-400 hover:text-red-600 transition-colors p-1">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Participants toggle */}
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
        <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
          <User size={14} className="text-[#D4AF37]" />
          {pCount} Participant{pCount > 1 ? 's' : ''}
        </span>
        {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>

      {/* Participants */}
      {expanded && (
        <div className="px-4 pb-4">
          {item.participants.map((p, idx) => (
            <div key={idx} data-testid={`cart-participant-${item.id}-${idx}`}
              className="border rounded-lg p-3 mb-2 bg-gray-50 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#D4AF37]">Participant {idx + 1}</span>
                {item.participants.length > 1 && (
                  <button onClick={() => removeParticipant(idx)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] text-gray-500 block">Name *</label>
                  <Input value={p.name} onChange={e => updateParticipant(idx, 'name', e.target.value)}
                    placeholder="Full name" className="text-xs h-8" data-testid={`cp-name-${item.id}-${idx}`} />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block">Relationship *</label>
                  <select value={p.relationship} onChange={e => updateParticipant(idx, 'relationship', e.target.value)}
                    className="w-full border rounded-md px-2 py-1.5 text-xs bg-white h-8">
                    <option value="">Select</option>
                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block">Age *</label>
                  <Input type="number" min="5" max="120" value={p.age}
                    onChange={e => updateParticipant(idx, 'age', e.target.value)}
                    placeholder="Age" className="text-xs h-8" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block">Gender *</label>
                  <select value={p.gender} onChange={e => updateParticipant(idx, 'gender', e.target.value)}
                    className="w-full border rounded-md px-2 py-1.5 text-xs bg-white h-8">
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-[9px] text-gray-500 block">Country</label>
                  <select value={p.country} onChange={e => updateParticipant(idx, 'country', e.target.value)}
                    className="w-full border rounded-md px-2 py-1.5 text-xs bg-white h-8">
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block">Mode</label>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => updateParticipant(idx, 'attendance_mode', 'online')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border text-[10px] transition-all ${
                        p.attendance_mode === 'online' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white border-gray-200 text-gray-500'
                      }`}>
                      <Monitor size={10} /> Zoom
                    </button>
                    <button type="button" onClick={() => updateParticipant(idx, 'attendance_mode', 'offline')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border text-[10px] transition-all ${
                        p.attendance_mode === 'offline' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white border-gray-200 text-gray-500'
                      }`}>
                      <Wifi size={10} /> Remote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addParticipant} data-testid={`cart-add-participant-${item.id}`}
            className="w-full border border-dashed border-[#D4AF37]/40 rounded-lg py-2 flex items-center justify-center gap-1 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors">
            <Plus size={14} /> Add Participant
          </button>
        </div>
      )}
    </div>
  );
};

function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateItemParticipants, clearCart } = useCart();
  const { getPrice, symbol } = useCurrency();
  const { toast } = useToast();

  const getItemPrice = (item) => {
    const tiers = item.durationTiers || [];
    const tier = tiers[item.tierIndex];
    if (!tier) return 0;
    // Build a fake item for getPrice
    const fakeProgram = { is_flagship: item.isFlagship, duration_tiers: tiers };
    return getPrice(fakeProgram, item.tierIndex);
  };

  const totalAmount = items.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.participants.length;
  }, 0);

  const totalParticipants = items.reduce((sum, i) => sum + i.participants.length, 0);

  const validateAndProceed = () => {
    for (const item of items) {
      for (let i = 0; i < item.participants.length; i++) {
        const p = item.participants[i];
        if (!p.name.trim()) return toast({ title: `${item.programTitle}: Participant ${i + 1} needs a name`, variant: 'destructive' });
        if (!p.relationship) return toast({ title: `${item.programTitle}: Participant ${i + 1} needs relationship`, variant: 'destructive' });
        if (!p.age || parseInt(p.age) < 5) return toast({ title: `${item.programTitle}: Participant ${i + 1} needs valid age (5+)`, variant: 'destructive' });
        if (!p.gender) return toast({ title: `${item.programTitle}: Participant ${i + 1} needs gender`, variant: 'destructive' });
      }
    }
    navigate('/cart/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingCart size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Browse our programs and add them to your cart</p>
          <Button onClick={() => navigate('/')} className="bg-[#D4AF37] hover:bg-[#b8962e] text-white rounded-full px-8">Browse Programs</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 data-testid="cart-title" className="text-2xl md:text-3xl text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500 mt-1">{items.length} program{items.length > 1 ? 's' : ''} &middot; {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { clearCart(); toast({ title: 'Cart cleared' }); }} data-testid="clear-cart-btn"
              className="text-xs text-red-500 hover:text-red-700 transition-colors">Clear All</button>
          </div>

          {/* Cart items */}
          {items.map(item => (
            <CartItemCard key={item.id} item={item}
              onRemove={() => removeItem(item.id)}
              onUpdateParticipants={(p) => updateItemParticipants(item.id, p)}
              symbol={symbol} getItemPrice={getItemPrice} />
          ))}

          {/* Summary & Checkout */}
          <div className="bg-white rounded-xl border shadow-sm p-5 mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Subtotal ({totalParticipants} participant{totalParticipants > 1 ? 's' : ''})</span>
              <span className="text-sm text-gray-600">{symbol} {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3 mt-3">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-bold text-lg text-[#D4AF37]">{symbol} {totalAmount.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-right mb-4">Promo codes can be applied at checkout</p>

            <Button data-testid="proceed-checkout-btn" onClick={validateAndProceed}
              className="w-full bg-[#D4AF37] hover:bg-[#b8962e] text-white py-3 rounded-full text-sm">
              Proceed to Checkout <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
