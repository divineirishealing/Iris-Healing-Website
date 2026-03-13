import React from 'react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { ArrowUp, ArrowDown, Eye, EyeOff, LayoutList, LayoutDashboard, Star, FileText } from 'lucide-react';

const DEFAULT_CONFIG = {
  homepage_list: [
    { key: 'session_name', label: 'Session Name', visible: true },
    { key: 'session_type', label: 'Session Type (Online/Offline)', visible: false },
    { key: 'duration', label: 'Duration', visible: false },
  ],
  homepage_detail: [
    { key: 'session_type_badge', label: 'Session Type Badge', visible: true },
    { key: 'duration_badge', label: 'Duration Badge', visible: true },
    { key: 'title', label: 'Session Title', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'testimonial', label: 'Testimonial Quote', visible: true },
    { key: 'price', label: 'Price', visible: true },
    { key: 'calendar', label: 'Calendar', visible: true },
    { key: 'time_slots', label: 'Time Slots', visible: true },
    { key: 'book_button', label: 'View Details & Book Button', visible: true },
  ],
  detail_hero: [
    { key: 'back_button', label: 'Back Button', visible: true },
    { key: 'session_type_badge', label: 'Session Type Badge', visible: true },
    { key: 'duration_badge', label: 'Duration Badge', visible: true },
    { key: 'title', label: 'Session Title', visible: true },
    { key: 'gold_line', label: 'Gold Line Separator', visible: true },
    { key: 'price', label: 'Price', visible: true },
  ],
  detail_body: [
    { key: 'about_section', label: 'About This Session', visible: true },
    { key: 'testimonials', label: 'What Clients Say', visible: true },
    { key: 'info_cards', label: 'What to Expect & Who Is This For', visible: true },
    { key: 'booking_sidebar', label: 'Booking Calendar & Sidebar', visible: true },
    { key: 'question_form', label: 'Question Form', visible: true },
  ],
};

const SECTION_META = [
  { key: 'homepage_list', label: 'Homepage — Session List (Left Side)', icon: LayoutList, desc: 'Elements shown for each session in the left sidebar list' },
  { key: 'homepage_detail', label: 'Homepage — Selected Session (Right Side)', icon: LayoutDashboard, desc: 'Elements shown when a session is selected' },
  { key: 'detail_hero', label: 'Session Page — Hero Section', icon: Star, desc: 'Elements in the top hero banner of each session page' },
  { key: 'detail_body', label: 'Session Page — Body Content', icon: FileText, desc: 'Content sections below the hero on each session page' },
];

const mergeWithDefaults = (saved, defaults) => {
  if (!saved || !Array.isArray(saved) || saved.length === 0) {
    return defaults.map((d, i) => ({ ...d, order: i }));
  }
  const result = [];
  const savedMap = {};
  saved.forEach((s, i) => { savedMap[s.key] = { ...s, order: s.order ?? i }; });
  defaults.forEach((d, i) => {
    if (savedMap[d.key]) {
      result.push({ ...d, ...savedMap[d.key] });
    } else {
      result.push({ ...d, order: saved.length + i });
    }
  });
  result.sort((a, b) => a.order - b.order);
  return result;
};

const ElementRow = ({ item, idx, total, onToggle, onMove }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${item.visible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}
    data-testid={`vis-item-${item.key}`}>
    <div className="flex flex-col gap-0.5">
      <button type="button" disabled={idx === 0} onClick={() => onMove(idx, -1)}
        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20"><ArrowUp size={10} /></button>
      <button type="button" disabled={idx === total - 1} onClick={() => onMove(idx, 1)}
        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20"><ArrowDown size={10} /></button>
    </div>
    <span className="text-[10px] font-bold text-gray-400 w-5">#{idx + 1}</span>
    <span className="flex-1 text-[11px] text-gray-700 font-medium">{item.label}</span>
    {item.visible ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-300" />}
    <Switch checked={item.visible} onCheckedChange={() => onToggle(idx)} />
  </div>
);

const SessionVisibilityPanel = ({ settings, onChange }) => {
  const heroes = settings.page_heroes || {};
  const sessionTpl = heroes.session_template || {};
  const visibility = sessionTpl.visibility || {};

  const getItems = (sectionKey) => mergeWithDefaults(visibility[sectionKey], DEFAULT_CONFIG[sectionKey]);

  const updateSection = (sectionKey, items) => {
    const updatedVis = { ...visibility, [sectionKey]: items.map((item, i) => ({ key: item.key, label: item.label, visible: item.visible, order: i })) };
    const updatedTpl = { ...sessionTpl, visibility: updatedVis };
    const updatedHeroes = { ...heroes, session_template: updatedTpl };
    onChange({ ...settings, page_heroes: updatedHeroes });
  };

  const toggleItem = (sectionKey, idx) => {
    const items = getItems(sectionKey);
    items[idx] = { ...items[idx], visible: !items[idx].visible };
    updateSection(sectionKey, items);
  };

  const moveItem = (sectionKey, idx, dir) => {
    const items = getItems(sectionKey);
    const sw = idx + dir;
    if (sw < 0 || sw >= items.length) return;
    [items[idx], items[sw]] = [items[sw], items[idx]];
    updateSection(sectionKey, items);
  };

  return (
    <div className="bg-white rounded-xl border p-4 mb-4" data-testid="session-visibility-panel">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Session Element Visibility & Order</h3>
        <p className="text-[10px] text-gray-400">Control which elements appear on the homepage sessions section and each session detail page. Toggle ON/OFF and reorder with arrows. Applies uniformly to all sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTION_META.map(({ key: sectionKey, label, icon: Icon, desc }) => {
          const items = getItems(sectionKey);
          return (
            <div key={sectionKey} className="bg-gray-50 rounded-lg p-3 border border-gray-100" data-testid={`vis-section-${sectionKey}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-purple-500" />
                <Label className="text-[10px] font-semibold text-gray-700">{label}</Label>
              </div>
              <p className="text-[9px] text-gray-400 mb-2">{desc}</p>
              <div className="space-y-1">
                {items.map((item, idx) => (
                  <ElementRow key={item.key} item={item} idx={idx} total={items.length}
                    onToggle={() => toggleItem(sectionKey, idx)}
                    onMove={(i, dir) => moveItem(sectionKey, i, dir)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionVisibilityPanel;
export { DEFAULT_CONFIG, mergeWithDefaults };
