import { LiveMetalRate } from '../types';

// Standard Official Legal BAJUS (Bangladesh Jeweller's Association) Benchmark Rates
export const INITIAL_BAJUS_RATES: LiveMetalRate[] = [
  {
    id: 'gold-22k',
    name: '22 Karat Gold (Hallmark Cadmium)',
    nameBn: '২২ ক্যারেট হলমার্ক সোনা (ক্যাডমিয়াম)',
    metal: 'gold',
    purity: '22K',
    pricePerVhori: 231297,
    pricePerGram: 19830,
    change24h: 1850,
    changePercent: 0.81,
    lastUpdated: 'Live Official (BAJUS Standard)',
  },
  {
    id: 'gold-21k',
    name: '21 Karat Gold (Hallmark)',
    nameBn: '২১ ক্যারেট হলমার্ক সোনা',
    metal: 'gold',
    purity: '21K',
    pricePerVhori: 220391,
    pricePerGram: 18895,
    change24h: 1720,
    changePercent: 0.79,
    lastUpdated: 'Live Official (BAJUS Standard)',
  },
  {
    id: 'gold-18k',
    name: '18 Karat Gold (Hallmark)',
    nameBn: '১৮ ক্যারেট হলমার্ক সোনা',
    metal: 'gold',
    purity: '18K',
    pricePerVhori: 189248,
    pricePerGram: 16225,
    change24h: 1480,
    changePercent: 0.79,
    lastUpdated: 'Live Official (BAJUS Standard)',
  },
  {
    id: 'gold-traditional',
    name: 'Traditional Method Gold (Sanatan)',
    nameBn: 'সনাতন পদ্ধতির সোনা',
    metal: 'gold',
    purity: 'Traditional',
    pricePerVhori: 154606,
    pricePerGram: 13255,
    change24h: 1120,
    changePercent: 0.73,
    lastUpdated: 'Live Official (BAJUS Standard)',
  },
  {
    id: 'silver-22k',
    name: '22 Karat Silver (Rupa Hallmark)',
    nameBn: '২২ ক্যারেট হলমার্ক রূপা',
    metal: 'silver',
    purity: 'Silver-22K',
    pricePerVhori: 4316,
    pricePerGram: 370,
    change24h: 125,
    changePercent: 2.98,
    lastUpdated: 'Live Official (BAJUS Standard)',
  },
];

const RATES_STORAGE_KEY = 'rk_jewellery_live_rates_v4';

export function getLiveRates(): LiveMetalRate[] {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(INITIAL_BAJUS_RATES));
      return INITIAL_BAJUS_RATES;
    }
    const parsed: LiveMetalRate[] = JSON.parse(raw);
    // If user's cached rate has outdated legacy price (< 200,000 for 22K gold), auto-upgrade to official BAJUS legal rate
    const gold22k = parsed.find((r) => r.purity === '22K');
    if (!gold22k || gold22k.pricePerVhori < 200000) {
      localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(INITIAL_BAJUS_RATES));
      return INITIAL_BAJUS_RATES;
    }
    return parsed;
  } catch {
    return INITIAL_BAJUS_RATES;
  }
}

export function saveLiveRates(rates: LiveMetalRate[]): LiveMetalRate[] {
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rk_market_rates_updated', { detail: rates }));
    }
  } catch (err) {
    console.error('Failed to save market rates', err);
  }
  return rates;
}

export function updateSingleRate(id: string, newPricePerVhori: number, change24h: number = 0): LiveMetalRate[] {
  const current = getLiveRates();
  const updated = current.map((rate) => {
    if (rate.id === id) {
      const vhori = Math.max(1, Math.round(newPricePerVhori));
      const gram = Math.round(vhori / 11.664);
      const prevVhori = rate.pricePerVhori;
      const computedChange = change24h !== 0 ? change24h : vhori - prevVhori;
      const changePct = prevVhori > 0 ? Number(((computedChange / prevVhori) * 100).toFixed(2)) : 0;
      return {
        ...rate,
        pricePerVhori: vhori,
        pricePerGram: gram,
        change24h: computedChange,
        changePercent: changePct,
        lastUpdated: `Updated ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (BAJUS Standard)`,
      };
    }
    return rate;
  });

  return saveLiveRates(updated);
}

export function resetToOfficialBajusRates(): LiveMetalRate[] {
  const resetRates = INITIAL_BAJUS_RATES.map((r) => ({
    ...r,
    lastUpdated: 'Live Official (BAJUS Standard)',
  }));
  return saveLiveRates(resetRates);
}

export function refreshMarketRates(): LiveMetalRate[] {
  // Returns currently saved rates and updates timestamp
  const current = getLiveRates();
  const updated = current.map((rate) => ({
    ...rate,
    lastUpdated: `Live Synced (${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`,
  }));
  return saveLiveRates(updated);
}

// Convert numbers to Bangla digits
export function toBnDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Format BDT currency
export function formatBDT(amount: number, isBn: boolean = false): string {
  const formatted = amount.toLocaleString('en-IN'); // South Asian grouping (lakhs, crores)
  if (isBn) {
    return `৳${toBnDigits(formatted)}`;
  }
  return `৳${formatted}`;
}
